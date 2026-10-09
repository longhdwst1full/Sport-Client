'use client';

import { useMemo, useState, useEffect } from 'react';
import { useCartActions, useCartItems } from '../hooks/use-cart';
import { useCartHydrated } from '../hooks/use-cart-hydrated';
import { Button } from '@/foundation/components/buttons';
import { Skeleton } from '@/foundation/components/feedback';
import { Breadcrumb } from '@/foundation/components/navigation';
import { useToast } from '@/shared/components/global-toast';
import { CartEmpty } from '../components/cart-empty';
import { CartSelectAllBar } from '../components/cart-select-all-bar';
import { CartItemRow } from '../components/cart-item-row';
import { CartSummary } from '../components/cart-summary';

export function CartPage() {
  const { removeItem, clear, updateQuantity: setQuantity } = useCartActions();
  const { toast } = useToast();
  const items = useCartItems();
  // Chưa đọc xong giỏ đã lưu thì chưa biết giỏ rỗng hay không: hiện khung chờ, không nháy "Giỏ hàng trống".
  const hydrated = useCartHydrated();

  // Lựa chọn sản phẩm thanh toán trong giỏ hàng
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>(() => items.map((i) => i.variantId));

  useEffect(() => {
    setSelectedVariantIds((prev) => {
      const validIds = new Set(items.map((i) => i.variantId));
      const next = prev.filter((id) => validIds.has(id));
      if (next.length === 0 && items.length > 0) {
        return items.map((i) => i.variantId);
      }
      return next;
    });
  }, [items]);

  const selectedSet = useMemo(() => new Set(selectedVariantIds), [selectedVariantIds]);
  const selectedItems = useMemo(() => items.filter((i) => selectedSet.has(i.variantId)), [items, selectedSet]);
  const isAllSelected = items.length > 0 && selectedItems.length === items.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedVariantIds([]);
    } else {
      setSelectedVariantIds(items.map((i) => i.variantId));
    }
  };

  const toggleSelectItem = (variantId: string) => {
    setSelectedVariantIds((prev) =>
      prev.includes(variantId) ? prev.filter((id) => id !== variantId) : [...prev, variantId]
    );
  };

  const subtotal = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [selectedItems]
  );

  const handleRemoveItem = (variantId: string, name: string) => {
    removeItem(variantId);
    toast({
      type: 'info',
      title: 'Đã xóa sản phẩm',
      message: `${name} đã được bỏ khỏi giỏ hàng.`,
    });
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng?')) {
      clear();
      toast({
        type: 'info',
        title: 'Giỏ hàng trống',
        message: 'Đã xóa tất cả sản phẩm.',
      });
    }
  };

  const handleCheckoutClick = (e: React.MouseEvent) => {
    if (selectedItems.length === 0) {
      e.preventDefault();
      toast({
        type: 'warning',
        title: 'Chưa chọn sản phẩm',
        message: 'Vui lòng chọn ít nhất 1 sản phẩm để tiếp tục đặt hàng.',
      });
    }
  };

  return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <Breadcrumb
          className="mb-6"
          items={[{ label: 'Trang chủ', href: '/' }, { label: 'Giỏ hàng' }]}
        />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-neutral-900 sm:text-4xl">
            Giỏ hàng của bạn{' '}
            {hydrated && <span className="text-2xl font-bold text-neutral-500 sm:text-3xl">({items.length})</span>}
          </h1>
          {hydrated && items.length > 0 && (
            <Button
              variant="ghost"
              onClick={handleClearCart}
              className="rounded px-2 text-xs font-bold text-red-700 hover:bg-transparent hover:text-red-800"
            >
              Xóa tất cả
            </Button>
          )}
        </div>

        {!hydrated ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]" role="status" aria-label="Đang tải giỏ hàng">
            <div className="space-y-4">
              <Skeleton className="h-14 rounded-2xl" />
              {Array.from({ length: 2 }, (_, i) => (
                <Skeleton key={i} className="h-[7.5rem] rounded-2xl sm:h-[9.5rem]" />
              ))}
            </div>
            <Skeleton className="h-80 rounded-3xl" />
          </div>
        ) : items.length === 0 ? (
          <CartEmpty />
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Cart Items List */}
            <div className="space-y-4">
              {/* Select All Checkbox Bar */}
              <CartSelectAllBar
                isAllSelected={isAllSelected}
                onToggleSelectAll={toggleSelectAll}
                itemCount={items.length}
                selectedCount={selectedItems.length}
              />

              {items.map((item) => (
                <CartItemRow
                  key={item.variantId}
                  item={item}
                  isSelected={selectedSet.has(item.variantId)}
                  onToggleSelect={() => toggleSelectItem(item.variantId)}
                  onDecrementQuantity={() => setQuantity(item.variantId, item.quantity - 1)}
                  onIncrementQuantity={() => setQuantity(item.variantId, item.quantity + 1)}
                  onRemove={() => handleRemoveItem(item.variantId, item.name)}
                />
              ))}
            </div>

            {/* Order Summary */}
            <CartSummary
              selectedCount={selectedItems.length}
              subtotal={subtotal}
              checkoutHref={
                selectedItems.length > 0
                  ? `/checkout?items=${selectedItems.map((i) => i.variantId).join(',')}`
                  : '#'
              }
              onCheckoutClick={handleCheckoutClick}
            />
          </div>
        )}
      </main>
  );
}
