import type { ArticleBlock } from './content-post.mapper';

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

/**
 * Sinh cùng một anchor cho cả nội dung SSR và mục lục phía client.
 * `blockIndex` là vị trí trong toàn bộ article blocks, không phải vị trí sau khi
 * lọc heading; nếu không hai phía sẽ trỏ tới ID khác nhau khi có paragraph xen kẽ.
 */
export function createArticleHeadingId(
  block: Extract<ArticleBlock, { kind: 'heading' }>,
  blockIndex: number,
) {
  return `heading-${blockIndex}-${encodeURIComponent(
    block.text.slice(0, 24).replace(/\s+/g, '-').toLowerCase(),
  )}`;
}

export function extractTocHeadings(blocks: ArticleBlock[]): TocHeading[] {
  return blocks.flatMap((block, blockIndex) =>
    block.kind === 'heading'
      ? [
          {
            id: createArticleHeadingId(block, blockIndex),
            text: block.text,
            level: block.level,
          },
        ]
      : [],
  );
}
