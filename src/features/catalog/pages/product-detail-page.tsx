import { Images } from 'lucide-react';
import {
  ProductImageGallery,
  ProductPurchasePanel,
  ProductRelatedSection,
  ProductSpecifications,
} from '@/features/catalog';
import {
  hasOfferPrice,
  toDisplayBrand,
  toProductGalleryView,
  toProductPurchaseView,
} from '@/features/catalog';
import { ProductReviewSection } from '@/features/reviews';
import type { ProductDetailDto } from '@/generated/api/catalog/catalog.schemas';
import { Breadcrumb } from '@/foundation/components/navigation';
import { toBreadcrumbJsonLd, toProductBreadcrumbItems, toProductJsonLd } from '../model/product-json-ld';
import { serializeJsonLd } from '@/lib/seo/json-ld';

interface ProductDetailPageProps {
  product: ProductDetailDto;
  slug: string;
  relatedCategorySlug: string | undefined;
}

export function ProductDetailPage({ product, slug, relatedCategorySlug }: ProductDetailPageProps) {
  // CONTRACT: `ProductDetailDto` chưa có trường thông số kỹ thuật. Bản trước
  // hiển thị một bảng cố định cho MỌI sản phẩm — gồm cả tải trọng, kích thước và
  // chứng nhận CE/EN957 — tức là công bố thông số và chứng nhận không có thật.
  // Chỉ hiển thị những gì API thực sự trả về.
  const brand = toDisplayBrand(product.brand);
  const TECH_SPECS: Array<{ label: string; value: string }> = [
    ...(brand ? [{ label: 'Thương hiệu', value: brand }] : []),
    ...(product.primaryCategory ? [{ label: 'Phân loại', value: product.primaryCategory }] : []),
    // Thông số từ từ điển thuộc tính của API (nhãn/đơn vị đã ghép sẵn), theo thứ tự Admin sắp.
    ...product.specifications.map((spec) => ({
      label: spec.name,
      value: spec.values.map(({ label }) => label).join(' / '),
    })),
    { label: 'Mã sản phẩm', value: product.productNo },
    ...(product.variants.length > 1
      ? [{ label: 'Số phiên bản', value: `${product.variants.length} phiên bản` }]
      : []),
  ];

  const purchaseView = toProductPurchaseView(product);
  const gallery = toProductGalleryView(product);
  // SECURITY/CONTRACT: `description` là HTML đã được API làm sạch theo allowlist (CKEditor ở Admin
  // lưu HTML tuỳ ý) — chỉ render HTML từ trường này, không từ trường văn bản thuần nào khác.
  // Bỏ phần mô tả dài nếu nội dung chữ trùng nguyên văn mô tả ngắn.
  const shortDescription = product.shortDescription?.trim();
  const longDescriptionHtml = product.description?.trim();
  const longDescriptionText = longDescriptionHtml?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const showLongDescription = Boolean(
    longDescriptionHtml && longDescriptionText !== shortDescription?.replace(/\s+/g, ' '),
  );
  // Có biến thể mở bán mới khai `offers`; `minPrice` có thể thuộc biến thể đã ngừng bán.
  const hasPrice =
    hasOfferPrice(product.minPrice) && purchaseView.variants.some(({ sellable }) => sellable);
  const productJsonLd = toProductJsonLd(product, brand, hasPrice);
  // Breadcrumb hiển thị và JSON-LD dùng chung một danh sách (qua danh mục chính) để không lệch nhau.
  const breadcrumbItems = toProductBreadcrumbItems(product, relatedCategorySlug);
  const breadcrumbJsonLd = toBreadcrumbJsonLd(breadcrumbItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      {/* `<main>` duy nhất của trang (layout chỉ render `div`); pb-28 trên mobile chừa chỗ cho thanh mua dính đáy. */}
      <main className="bg-[var(--dc-canvas)] pb-28 lg:pb-24">
        <Breadcrumb
          className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"
          items={breadcrumbItems}
        />
        {/* Main Product Title Header */}
        <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            {product.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
            {brand && (
              <span className="rounded-full bg-brand-50 px-3 py-1 font-bold text-brand-700">
                {brand}
              </span>
            )}
            {product.primaryCategory && (
              <span>
                Danh mục: <strong className="text-slate-700">{product.primaryCategory}</strong>
              </span>
            )}
            <span>
              Mã SP: <strong className="text-slate-700">{product.productNo}</strong>
            </span>
          </div>
        </div>

        {/* Main Product Stage */}
        <div className="mx-auto mt-4 grid max-w-7xl gap-8 px-4 py-3 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:px-8">
          {/* Left Column: Visual Showcase & Detailed Story */}
          <div className="space-y-8">
            {/* Product media is image-first. Heavy 3D rendering is intentionally excluded here. */}
            <div className="overflow-hidden rounded-[28px] border border-[var(--dc-border)] bg-white shadow-[0_18px_50px_rgba(0,49,41,0.08)]">
              <div className="flex items-center justify-between border-b border-[var(--dc-border)] px-5 py-3.5">
                <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--dc-primary-700)]">
                  <Images className="size-4" aria-hidden="true" />
                  Hình ảnh sản phẩm
                </span>
                {gallery.length > 1 && (
                  <span className="text-xs font-semibold text-[var(--dc-text-secondary)]">
                    {gallery.length} ảnh
                  </span>
                )}
              </div>
              <ProductImageGallery images={gallery} productName={product.name} />
            </div>

            {/* Product Story / Description — chỉ hiện nội dung API trả về, không có văn mẫu dự phòng. */}
            {(shortDescription || showLongDescription) && (
              <div className="rounded-[28px] border border-[var(--dc-border)] bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-black text-ink sm:text-2xl">Mô tả sản phẩm</h2>
                {shortDescription && (
                  <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
                    {shortDescription}
                  </p>
                )}
                {showLongDescription && (
                  <div
                    className="mt-4 break-words text-sm leading-relaxed text-stone-600 sm:text-base [&_a]:text-[var(--dc-primary-700)] [&_a]:underline [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-ink [&_h3]:mt-4 [&_h3]:font-bold [&_h3]:text-ink [&_iframe]:my-4 [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:rounded-2xl [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mt-3 [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[var(--dc-border)] [&_td]:p-2 [&_th]:border [&_th]:border-[var(--dc-border)] [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-5"
                    dangerouslySetInnerHTML={{ __html: longDescriptionHtml ?? '' }}
                  />
                )}
              </div>
            )}

            {/* Customer Rating & Reviews Summary */}
            <ProductReviewSection productName={product.name} productSlug={slug} />
          </div>

          {/* Right Column: Sticky Purchase Panel + Technical Specs */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <ProductPurchasePanel product={purchaseView} />

            {/* Technical Specifications Table directly under price/purchase box */}
            <ProductSpecifications specs={TECH_SPECS} initialLimit={5} />
          </div>
        </div>

        {/* Related Products ("Cùng loại"), Flash Sale & Category List */}
        <ProductRelatedSection currentSlug={product.slug} categorySlug={relatedCategorySlug} />
      </main>
    </>
  );
}
