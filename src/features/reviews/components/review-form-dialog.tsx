'use client';

import Image from 'next/image';
import { FormEvent, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { InlineAlert, Spinner } from '@/foundation/components/feedback';
import { Field, TextInput, Textarea } from '@/foundation/components/field-system';
import { Modal } from '@/foundation/components/overlay';
import { RatingStars } from '@/foundation/components/indicators';
import { createAccountProductReview } from '@/generated/api/reviews/reviews';
import { apiErrorMessage } from '@/lib/api/error-message';
import { uploadReviewMedia, type UploadedReviewMedia } from '../api/review-media-upload';

const MAX_MEDIA = 5;
const FIELD_LABEL = 'text-sm font-bold text-neutral-800';

function RequiredMark() {
  return <span className="text-red-600">*</span>;
}

function messageOf(error: unknown): string {
  return apiErrorMessage(
    error,
    error instanceof Error ? error.message : 'Không thể gửi đánh giá. Vui lòng thử lại.',
  );
}

export function ReviewFormDialog({
  orderItemId,
  productName,
  onClose,
  onSubmitted,
}: {
  orderItemId: string;
  productName: string;
  onClose: () => void;
  onSubmitted: (orderItemId: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<UploadedReviewMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const pickImages = async (files: FileList | null) => {
    if (!files) return;
    setError(undefined);
    const selected = Array.from(files).slice(0, Math.max(0, MAX_MEDIA - media.length));
    if (selected.length === 0) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(selected.map((file) => uploadReviewMedia(file)));
      setMedia((current) => [...current, ...uploaded].slice(0, MAX_MEDIA));
    } catch (cause) {
      setError(messageOf(cause));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title.trim().length < 3 || content.trim().length < 10) {
      setError('Tiêu đề cần ít nhất 3 ký tự và nội dung cần ít nhất 10 ký tự.');
      return;
    }
    setSubmitting(true);
    setError(undefined);
    try {
      await createAccountProductReview({
        orderItemId,
        rating,
        title: title.trim(),
        content: content.trim(),
        mediaAssetIds: media.map((item) => item.mediaAssetId),
      });
      onSubmitted(orderItemId);
    } catch (cause) {
      setError(messageOf(cause));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      disableClose={submitting}
      labelledBy="review-dialog-title"
      backdropClassName="fixed inset-0 z-[80] grid place-items-center bg-neutral-950/60 p-4"
      className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
    >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-neutral-900">Đánh giá đã mua hàng</p>
            <h2 id="review-dialog-title" className="mt-1 text-xl font-black text-neutral-950">{productName}</h2>
            <p className="mt-1 text-sm text-neutral-500">Đánh giá được hiển thị ngay sau khi gửi.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={submitting} className="size-9 shrink-0 rounded-full bg-neutral-100 text-neutral-600" aria-label="Đóng"><X aria-hidden className="size-4" /></Button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-5">
          <fieldset>
            <legend className={FIELD_LABEL}>Mức độ hài lòng <RequiredMark /></legend>
            <RatingStars
              value={rating}
              onChange={setRating}
              size="size-7"
              activeClassName="fill-amber-400 text-amber-400"
              inactiveClassName="text-neutral-300"
              wrapperClassName="mt-2 flex gap-1"
              ariaLabel={`${rating} trên 5 sao`}
              starButtonClassName="p-1"
              starAriaLabel={(star) => `${star} sao`}
            />
          </fieldset>

          <div>
            <Field label={<>Tiêu đề <RequiredMark /></>} labelClassName={FIELD_LABEL}>
              <TextInput value={title} onChange={(event) => setTitle(event.target.value)} maxLength={255} disabled={submitting} size="md" className="mt-2" placeholder="Ví dụ: Sản phẩm chắc chắn, dùng ổn định" />
            </Field>
          </div>
          <div>
            <Field label={<>Nội dung <RequiredMark /></>} labelClassName={FIELD_LABEL}>
              <Textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength={5000} rows={5} disabled={submitting} styled className="mt-2 resize-y" placeholder="Chia sẻ trải nghiệm thực tế về sản phẩm..." />
            </Field>
          </div>

          <div>
            <p className={FIELD_LABEL}>Ảnh thực tế <span className="font-normal text-neutral-400">(tùy chọn, tối đa 5)</span></p>
            <div className="mt-2 flex flex-wrap gap-3">
              {media.map((item) => (
                <div key={item.mediaAssetId} className="relative size-20 overflow-hidden rounded-xl border border-neutral-200">
                  <Image src={item.previewUrl} alt="Ảnh đánh giá đã tải" fill sizes="80px" unoptimized className="object-cover" />
                  <Button onClick={() => setMedia((current) => current.filter((candidate) => candidate.mediaAssetId !== item.mediaAssetId))} className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-neutral-950/70 text-white" aria-label="Bỏ ảnh"><X aria-hidden className="size-3.5" /></Button>
                </div>
              ))}
              {media.length < MAX_MEDIA && (
                <Button disabled={uploading || submitting} onClick={() => inputRef.current?.click()} className="grid size-20 place-items-center rounded-xl border border-dashed border-neutral-300 text-xs font-bold text-neutral-500 disabled:opacity-50">
                  {uploading ? <Spinner className="size-5 animate-spin" /> : <span className="grid place-items-center gap-1"><ImagePlus aria-hidden className="size-5" />Thêm ảnh</span>}
                </Button>
              )}
            </div>
            <input ref={inputRef} hidden multiple type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => void pickImages(event.target.files)} />
          </div>

          {error && <InlineAlert as="p" role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</InlineAlert>}
          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-5">
            <Button variant="outline" onClick={onClose} disabled={submitting} className="px-5">Hủy</Button>
            <Button type="submit" variant="primary" loading={submitting} disabled={uploading} className="px-5">
              Gửi đánh giá
            </Button>
          </div>
        </form>
    </Modal>
  );
}
