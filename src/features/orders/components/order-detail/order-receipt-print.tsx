'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { OrderDetailDto } from '@/generated/api/orders/orders.schemas';
import { STORE_CONFIG } from '@/shared/constants/store';
import { formatDateTime } from '@/shared/format/date-time';
import { formatVnd } from '@/shared/format/money';
import { paymentMethodLabels } from '../../model/order.mapper';
import { paymentStatusLabels } from '../../model/order.constants';

/** D16: biên lai nội bộ, không phải hoá đơn GTGT (hoá đơn điện tử để phase sau). */
const RECEIPT_TAX_NOTICE = 'Giá đã gồm VAT. Biên lai này không phải hoá đơn GTGT.';

/**
 * Biên lai của đơn, dựng từ dữ liệu Backend. Ẩn trên màn hình và chỉ hiện khi in qua
 * `printOrderReceipt()`; portal vào body để không bị layout trang cắt khi in.
 */
export function OrderReceiptPrint({ order }: { order: OrderDetailDto }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // CONTRACT: API cũ (trước khi deploy branchContact) không trả field này; biên lai vẫn in được, chỉ thiếu liên hệ.
  const contact = (order as Partial<Pick<OrderDetailDto, 'branchContact'>>).branchContact;
  const discount = Number(order.discountTotal);
  const shipping = Number(order.shippingTotal);
  const paymentStatus = (paymentStatusLabels as Record<string, string>)[order.paymentStatus] ?? order.paymentStatus;

  return createPortal(
    <div className="print-receipt-root" aria-hidden="true">
      <div className="print-receipt">
        <header className="print-receipt__header">
          <div className="print-receipt__store">{STORE_CONFIG.name}</div>
          <div>{order.branchName}</div>
          {contact?.address && <div>{contact.address}</div>}
          {contact?.phone && <div>ĐT: {contact.phone}</div>}
          <div className="print-receipt__title">BIÊN LAI BÁN HÀNG</div>
        </header>
        <dl className="print-receipt__meta">
          <div><dt>Mã đơn</dt><dd>{order.orderNo}</dd></div>
          <div><dt>Ngày</dt><dd>{formatDateTime(order.placedAt)}</dd></div>
          <div><dt>Khách hàng</dt><dd>{order.recipient.name}</dd></div>
          <div><dt>Điện thoại</dt><dd>{order.recipient.phone}</dd></div>
        </dl>
        <table className="print-receipt__items">
          <thead>
            <tr><th>Sản phẩm</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th></tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.productName}
                  {item.variantName && <div className="print-receipt__muted">{item.variantName} · {item.sku}</div>}
                </td>
                <td>{item.quantity}</td>
                <td>{formatVnd(Number(item.unitPrice))}</td>
                <td>{formatVnd(Number(item.lineTotal))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <dl className="print-receipt__totals">
          <div><dt>Tạm tính</dt><dd>{formatVnd(Number(order.subtotal))}</dd></div>
          {discount > 0 && <div><dt>Giảm giá</dt><dd>-{formatVnd(discount)}</dd></div>}
          {shipping > 0 && <div><dt>Phí giao hàng</dt><dd>{formatVnd(shipping)}</dd></div>}
          <div className="print-receipt__grand"><dt>Tổng cộng</dt><dd>{formatVnd(Number(order.grandTotal))}</dd></div>
          <div>
            <dt>Thanh toán</dt>
            <dd>{paymentMethodLabels[order.paymentMethod] ?? order.paymentMethod} · {paymentStatus}</dd>
          </div>
        </dl>
        {order.customerNote && <p className="print-receipt__note">Ghi chú: {order.customerNote}</p>}
        <footer className="print-receipt__footer">
          <p>{RECEIPT_TAX_NOTICE}</p>
          <p>Cảm ơn quý khách!</p>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
