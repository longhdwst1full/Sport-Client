export const vndMoney = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function formatVnd(value: number): string {
  return vndMoney.format(value);
}
