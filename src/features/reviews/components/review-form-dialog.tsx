'use client';

import Image from 'next/image';
import { FormEvent, useRef, useState } from 'react';
import { ImagePlus, Star, X } from 'lucide-react';
import { Spinner } from '@/foundation/components/feedback';
import { Modal } from '@/foundation/components/overlay';
import { createAccountProductReview } from '@/generated/api/reviews/reviews';
import { apiErrorMessage } from '@/lib/api/error-message';
import { uploadReviewMedia, type UploadedReviewMedia } from '../api/review-media-upload';

const MAX_MEDIA = 5;

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
      backdropClassName="fixed inset-0 z-[80] grid place-items-center bg-slate-950/60 p-4"
      className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
    >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Đánh giá đã mua hàng</p>
            <h2 id="review-dialog-title" className="mt-1 text-xl font-black text-slate-950">{productName}</h2>
            <p className="mt-1 text-sm text-slate-500">Đánh giá sẽ hiển thị sau khi cửa hàng duyệt.</p>
          </div>
          <button type="button" onClick={onClose} disabled={submitting} className="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-600" aria-label="Đóng"><X className="size-4" /></button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-5">
          <fieldset>
            <legend className="text-sm font-bold text-slate-800">Mức độ hài lòng <span className="text-rose-600">*</span></legend>
            <div className="mt-2 flex gap-1" aria-label={`${rating} trên 5 sao`}>
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} type="button" onClick={() => setRating(value)} className="p-1" aria-label={`${value} sao`}>
                  <Star className={`size-7 ${value <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block text-sm font-bold text-slate-800">Tiêu đề <span className="text-rose-600">*</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={255} disabled={submitting} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" placeholder="Ví dụ: Sản phẩm chắc chắn, dùng ổn định" />
          </label>
          <label className="block text-sm font-bold text-slate-800">Nội dung <span className="text-rose-600">*</span>
            <textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength={5000} rows={5} disabled={submitting} className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" placeholder="Chia sẻ trải nghiệm thực tế về sản phẩm..." />
          </label>

          <div>
            <p className="text-sm font-bold text-slate-800">Ảnh thực tế <span className="font-normal text-slate-400">(tùy chọn, tối đa 5)</span></p>
            <div className="mt-2 flex flex-wrap gap-3">
              {media.map((item) => (
                <div key={item.mediaAssetId} className="relative size-20 overflow-hidden rounded-xl border border-slate-200">
                  <Image src={item.previewUrl} alt="Ảnh đánh giá đã tải" fill sizes="80px" unoptimized className="object-cover" />
                  <button type="button" onClick={() => setMedia((current) => current.filter((candidate) => candidate.mediaAssetId !== item.mediaAssetId))} className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-slate-950/70 text-white" aria-label="Bỏ ảnh"><X className="size-3.5" /></button>
                </div>
              ))}
              {media.length < MAX_MEDIA && (
                <button type="button" disabled={uploading || submitting} onClick={() => inputRef.current?.click()} className="grid size-20 place-items-center rounded-xl border border-dashed border-slate-300 text-xs font-bold text-slate-500 disabled:opacity-50">
                  {uploading ? <Spinner className="size-5 animate-spin" /> : <span className="grid place-items-center gap-1"><ImagePlus className="size-5" />Thêm ảnh</span>}
                </button>
              )}
            </div>
            <input ref={inputRef} hidden multiple type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => void pickImages(event.target.files)} />
          </div>

          {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">{error}</p>}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button type="button" onClick={onClose} disabled={submitting} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700">Hủy</button>
            <button type="submit" disabled={submitting || uploading} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
              {submitting && <Spinner className="size-4 animate-spin" />} Gửi đánh giá
            </button>
          </div>
        </form>
    </Modal>
  );
}
