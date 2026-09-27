import { beforeEach, describe, expect, it, vi } from 'vitest';

const listShippingProvinces = vi.fn();
const listShippingDistricts = vi.fn();
const listShippingWards = vi.fn();
vi.mock('@/generated/api/shipping/shipping', () => ({
  listShippingProvinces: (...args: unknown[]) => listShippingProvinces(...args),
  listShippingDistricts: (...args: unknown[]) => listShippingDistricts(...args),
  listShippingWards: (...args: unknown[]) => listShippingWards(...args),
}));

const { fetchVietnamDistricts, fetchVietnamProvinces, resetVietnamAddressCache } = await import(
  './vietnam-address.service'
);

describe('vietnam-address.service cache', () => {
  beforeEach(() => {
    resetVietnamAddressCache();
    vi.clearAllMocks();
  });

  it('hai lời gọi song song dùng chung một request', async () => {
    listShippingProvinces.mockResolvedValue({ items: [{ code: '201', name: 'Hà Nội' }] });
    const [first, second] = await Promise.all([fetchVietnamProvinces(), fetchVietnamProvinces()]);
    expect(first).toEqual([{ code: '201', name: 'Hà Nội' }]);
    expect(second).toBe(first);
    await fetchVietnamProvinces();
    expect(listShippingProvinces).toHaveBeenCalledTimes(1);
  });

  it('cache theo từng tỉnh, giữ nguyên mã chuỗi của hãng vận chuyển', async () => {
    listShippingDistricts.mockResolvedValue({ items: [{ code: '1B2729', name: 'Ba Đình' }] });
    await fetchVietnamDistricts('201');
    await fetchVietnamDistricts('201');
    await fetchVietnamDistricts('202');
    expect(listShippingDistricts).toHaveBeenCalledTimes(2);
    expect(await fetchVietnamDistricts('201')).toEqual([{ code: '1B2729', name: 'Ba Đình', province_code: '201' }]);
  });

  it('lỗi mạng không bị nhớ: lần sau gọi lại được', async () => {
    listShippingProvinces.mockRejectedValueOnce(new Error('offline'));
    await expect(fetchVietnamProvinces()).rejects.toThrow('offline');
    listShippingProvinces.mockResolvedValueOnce({ items: [{ code: '201', name: 'Hà Nội' }] });
    await expect(fetchVietnamProvinces()).resolves.toHaveLength(1);
    expect(listShippingProvinces).toHaveBeenCalledTimes(2);
  });

  it('danh sách tỉnh rỗng không được giữ', async () => {
    listShippingProvinces.mockResolvedValueOnce({ items: [] });
    await fetchVietnamProvinces();
    await Promise.resolve();
    listShippingProvinces.mockResolvedValueOnce({ items: [{ code: '201', name: 'Hà Nội' }] });
    await expect(fetchVietnamProvinces()).resolves.toHaveLength(1);
  });
});
