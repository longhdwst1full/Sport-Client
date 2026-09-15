export interface WarrantyItem {
  serial: string;
  productName: string;
  activationDate: string;
  expiryDate: string;
  status: string;
  policy: string;
}

export const MOCK_WARRANTIES: WarrantyItem[] = [
  {
    serial: 'BA-SPIN-2026-0912',
    productName: 'Xe Đạp Tập Thể Dục Kháng Lực Từ Bảo An AirBike Pro',
    activationDate: '02/09/2026',
    expiryDate: '02/09/2031',
    status: 'Còn hiệu lực 59 tháng (Bảo hành 5 năm)',
    policy: 'Bảo hành khung sườn 5 năm, kháng từ 2 năm, hỗ trợ linh kiện trọn đời.',
  },
  {
    serial: 'BA-DMB-2026-4481',
    productName: 'Bộ Tạ Tay Điều Chỉnh Thông Minh 24KG Pro',
    activationDate: '18/08/2026',
    expiryDate: '18/08/2028',
    status: 'Còn hiệu lực 23 tháng (Bảo hành 2 năm)',
    policy: 'Bảo hành cơ cấu chuyển nấc đĩa tạ 2 năm đổi mới 1-1.',
  },
];
