'use client';

import React from 'react';
import { ListOrdered } from 'lucide-react';
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
      className="my-8 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-2xs backdrop-blur-xs sm:p-6"
      aria-label="Mục lục bài viết"
    >
      <div className="flex items-center gap-2 border-b border-emerald-200/60 pb-3">
        <ListOrdered className="size-4 text-emerald-700" />
        <h3 className="text-xs font-black uppercase tracking-wider text-emerald-950">
          Mục lục bài viết
        </h3>
      </div>
      <ol className="mt-3.5 space-y-2 text-xs font-medium text-slate-700">
        {headings.map((heading, i) => (
          <li
            key={heading.id}
            className={`${heading.level === 3 ? 'ml-4 list-[circle]' : 'list-decimal'} list-inside`}
          >
            <button
              type="button"
              onClick={() => scrollToHeading(heading.id)}
              className="text-left text-slate-700 hover:text-emerald-700 hover:underline transition font-semibold"
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
