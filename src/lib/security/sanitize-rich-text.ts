import sanitizeHtml from 'sanitize-html';

/**
 * SECURITY (defence-in-depth): API đã làm sạch `description`, nhưng CSP của storefront còn
 * `script-src 'unsafe-inline'` nên nếu API sót thì không còn lớp nào chặn. Hàm này chạy lại cùng allowlist
 * (`api/src/common/text/rich-text.ts`) NGAY TRÊN SERVER trước khi HTML tới `dangerouslySetInnerHTML`.
 * Chỉ gọi từ server component: `sanitize-html` không được vào bundle trình duyệt.
 *
 * Allowlist giữ ĐỒNG BỘ với API; siết hơn thì được, nới hơn thì không. Không thêm `svg`, `math`,
 * `textarea`, `meta`, `style`, `noscript`.
 */
const YOUTUBE_EMBED_SRC = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com)\/embed\//i;

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p', 'br', 'hr', 'div', 'span', 'blockquote', 'pre', 'code',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'small',
    'ul', 'ol', 'li',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
    'a', 'img', 'figure', 'figcaption', 'iframe',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    td: ['colspan', 'rowspan'],
    th: ['colspan', 'rowspan', 'scope'],
    col: ['span'],
    iframe: ['src', 'width', 'height', 'allowfullscreen', 'frameborder', 'allow'],
    '*': ['style'],
  },
  allowedStyles: {
    '*': {
      color: [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i, /^[a-z]+$/i],
      'background-color': [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i, /^[a-z]+$/i],
      'text-align': [/^(left|right|center|justify)$/],
      'font-size': [/^\d+(\.\d+)?(px|pt|em|rem|%)$/],
      'font-family': [/^[\w\s,'"-]+$/],
      'font-weight': [/^(normal|bold|[1-9]00)$/],
      'font-style': [/^(normal|italic)$/],
      'text-decoration': [/^(none|underline|line-through)$/],
      width: [/^\d+(\.\d+)?(px|%)$/],
      height: [/^\d+(\.\d+)?(px|%)$/],
    },
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['https'], iframe: ['https'] },
  allowProtocolRelative: false,
  exclusiveFilter: (frame) =>
    (frame.tag === 'img' && !/^https:\/\//i.test(frame.attribs.src ?? '')) ||
    (frame.tag === 'iframe' && !YOUTUBE_EMBED_SRC.test(frame.attribs.src ?? '')),
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: attribs.target === '_blank' ? { ...attribs, rel: 'noopener noreferrer' } : attribs,
    }),
  },
};

/** HTML an toàn để render; chuỗi rỗng khi không còn nội dung. */
export function sanitizeRichText(html: string | null | undefined): string {
  const value = html?.trim();
  return value ? sanitizeHtml(value, OPTIONS).trim() : '';
}
