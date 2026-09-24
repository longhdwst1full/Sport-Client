'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { ImagePlus, LoaderCircle, X } from 'lucide-react';
import { uploadReturnEvidence } from '../api/return-evidence-upload';
import type { UploadedEvidence } from '../model/return.mapper';
import { MAX_EVIDENCE_IMAGES } from '../model/return.constants';

interface EvidencePickerProps {
  orderNo: string;
  value: UploadedEvidence[];
  onChange: (images: UploadedEvidence[]) => void;
  onUploadingChange: (uploading: boolean) => void;
  disabled?: boolean;
}

/**
 * Chọn tối đa 5 ảnh, tải thẳng lên Cloudinary. Nhiều ảnh tải song song cùng hoàn tất trước khi
 * component cha render lại, nên danh sách mới nhất giữ trong ref để ảnh trước không bị ghi đè.
 */
export function EvidencePicker({ orderNo, value, onChange, onUploadingChange, disabled }: EvidencePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const latest = useRef(value);
  latest.current = value;
  const pending = useRef(0);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string>();

  const track = (delta: number) => {
    pending.current += delta;
    setUploading(pending.current);
    onUploadingChange(pending.current > 0);
  };

  const pick = (files: FileList | null) => {
    if (!files) return;
    setError(undefined);
    const room = MAX_EVIDENCE_IMAGES - latest.current.length - pending.current;
    const selected = Array.from(files).slice(0, Math.max(room, 0));
    if (files.length > selected.length) setError(`Tối đa ${MAX_EVIDENCE_IMAGES} ảnh.`);
    for (const file of selected) {
      track(1);
      void uploadReturnEvidence(orderNo, file)
        .then((uploaded) => {
          const next = [...latest.current, uploaded].slice(0, MAX_EVIDENCE_IMAGES);
          latest.current = next;
          onChange(next);
        })
        .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Tải ảnh thất bại.'))
        .finally(() => track(-1));
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((image) => (
          <div key={image.publicId} className="relative size-24 overflow-hidden rounded-xl border border-slate-200">
            <Image src={image.previewUrl} alt="Ảnh minh chứng đã tải" fill sizes="96px" className="object-cover" />
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange(value.filter((item) => item.publicId !== image.publicId))}
              className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-slate-900/70 text-white"
              aria-label="Bỏ ảnh"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        {value.length + uploading < MAX_EVIDENCE_IMAGES && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="grid size-24 place-items-center rounded-xl border border-dashed border-slate-300 text-xs font-bold text-slate-500 hover:border-emerald-500 disabled:opacity-50"
          >
            {uploading > 0 ? <LoaderCircle className="size-5 animate-spin" /> : <span className="grid place-items-center gap-1"><ImagePlus className="size-5" />Thêm ảnh</span>}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        hidden
        onChange={(event) => pick(event.target.files)}
      />
      {error && <p className="mt-2 text-sm font-semibold text-rose-700">{error}</p>}
    </div>
  );
}
