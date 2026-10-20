import Link from 'next/link';

export interface FooterLinkItem {
  label: string;
  href: string;
}

/** Tiêu đề cột footer: chữ hoa nhỏ + gạch đỏ thương hiệu phía dưới. */
export const FOOTER_HEADING_CLASS =
  "relative pb-3 text-sm font-bold uppercase tracking-wider text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-8 after:rounded-full after:bg-brand-500 after:content-['']";

export function FooterLinkColumn({ title, links }: { title: string; links: FooterLinkItem[] }) {
  return (
    <nav aria-label={title}>
      <h2 className={FOOTER_HEADING_CLASS}>{title}</h2>
      <ul className="mt-3 grid text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              className="flex min-h-10 items-center py-1 leading-snug text-neutral-400 transition-colors duration-200 hover:text-white focus-visible:outline-white"
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
