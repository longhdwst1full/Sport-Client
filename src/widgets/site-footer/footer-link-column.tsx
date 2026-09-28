import Link from 'next/link';

export interface FooterLinkItem {
  label: string;
  href: string;
}

export function FooterLinkColumn({ title, links }: { title: string; links: FooterLinkItem[] }) {
  return (
    <div>
      <h2 className="text-base font-bold uppercase tracking-wider text-white">{title}</h2>
      <div className="mt-4 grid gap-2.5 text-sm text-slate-300">
        {links.map((link) => (
          <Link
            key={link.href}
            className="transition hover:text-emerald-400 hover:translate-x-0.5 inline-block"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
