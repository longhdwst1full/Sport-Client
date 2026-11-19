import { describe, expect, it } from 'vitest';
import { sanitizeRichText } from './sanitize-rich-text';

const DANGEROUS = /<script|<svg|<math|<textarea|<meta|<style|<noscript|\son\w+\s*=|javascript:|expression\(|data:text|url\(/i;

describe('sanitizeRichText (client defence-in-depth)', () => {
  it.each([
    '<svg><animate onbegin="alert(1)" attributeName="x"/></svg>',
    '<math><mi><style><img src=x onerror=alert(1)></style></mi></math>',
    '<textarea><img src=x onerror=alert(1)></textarea>',
    '<meta http-equiv="refresh" content="0;url=javascript:alert(1)">',
    '<iframe src="https://evil.example.com/x"></iframe>',
    '<iframe src="javascript:alert(1)"></iframe>',
    '<a href="  jAvAsCrIpT:alert(1)">x</a>',
    '<img src="https://ok.example.com/a.png" onerror="alert(1)">',
    '<p style="background:url(javascript:alert(1))">x</p>',
    '<<script>script>alert(1)<</script>/script>',
  ])('chặn %s', (payload) => {
    const out = sanitizeRichText(payload);
    expect(out).not.toMatch(DANGEROUS);
    expect(out).not.toMatch(/evil\.example\.com/);
  });

  it('giữ nội dung hợp lệ: đoạn, ảnh https, link, YouTube', () => {
    const out = sanitizeRichText(
      '<p><strong>Đậm</strong></p><img src="https://cdn.example.com/a.png" alt="a"><a href="https://example.com" target="_blank">l</a><iframe src="https://www.youtube.com/embed/abc"></iframe>',
    );
    expect(out).toContain('<strong>Đậm</strong>');
    expect(out).toContain('src="https://cdn.example.com/a.png"');
    expect(out).toContain('rel="noopener noreferrer"');
    expect(out).toContain('youtube.com/embed/abc');
  });

  it('rỗng khi không có nội dung', () => {
    expect(sanitizeRichText(undefined)).toBe('');
    expect(sanitizeRichText('  ')).toBe('');
  });
});
