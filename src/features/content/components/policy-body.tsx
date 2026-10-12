/**
 * Thân bài chính sách từ CMS: văn bản thuần có cú pháp Markdown tối giản (`## tiêu đề`, `- ý`).
 * Hiển thị tiêu đề/gạch đầu dòng thay vì ký tự thô; dùng chung cho trang `/chinh-sach/<slug>` và modal.
 * Không render HTML từ CMS nên không cần sanitize.
 */
export function PolicyBody({
  paragraphs,
  className,
  headingClassName,
}: {
  paragraphs: string[];
  className: string;
  headingClassName: string;
}) {
  return (
    <div className={className}>
      {paragraphs.map((line, index) => {
        const heading = /^#{1,6}\s+(.*)$/.exec(line);
        if (heading) {
          return (
            <h2 key={index} className={headingClassName}>
              {heading[1]}
            </h2>
          );
        }
        const bullet = /^[-*•]\s+(.*)$/.exec(line);
        if (bullet) {
          return (
            <p key={index} className="flex gap-2.5 pl-1">
              <span aria-hidden className="mt-[0.75em] size-1.5 shrink-0 rounded-full bg-neutral-400" />
              <span>{bullet[1]}</span>
            </p>
          );
        }
        return <p key={index}>{line}</p>;
      })}
    </div>
  );
}
