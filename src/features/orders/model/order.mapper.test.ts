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
  it('VNPay chưa thanh toán: đang chờ ở mốc thanh toán', () => {
    expect(states(base)).toEqual(['PLACED:done', 'PAID:current', 'SHIPMENT_CREATED:todo', 'IN_TRANSIT:todo', 'DELIVERED:todo']);
  });

  it('đã thanh toán và đã có vận đơn GHN đang giao: hiện mã và link theo dõi', () => {
    const dto = {
      ...base, paymentStatus: 'SUCCESS', paidAt: '2026-09-26T01:05:00.000Z', fulfillmentStatus: 'SHIPPED',
      shipment: { status: 'SHIPPED', carrierCode: 'GHN', trackingNo: 'LXQ7A9', trackingUrl: 'https://track/LXQ7A9', shippedAt: '2026-09-26T03:00:00.000Z', deliveredAt: null },
    } as OrderDetailDto;
    expect(states(dto)).toEqual(['PLACED:done', 'PAID:done', 'SHIPMENT_CREATED:done', 'IN_TRANSIT:current', 'DELIVERED:todo']);
    expect(toOrderDetailView(dto).shipment).toEqual({ carrierLabel: 'Giao Hàng Nhanh (GHN)', trackingNo: 'LXQ7A9', trackingUrl: 'https://track/LXQ7A9' });
  });

  it('COD không bị chặn ở mốc thanh toán', () => {
    const dto = { ...base, paymentMethod: 'COD' } as OrderDetailDto;
    expect(states(dto)).toEqual(['PLACED:done', 'PAID:todo', 'SHIPMENT_CREATED:current', 'IN_TRANSIT:todo', 'DELIVERED:todo']);
  });

  it('đơn huỷ: không mốc nào "current" và thêm mốc đã huỷ', () => {
    const dto = { ...base, status: 'CANCELLED', paymentStatus: 'CANCELLED' } as OrderDetailDto;
    expect(states(dto)).toEqual(['PLACED:done', 'PAID:failed', 'SHIPMENT_CREATED:todo', 'IN_TRANSIT:todo', 'DELIVERED:todo', 'CANCELLED:failed']);
  });
});
