/**
 * Ô bẫy bot cho form công khai (API từ chối nếu `website` có giá trị). Ẩn khỏi người dùng và trình
 * đọc màn hình, không nhận Tab, không tự điền — một chỗ dùng chung cho mọi form có honeypot.
 */
export function HoneypotField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input tabIndex={-1} autoComplete="off" value={value} onChange={(event) => onChange(event.target.value)} />
      </label>
    </div>
  );
}
