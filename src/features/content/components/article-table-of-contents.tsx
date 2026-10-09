'use client';

import { ListOrdered } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import type { TocHeading } from '../model/article-toc';

export function ArticleTableOfContents({ headings }: { headings: TocHeading[] }) {
  if (headings.length < 2) return null;

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 120;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav
      className="my-8 rounded-2xl border border-neutral-200 bg-neutral-50/40 p-5 shadow-2xs backdrop-blur-xs sm:p-6"
      aria-label="Mục lục bài viết"
    >
      <div className="flex items-center gap-2 border-b border-neutral-200/60 pb-3">
        <ListOrdered className="size-4 text-neutral-900" aria-hidden="true" />
        <h2 className="text-xs font-black uppercase tracking-wider text-neutral-950">
          Mục lục bài viết
        </h2>
      </div>
      <ol className="mt-3.5 space-y-2 text-xs font-medium text-neutral-700">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`${heading.level === 3 ? 'ml-4 list-[circle]' : 'list-decimal'} list-inside`}
          >
            <Button
              variant="link"
              onClick={() => scrollToHeading(heading.id)}
              className="justify-start rounded py-1 text-left text-xs text-neutral-700 hover:text-neutral-900"
            >
              {heading.text}
            </Button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
