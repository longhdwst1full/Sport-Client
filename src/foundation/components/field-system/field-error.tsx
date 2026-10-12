/** Dòng lỗi dưới ô nhập; gắn với control qua `aria-describedby={id}`. Không có `message` thì không render. */
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-red-700">
      {message}
    </p>
  );
}
