export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  imageUrl?: string;
  sku?: string;
}

export interface UserOrder {
  id: string;
  date: string;
  status: string;
  statusCode: string;
  statusColor: string;
  total: number;
  subtotal?: number;
  shippingFee?: number;
  deliveryAddress: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod?: string;
  items: OrderItem[];
}

export interface AddressItem {
  id: string;
  name: string;
  phone: string;
  fullAddress: string;
  label: 'home' | 'office' | 'other';
  isDefault: boolean;
  provinceCode?: number;
  districtCode?: number;
  wardCode?: number;
  streetAddress?: string;
}

export interface WarrantyItem {
  serial: string;
  productName: string;
  activationDate: string;
  expiryDate: string;
  status: string;
  policy: string;
}

export const MOCK_INITIAL_ORDERS: UserOrder[] = [
  {
    id: 'BA-88291',
    date: '02/09/2026',
    status: 'Đang giao hàng',
    statusCode: 'shipping',
    statusColor: 'text-sky-700 bg-sky-100',
    total: 6200000,
    subtotal: 6200000,
    shippingFee: 0,
    deliveryAddress: 'Số 123 Đường Nguyễn Hữu Thọ, Phường Tân Phong, Quận 7, Thành phố Hồ Chí Minh',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0912 345 678',
    paymentMethod: 'Chuyển khoản VietQR',
    items: [
      {
        id: 'prod-bike-1',
        name: 'Xe Đạp Tập Thể Dục Kháng Lực Từ Bảo An AirBike Pro',
        qty: 1,
        price: 6200000,
        imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    id: 'BA-76120',
    date: '18/08/2026',
    status: 'Đã hoàn thành',
    statusCode: 'completed',
    statusColor: 'text-emerald-700 bg-emerald-100',
    total: 3850000,
    subtotal: 3850000,
    shippingFee: 0,
    deliveryAddress: 'Số 123 Đường Nguyễn Hữu Thọ, Phường Tân Phong, Quận 7, Thành phố Hồ Chí Minh',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0912 345 678',
    paymentMethod: 'COD',
    items: [
      {
        id: 'prod-gym-2',
        name: 'Bộ Tạ Tay Điều Chỉnh Thông Minh 24KG Pro (15 Cặp Trong 1)',
        qty: 1,
        price: 3850000,
        imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
];

export const MOCK_INITIAL_ADDRESSES: AddressItem[] = [
  {
    id: 'addr-1',
    name: 'Nguyễn Văn An',
    phone: '0912 345 678',
    label: 'home',
    isDefault: true,
    provinceCode: 79,
    districtCode: 778,
    wardCode: 27502,
    streetAddress: 'Số 123 Đường Nguyễn Hữu Thọ',
    fullAddress: 'Số 123 Đường Nguyễn Hữu Thọ, Phường Tân Phong, Quận 7, Thành phố Hồ Chí Minh',
  },
  {
    id: 'addr-2',
    name: 'Nguyễn Văn An (Văn phòng)',
    phone: '0912 345 678',
    label: 'office',
    isDefault: false,
    provinceCode: 79,
    districtCode: 765,
    wardCode: 26860,
    streetAddress: 'Tầng 8, Tòa nhà Landmark 81, 720A Điện Biên Phủ',
    fullAddress: 'Tầng 8, Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, Thành phố Hồ Chí Minh',
  },
];

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
