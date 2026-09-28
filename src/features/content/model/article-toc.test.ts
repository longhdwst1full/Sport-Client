import { describe, expect, it } from 'vitest';
import type { ArticleBlock } from './content-post.mapper';
import { createArticleHeadingId, extractTocHeadings } from './article-toc';

describe('article table of contents', () => {
  it('giữ index gốc để anchor trong nội dung và mục lục khớp nhau', () => {
    const blocks: ArticleBlock[] = [
      { kind: 'paragraph', text: 'Mở đầu' },
      { kind: 'heading', level: 2, text: 'Chọn máy chạy bộ' },
      { kind: 'paragraph', text: 'Nội dung' },
      { kind: 'heading', level: 3, text: 'Kiểm tra công suất' },
    ];

    expect(extractTocHeadings(blocks)).toEqual([
      {
        id: 'heading-1-ch%E1%BB%8Dn-m%C3%A1y-ch%E1%BA%A1y-b%E1%BB%99',
        text: 'Chọn máy chạy bộ',
        level: 2,
      },
      {
        id: 'heading-3-ki%E1%BB%83m-tra-c%C3%B4ng-su%E1%BA%A5t',
        text: 'Kiểm tra công suất',
        level: 3,
      },
    ]);
  });

  it('dùng cùng helper khi render heading trong article', () => {
    const heading: Extract<ArticleBlock, { kind: 'heading' }> = {
      kind: 'heading',
      level: 2,
      text: 'Thiết bị & phụ kiện',
    };

    expect(createArticleHeadingId(heading, 4)).toBe(
      'heading-4-thi%E1%BA%BFt-b%E1%BB%8B-%26-ph%E1%BB%A5-ki%E1%BB%87n',
    );
  });
});
