interface ProductPriceHeaderProps {
  canAdd: boolean;
  outOfStock: boolean;
  /** API xác nhận biến thể đang chọn còn hàng ở ít nhất một kho; `false` khi không biết. */
  inStock: boolean;
  priceLabel: string | undefined;
}

export function ProductPriceHeader({ canAdd, outOfStock, inStock, priceLabel }: ProductPriceHeaderProps) {
  return (
    <div>
      {/* Không hiển thị giá gạch hay "Tiết kiệm x%": contract chưa có giá gốc/khuyến mãi theo
          biến thể, bản trước tự nhân giá bán ×1,25 để dựng ra mức giảm không có thật. */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <div className="min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            {canAdd || outOfStock ? 'Giá bán niêm yết (Đã gồm VAT)' : 'Giá bán'}
          </span>
          <strong className="mt-1 block break-words text-2xl font-black text-brand-600 min-[400px]:text-3xl sm:text-4xl">
            {(canAdd || outOfStock) && priceLabel ? priceLabel : 'Liên hệ báo giá'}
          </strong>
          {outOfStock && (
            <span className="mt-2 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
              Tạm hết hàng
            </span>
          )}
        </div>
      </div>

      {/* "Còn hàng" chỉ hiện khi API trả `inStock: true` cho biến thể đang chọn; không có số lượng tồn. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-stone-600">
        {inStock && !outOfStock && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 font-bold text-success-800">
            <span aria-hidden className="size-1.5 rounded-full bg-success-600" />
            Còn hàng
          </span>
        )}
        <span>Liên hệ cửa hàng để biết thời gian giao và lắp đặt</span>
      </div>
    </div>
  );
}
