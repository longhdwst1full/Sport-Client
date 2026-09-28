import { describe, expect, it } from 'vitest';
import type { OrderDetailDto } from '@/generated/api/orders/orders.schemas';
import { toOrderDetailView, toOrderMilestones } from './order.mapper';

const base = {
  id: '1', orderNo: 'ORD-1', status: 'PENDING_CONFIRMATION', paymentStatus: 'PENDING', fulfillmentStatus: 'PENDING',
  paymentMethod: 'VNPAY', shippingMethod: 'STANDARD_DELIVERY', branchId: '1', branchName: 'Chi nhánh Hà Nội',
  warehouseName: 'Kho HN', grandTotal: '100000', itemCount: 1, placedAt: '2026-09-26T01:00:00.000Z', version: 0,
  recipient: { name: 'A', phone: '0912345678', addressLine: '12', province: 'Hà Nội' },
  currencyCode: 'VND', pricesIncludeTax: true, subtotal: '100000', discountTotal: '0', shippingTotal: '0', taxTotal: '0',
  customerNote: null, items: [], statusHistory: [], paidAt: null, shipment: null,
} as unknown as OrderDetailDto;

const states = (dto: OrderDetailDto) => toOrderMilestones(dto).map(({ key, state }) => `${key}:${state}`);

describe('order milestones', () => {
  it('đơn mới tạo (PENDING_CONFIRMATION): đang ở bước chờ xác nhận', () => {
    expect(states(base)).toEqual(['PLACED:done', 'CONFIRMED:current', 'PACKED:todo', 'IN_TRANSIT:todo', 'DELIVERED:todo']);
  });

  it('đơn đã xác nhận (CONFIRMED): đang ở bước chuẩn bị đóng gói / xuất kho', () => {
    const dto = { ...base, status: 'CONFIRMED' } as OrderDetailDto;
    expect(states(dto)).toEqual(['PLACED:done', 'CONFIRMED:done', 'PACKED:current', 'IN_TRANSIT:todo', 'DELIVERED:todo']);
  });

  it('đã xuất kho và có vận đơn GHN đang giao: hiện mã và thông tin vận chuyển', () => {
    const dto = {
      ...base, status: 'SHIPPED', paymentStatus: 'SUCCESS', paidAt: '2026-09-26T01:05:00.000Z', fulfillmentStatus: 'SHIPPED',
      shipment: { status: 'SHIPPED', carrierCode: 'GHN', trackingNo: 'LXQ7A9', trackingUrl: 'https://track/LXQ7A9', shippedAt: '2026-09-26T03:00:00.000Z', deliveredAt: null },
    } as OrderDetailDto;
    expect(states(dto)).toEqual(['PLACED:done', 'CONFIRMED:done', 'PACKED:done', 'IN_TRANSIT:current', 'DELIVERED:todo']);
    const view = toOrderDetailView(dto);
    expect(view.shipment.carrierLabel).toBe('Giao Hàng Nhanh (GHN)');
    expect(view.shipment.trackingNo).toBe('LXQ7A9');
    expect(view.shipment.trackingUrl).toBe('https://track/LXQ7A9');
    expect(view.shipment.hasTracking).toBe(true);
    expect(view.shipment.estimatedDeliveryLabel).toBe('Dự kiến 1 - 3 ngày làm việc');
  });

  it('COD không bị nhầm lẫn mốc thanh toán trong chuỗi giao hàng', () => {
    const dto = { ...base, paymentMethod: 'COD', status: 'CONFIRMED' } as OrderDetailDto;
    expect(states(dto)).toEqual(['PLACED:done', 'CONFIRMED:done', 'PACKED:current', 'IN_TRANSIT:todo', 'DELIVERED:todo']);
  });

  it('đơn huỷ: không mốc nào "current" và có mốc CANCELLED failed', () => {
    const dto = { ...base, status: 'CANCELLED', paymentStatus: 'CANCELLED' } as OrderDetailDto;
    expect(states(dto)).toEqual(['PLACED:done', 'CONFIRMED:todo', 'PACKED:todo', 'IN_TRANSIT:todo', 'DELIVERED:todo', 'CANCELLED:failed']);
  });
});

