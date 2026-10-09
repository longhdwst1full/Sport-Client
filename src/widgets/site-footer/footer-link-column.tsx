import Link from 'next/link';

export interface FooterLinkItem {
  label: string;
  href: string;
}

export function FooterLinkColumn({ title, links }: { title: string; links: FooterLinkItem[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-sm font-black uppercase tracking-wider text-white">{title}</h2>
      <ul className="mt-3 grid text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              className="inline-flex min-h-10 items-center text-slate-300 font-medium transition-all duration-200 hover:text-white hover:translate-x-1.5 focus-visible:outline-white"
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
