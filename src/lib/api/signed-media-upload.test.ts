import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from './fetcher';
import {
  buildSignedUploadForm,
  chooseSignedUploadFile,
  SIGNED_UPLOAD_MESSAGES,
  uploadSignedMedia,
  type SignedMediaUploadTicket,
} from './signed-media-upload';

const ticket: SignedMediaUploadTicket = {
  uploadUrl: 'https://api.cloudinary.test/v1_1/demo/image/upload',
  apiKey: 'key-1',
  timestamp: 1_700_000_000,
  signature: 'sig-1',
  folder: 'payments/evidence',
  publicId: 'evidence-1',
  allowedFormats: ['jpg', 'png', 'webp'],
  overwrite: false,
  uniqueFilename: false,
  maxBytes: 1024,
};

const image = (size = 10, type = 'image/png') => new File([new Uint8Array(size)], 'proof.png', { type });

const providerBody = { public_id: 'evidence-1', version: 7, signature: 'provider-sig', secure_url: 'https://cdn.test/e.png' };

function okResponse(body: unknown = providerBody) {
  return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('buildSignedUploadForm', () => {
  it('sets exactly the nine signed fields', () => {
    const file = image();
    const form = buildSignedUploadForm(file, ticket);

    expect([...form.keys()].sort()).toEqual(
      ['allowed_formats', 'api_key', 'file', 'folder', 'overwrite', 'public_id', 'signature', 'timestamp', 'unique_filename'].sort(),
    );
    expect(form.get('api_key')).toBe('key-1');
    expect(form.get('timestamp')).toBe('1700000000');
    expect(form.get('signature')).toBe('sig-1');
    expect(form.get('folder')).toBe('payments/evidence');
    expect(form.get('public_id')).toBe('evidence-1');
    expect(form.get('allowed_formats')).toBe('jpg,png,webp');
    expect(form.get('overwrite')).toBe('false');
    expect(form.get('unique_filename')).toBe('false');
    expect((form.get('file') as File).name).toBe('proof.png');
  });
});

describe('uploadSignedMedia', () => {
  it('rejects an unsupported MIME type before requesting a signature', async () => {
    const requestTicket = vi.fn();
    await expect(uploadSignedMedia(image(10, 'image/gif'), requestTicket)).rejects.toThrow(
      SIGNED_UPLOAD_MESSAGES.unsupportedType,
    );
    expect(requestTicket).not.toHaveBeenCalled();
  });

  it('rejects a file larger than the signed maxBytes without uploading', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(uploadSignedMedia(image(2048), async () => ticket)).rejects.toThrow(SIGNED_UPLOAD_MESSAGES.tooLarge(1024));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('requests a signature with the file metadata and posts the signed form', async () => {
    const fetchMock = vi.fn(async () => okResponse());
    vi.stubGlobal('fetch', fetchMock);
    const requestTicket = vi.fn(async () => ticket);
    const controller = new AbortController();

    const result = await uploadSignedMedia(image(10), requestTicket, controller.signal);

    expect(requestTicket).toHaveBeenCalledWith({ fileName: 'proof.png', contentType: 'image/png', sizeBytes: 10 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(ticket.uploadUrl);
    expect(init.method).toBe('POST');
    expect(init.signal).toBe(controller.signal);
    expect(init.body).toBeInstanceOf(FormData);
    expect(result).toEqual({ publicId: 'evidence-1', version: 7, signature: 'provider-sig', secureUrl: 'https://cdn.test/e.png' });
  });

  it('normalizes a provider HTTP failure to ApiError with a readable message', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: { message: 'Invalid Signature' } }), { status: 401 })));

    const failure = await uploadSignedMedia(image(), async () => ticket).catch((error: unknown) => error);

    expect(failure).toBeInstanceOf(ApiError);
    expect((failure as ApiError).status).toBe(401);
    expect((failure as ApiError<{ message: string }>).payload.message).toBe(SIGNED_UPLOAD_MESSAGES.uploadFailed);
  });

  it('normalizes a network failure to ApiError with status 0', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Failed to fetch'); }));

    const failure = await uploadSignedMedia(image(), async () => ticket).catch((error: unknown) => error);

    expect(failure).toBeInstanceOf(ApiError);
    expect((failure as ApiError).status).toBe(0);
  });

  it('rethrows the abort error instead of normalizing it', async () => {
    const controller = new AbortController();
    const abortError = new DOMException('The operation was aborted.', 'AbortError');
    vi.stubGlobal('fetch', vi.fn(async () => {
      controller.abort();
      throw abortError;
    }));

    await expect(uploadSignedMedia(image(), async () => ticket, controller.signal)).rejects.toBe(abortError);
  });
});

describe('uploadSignedMedia with client-side optimization', () => {
  const optimized = new File([new Uint8Array(4)], 'proof.webp', { type: 'image/webp' });

  it('requests the signature for and uploads the optimized file', async () => {
    const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => okResponse());
    vi.stubGlobal('fetch', fetchMock);
    const requestTicket = vi.fn(async () => ticket);
    const optimize = vi.fn(async () => optimized);

    await uploadSignedMedia(image(2048), requestTicket, undefined, { optimize, maxEdge: 512 });

    expect(optimize).toHaveBeenCalledWith(expect.any(File), 512);
    expect(requestTicket).toHaveBeenCalledWith({ fileName: 'proof.webp', contentType: 'image/webp', sizeBytes: 4 });
    const form = fetchMock.mock.calls[0][1].body as FormData;
    expect((form.get('file') as File).name).toBe('proof.webp');
  });

  it('falls back to the original when optimization throws or yields a type outside the allowlist', async () => {
    for (const optimize of [
      async () => Promise.reject(new Error('canvas')),
      async () => new File([new Uint8Array(1)], 'x.bmp', { type: 'image/bmp' }),
    ]) {
      const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => okResponse());
      vi.stubGlobal('fetch', fetchMock);
      const requestTicket = vi.fn(async () => ticket);
      await uploadSignedMedia(image(10), requestTicket, undefined, { optimize });
      expect(requestTicket).toHaveBeenCalledWith({ fileName: 'proof.png', contentType: 'image/png', sizeBytes: 10 });
    }
  });

  it('sends the original when the signed allowlist excludes the optimized format', async () => {
    const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => okResponse());
    vi.stubGlobal('fetch', fetchMock);
    await uploadSignedMedia(image(10), async () => ({ ...ticket, allowedFormats: ['png'] }), undefined, {
      optimize: async () => optimized,
    });
    const form = fetchMock.mock.calls[0][1].body as FormData;
    expect((form.get('file') as File).name).toBe('proof.png');
  });
});

describe('chooseSignedUploadFile', () => {
  const original = new File([new Uint8Array(10)], 'a.png', { type: 'image/png' });
  const jpeg = new File([new Uint8Array(5)], 'a.jpg', { type: 'image/jpeg' });

  it('accepts jpg/jpeg aliases case-insensitively and keeps the original otherwise', () => {
    expect(chooseSignedUploadFile(original, jpeg, ['JPG'])).toBe(jpeg);
    expect(chooseSignedUploadFile(original, jpeg, ['png'])).toBe(original);
    expect(chooseSignedUploadFile(original, original, [])).toBe(original);
  });
});
