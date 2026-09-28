interface ProductPriceHeaderProps {
  canAdd: boolean;
  outOfStock: boolean;
  priceLabel: string | undefined;
}

export function ProductPriceHeader({ canAdd, outOfStock, priceLabel }: ProductPriceHeaderProps) {
  return (
    <div>
      {/* Không hiển thị giá gạch hay "Tiết kiệm x%": contract chưa có giá gốc/khuyến mãi theo
          biến thể, bản trước tự nhân giá bán ×1,25 để dựng ra mức giảm không có thật. */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <div className="min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            {canAdd || outOfStock ? 'Giá bán niêm yết (Đã gồm VAT)' : 'Giá bán'}
          </span>
          <strong className="mt-1 block break-words text-2xl font-black text-emerald-700 min-[400px]:text-3xl sm:text-4xl">
            {(canAdd || outOfStock) && priceLabel ? priceLabel : 'Liên hệ báo giá'}
          </strong>
          {outOfStock && (
            <span className="mt-2 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
              Tạm hết hàng
            </span>
          )}
        </div>
      </div>

      {/* Live Stock & Showroom Indicator */}
      {/* Không khai "Còn hàng": contract sản phẩm chưa trả tồn kho, mà hứa có hàng rồi
          báo hết khi khách đã đặt là sai với khách. */}
      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-stone-500">
        <span>Liên hệ cửa hàng để biết tình trạng hàng, thời gian giao và lắp đặt</span>
      </div>
    </div>
  );
}
