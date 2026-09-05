const BRAND_NAMES = [
  'Nike', 'Adidas', 'Under Armour', 'Reebok', 'Life Fitness',
  'Technogym', 'Matrix', 'Impulse', 'BH Fitness', 'DCTD Sport',
  'Manduka', 'TRX',
];

export function BrandPartners() {
  return (
    <section className="border-y border-ink/5 bg-white py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="mb-8 text-center text-xs font-bold uppercase tracking-[.2em] text-stone-400">
          Thương hiệu đồng hành
        </p>
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent" />

          {/* Scrolling track */}
          <div className="brand-scroll flex w-max items-center gap-12">
            {[...BRAND_NAMES, ...BRAND_NAMES].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="shrink-0 select-none text-xl font-black tracking-tight text-stone-300 transition-colors duration-300 hover:text-stone-700"
                aria-hidden={i >= BRAND_NAMES.length}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
