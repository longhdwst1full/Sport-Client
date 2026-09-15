import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/foundation/components/navigation';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { ProductShowcase } from '@/features/catalog';
import { listCatalogCategories } from '@/generated/api/catalog/catalog';
import type { CatalogCategoryDto } from '@/generated/api/catalog/models';

export const revalidate = 0;

async function loadCategory(slug: string): Promise<CatalogCategoryDto | undefined> {
  try {
    const list = await listCatalogCategories();
    return list.items.find((item) => item.slug === slug);
  } catch {
    return undefined;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await loadCategory(slug);
  if (!category) return { title: 'Danh mục — Bảo An Sport' };

  return {
    title: `${category.name} — Bảo An Sport`,
    description: category.description,
    openGraph: { title: category.name, description: category.description },
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Slug không có trong cây danh mục là đường dẫn sai; dựng tiêu đề từ slug sẽ tạo ra
  // một trang danh mục không tồn tại và vẫn trả HTTP 200 cho công cụ tìm kiếm.
  const category = await loadCategory(slug);
  if (!category) notFound();

  const parent = category.parentSlug
    ? await loadCategory(category.parentSlug)
    : undefined;

  return (
    <StorefrontLayout>
      <div className="bg-stone-50/60 pb-20 pt-8">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            className="mb-6"
            items={[
              { label: 'Trang chủ', href: '/' },
              ...(parent ? [{ label: parent.name, href: `/category/${parent.slug}` }] : []),
              { label: category.name },
            ]}
          />

          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#0c1410] via-[#141f17] to-[#0a100d] p-8 text-white shadow-xl sm:p-12">
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-3xl font-black text-white sm:text-5xl">{category.name}</h1>
              {category.description && (
                <p className="mt-3 text-sm leading-relaxed text-stone-300 sm:text-base">
                  {category.description}
                </p>
              )}
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-emerald-300">
                {category.productCount} sản phẩm
              </p>
            </div>

            <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-emerald-500/10 blur-[100px]" />
          </div>

          <div className="mt-12">
            <div className="mb-6 border-b border-stone-200/80 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Sản phẩm thuộc {category.name}
              </span>
            </div>

            <ProductShowcase categorySlug={slug} />
          </div>
        </main>
      </div>
    </StorefrontLayout>
  );
}
