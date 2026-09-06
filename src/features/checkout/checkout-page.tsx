'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Truck,
  ShieldCheck,
  Tag,
  Receipt,
  QrCode,
  Sparkles,
  Phone,
  User,
  MapPin,
  Clock,
  ChevronRight,
  ExternalLink,
  Printer,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { clearCart } from '@/app/store/cart.slice';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { vndMoney } from '@/shared/format/money';
import { STORE_CONFIG, STORE_CONTACT } from '@/constants';
import {
  VietnamAddressSelector,
  type SelectedAddressData,
} from '@/components/address/vietnam-address-selector';
import { useToast } from '@/shared/components/global-toast';

type PaymentMethod = 'cod' | 'bank' | 'vnpay' | 'momo';

interface SavedAddressItem {
  id: string;
  name: string;
  phone: string;
  fullAddress: string;
  isDefault?: boolean;
}

const DEFAULT_SAVED_ADDRESSES: SavedAddressItem[] = [
  {
    id: 'addr-1',
    name: 'Nguyễn Văn An',
    phone: '0912 345 678',
    fullAddress: 'Số 123 Đường Nguyễn Hữu Thọ, Phường Tân Phong, Quận 7, Thành phố Hồ Chí Minh',
    isDefault: true,
  },
  {
    id: 'addr-2',
    name: 'Nguyễn Văn An (Văn phòng)',
    phone: '0912 345 678',
    fullAddress: 'Tầng 8, Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, Thành phố Hồ Chí Minh',
    isDefault: false,
  },
];

export function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const items = useAppSelector((s) => s.cart.items);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Shipping option
  const [shippingOption, setShippingOption] = useState<'standard' | 'express' | 'free_install'>(
    subtotal >= 5000000 ? 'free_install' : 'standard',
  );

  const baseShippingFee =
    shippingOption === 'free_install'
      ? 0
      : shippingOption === 'express'
      ? 60000
      : 30000;

  // Coupon / Voucher discount
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    amount: number;
    description: string;
  } | null>(null);
  const [couponError, setCouponError] = useState('');

  const shippingFee = appliedDiscount?.code === 'FREESHIP' ? 0 : baseShippingFee;
  const discountAmount = appliedDiscount?.amount ?? 0;
  const total = Math.max(0, subtotal + shippingFee - discountAmount);

  // Address mode: 'saved' or 'new'
  const [savedAddresses, setSavedAddresses] = useState<SavedAddressItem[]>([]);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string>('addr-1');
  const [useNewAddress, setUseNewAddress] = useState(false);

  // Contact and Delivery form data
  const [customerName, setCustomerName] = useState('Nguyễn Văn An');
  const [customerPhone, setCustomerPhone] = useState('0912 345 678');
  const [customerEmail, setCustomerEmail] = useState('an.nguyen@example.com');
  const [deliveryNote, setDeliveryNote] = useState('');

  const [addressData, setAddressData] = useState<SelectedAddressData>({
    provinceCode: 79,
    provinceName: 'Thành phố Hồ Chí Minh',
    districtCode: 778,
    districtName: 'Quận 7',
    wardCode: 27502,
    wardName: 'Phường Tân Phong',
    streetAddress: 'Số 123 Đường Nguyễn Hữu Thọ',
    fullAddress: 'Số 123 Đường Nguyễn Hữu Thọ, Phường Tân Phong, Quận 7, Thành phố Hồ Chí Minh',
  });

  // Payment method
  const [payment, setPayment] = useState<PaymentMethod>('cod');

  // VAT invoice request
  const [requestVat, setRequestVat] = useState(false);
  const [vatCompany, setVatCompany] = useState('');
  const [vatTaxCode, setVatTaxCode] = useState('');
  const [vatAddress, setVatAddress] = useState('');
  const [vatEmail, setVatEmail] = useState('');

  // Order state
  const [ordered, setOrdered] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  // Load saved addresses from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('baoan_saved_addresses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedAddresses(parsed);
          setSelectedSavedAddressId(parsed[0].id);
          setCustomerName(parsed[0].name);
          setCustomerPhone(parsed[0].phone);
          return;
        }
      }
    } catch {
      // ignore
    }
    setSavedAddresses(DEFAULT_SAVED_ADDRESSES);
  }, []);

  // Redirect if cart is empty and not yet ordered
  useEffect(() => {
    if (items.length === 0 && !ordered) {
      router.replace('/cart');
    }
  }, [items.length, ordered, router]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const clean = couponCode.trim().toUpperCase();

    if (!clean) return;

    if (clean === 'BAOAN200') {
      if (subtotal < 2000000) {
        setCouponError('Mã BAOAN200 chỉ áp dụng cho đơn hàng từ 2.000.000đ.');
        toast({ type: 'warning', title: 'Chưa đủ điều kiện', message: 'Mã BAOAN200 áp dụng cho đơn từ 2 triệu.' });
        return;
      }
      setAppliedDiscount({
        code: clean,
        amount: 200000,
        description: 'Voucher giảm trực tiếp 200.000đ cho đơn hàng từ 2 triệu',
      });
      toast({ type: 'success', title: 'Áp dụng thành công!', message: 'Đã giảm 200.000đ vào đơn hàng.' });
    } else if (clean === 'BAOAN500') {
      if (subtotal < 5000000) {
        setCouponError('Mã BAOAN500 chỉ áp dụng cho đơn hàng từ 5.000.000đ.');
        toast({ type: 'warning', title: 'Chưa đủ điều kiện', message: 'Mã BAOAN500 áp dụng cho đơn từ 5 triệu.' });
        return;
      }
      setAppliedDiscount({
        code: clean,
        amount: 500000,
        description: 'Voucher VIP giảm trực tiếp 500.000đ cho đơn từ 5 triệu',
      });
      toast({ type: 'success', title: 'Áp dụng thành công!', message: 'Đã giảm 500.000đ vào đơn hàng.' });
    } else if (clean === 'FREESHIP') {
      setAppliedDiscount({
        code: clean,
        amount: baseShippingFee,
        description: 'Miễn phí 100% cước vận chuyển toàn quốc',
      });
      toast({ type: 'success', title: 'Áp dụng thành công!', message: 'Miễn phí 100% phí giao hàng.' });
    } else if (clean === 'BAOANSPORT' || clean === 'BAOAN') {
      const discount = Math.round(subtotal * 0.05);
      setAppliedDiscount({
        code: clean,
        amount: discount,
        description: 'Giảm 5% toàn đơn hàng chính hãng Bảo An Sport',
      });
      toast({ type: 'success', title: 'Áp dụng thành công!', message: `Đã giảm 5% (${vndMoney.format(discount)}).` });
    } else if (clean === 'WELCOME100') {
      setAppliedDiscount({
        code: clean,
        amount: 100000,
        description: 'Giảm trực tiếp 100.000đ chào mừng khách hàng mới',
      });
      toast({ type: 'success', title: 'Áp dụng thành công!', message: 'Đã giảm 100.000đ.' });
    } else {
      setCouponError('Mã ưu đãi không hợp lệ hoặc đã hết hạn.');
      toast({ type: 'error', title: 'Mã không hợp lệ', message: 'Vui lòng kiểm tra lại ký tự mã giảm giá.' });
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const orderId = `BA-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalAddress =
      !useNewAddress && savedAddresses.length > 0
        ? savedAddresses.find((a) => a.id === selectedSavedAddressId)?.fullAddress || addressData.fullAddress
        : addressData.fullAddress;

    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      createdAt: new Date().toISOString(),
      status: 'Chờ xác nhận',
      statusCode: 'PENDING',
      statusColor: 'text-amber-700 bg-amber-100',
      total,
      subtotal,
      shippingFee,
      discountAmount,
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress: finalAddress,
      deliveryNote,
      paymentMethod: payment,
      shippingOption,
      items: items.map((i) => ({
        id: i.productId,
        name: i.name,
        qty: i.quantity,
        price: i.price,
        imageUrl: i.imageUrl,
        sku: i.sku,
      })),
      vat: requestVat
        ? {
            company: vatCompany,
            taxCode: vatTaxCode,
            address: vatAddress,
            email: vatEmail,
          }
        : null,
    };

    // Save to user's order history in localStorage
    try {
      const existingOrdersRaw = localStorage.getItem('baoan_user_orders');
      const existingOrders = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
      localStorage.setItem('baoan_user_orders', JSON.stringify([newOrder, ...existingOrders]));
    } catch {
      // ignore
    }

    setCreatedOrder(newOrder);
    setOrdered(true);
    dispatch(clearCart());
    toast({
      type: 'success',
      title: 'Đặt hàng thành công!',
      message: `Mã đơn hàng: ${orderId}. Nhân viên Bảo An Sport sẽ liên hệ ngay.`,
    });
  };

  if (items.length === 0 && !ordered) {
    return null;
  }

  // ==========================================
  // SUCCESS VIEW
  // ==========================================
  if (ordered && createdOrder) {
    const bankTransferSyntax = `BAOAN ${createdOrder.id} ${createdOrder.customerPhone.slice(-4)}`;
    const qrUrl = `https://img.vietqr.io/image/970407-190368688888-compact2.png?amount=${createdOrder.total}&addInfo=${encodeURIComponent(
      bankTransferSyntax,
    )}&accountName=${encodeURIComponent('CONG TY TNHH DUNG CU THE THAO BAO AN')}`;

    return (
      <StorefrontLayout>
        <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-xl sm:p-10">
            {/* Header with animated tick */}
            <div className="text-center">
              <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60 animate-in zoom-in-75 duration-300">
                <CheckCircle2 className="size-10" />
              </div>
              <span className="mt-4 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-800">
                Đơn hàng đã được tiếp nhận
              </span>
              <h1 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">
                Cảm ơn bạn đã đặt hàng tại {STORE_CONFIG.name}!
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Mã đơn hàng:{' '}
                <strong className="font-mono text-base font-black text-emerald-700">
                  {createdOrder.id}
                </strong>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Bộ phận chăm sóc khách hàng sẽ liên hệ xác nhận trong vòng 15-30 phút qua số{' '}
                <strong className="font-bold text-slate-800">{createdOrder.customerPhone}</strong>.
              </p>
            </div>

            {/* If Bank Transfer was chosen, show Dynamic VietQR Code */}
            {createdOrder.paymentMethod === 'bank' && (
              <div className="mt-8 rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50/60 to-white p-6 sm:p-8">
                <div className="flex items-center justify-between gap-3 border-b border-emerald-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <QrCode className="size-6 text-emerald-600" />
                    <div>
                      <h2 className="text-base font-black text-slate-900">
                        Quét mã VietQR chuyển khoản tức thì
                      </h2>
                      <p className="text-xs text-slate-500">
                        Hệ thống tự động xác nhận đơn hàng sau 1 phút
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-black text-white">
                    Techcombank
                  </span>
                </div>

                <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                  <div className="relative size-48 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-2 shadow-md">
                    <img
                      src={qrUrl}
                      alt="VietQR Chuyển khoản"
                      className="size-full object-contain"
                    />
                  </div>

                  <div className="flex-1 space-y-2.5 text-xs">
                    <div className="flex justify-between border-b border-slate-100 py-1.5">
                      <span className="text-slate-500">Ngân hàng:</span>
                      <strong className="font-bold text-slate-900">Techcombank (TCB)</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 py-1.5">
                      <span className="text-slate-500">Số tài khoản:</span>
                      <strong className="font-mono text-sm font-black text-emerald-700">
                        1903 6868 8888
                      </strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 py-1.5">
                      <span className="text-slate-500">Chủ tài khoản:</span>
                      <strong className="font-bold uppercase text-slate-900">
                        CTCP DUNG CU THE THAO BAO AN
                      </strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 py-1.5">
                      <span className="text-slate-500">Số tiền:</span>
                      <strong className="text-sm font-black text-rose-600">
                        {vndMoney.format(createdOrder.total)}
                      </strong>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">Nội dung chuyển:</span>
                      <strong className="rounded bg-amber-100 px-2 py-0.5 font-mono font-black text-amber-900">
                        {bankTransferSyntax}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary Details */}
            <div className="mt-8 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6 text-sm">
              <h3 className="font-black text-slate-900">Thông tin giao nhận hàng</h3>
              <div className="mt-4 grid gap-2.5 text-xs sm:grid-cols-2">
                <div>
                  <span className="text-slate-500">Người nhận:</span>{' '}
                  <strong className="font-bold text-slate-900">{createdOrder.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Số điện thoại:</span>{' '}
                  <strong className="font-mono font-bold text-slate-900">
                    {createdOrder.customerPhone}
                  </strong>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500">Địa chỉ giao:</span>{' '}
                  <strong className="font-medium text-slate-900">
                    {createdOrder.deliveryAddress}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Phương thức:</span>{' '}
                  <strong className="font-bold text-slate-900">
                    {createdOrder.paymentMethod === 'cod'
                      ? 'Thanh toán khi nhận hàng (COD)'
                      : createdOrder.paymentMethod === 'bank'
                      ? 'Chuyển khoản VietQR'
                      : 'Thanh toán trực tuyến'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Tổng thanh toán:</span>{' '}
                  <strong className="font-black text-emerald-700">
                    {vndMoney.format(createdOrder.total)}
                  </strong>
                </div>
              </div>

              {/* Items List */}
              <div className="mt-6 border-t border-slate-200 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Sản phẩm đặt mua ({createdOrder.items.length})
                </h4>
                <div className="mt-3 space-y-3">
                  {createdOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-5 place-items-center rounded bg-slate-200 font-bold text-slate-700">
                          {item.qty}
                        </span>
                        <span className="font-semibold text-slate-900">{item.name}</span>
                      </div>
                      <strong className="font-black text-slate-900">
                        {vndMoney.format(item.price * item.qty)}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/profile"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500"
              >
                <span>Xem đơn hàng trong Profile</span>
                <ChevronRight className="size-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </main>
      </StorefrontLayout>
    );
  }

  // ==========================================
  // MAIN CHECKOUT FORM
  // ==========================================
  return (
    <StorefrontLayout>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-emerald-700">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-emerald-700">
            Giỏ hàng
          </Link>
          <span>/</span>
          <span className="font-bold text-slate-900">Thanh toán & Đặt hàng</span>
        </nav>

        {/* Stepper Heading */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
              Thanh toán đơn hàng
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Vui lòng kiểm tra kỹ thông tin người nhận và địa chỉ giao hàng
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white">
              ✓
            </span>
            <span className="text-emerald-700">Giỏ hàng</span>
            <span className="text-slate-300">───</span>
            <span className="flex size-6 items-center justify-center rounded-full bg-slate-900 text-white">
              2
            </span>
            <span className="text-slate-900">Thông tin & Giao nhận</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            {/* SECTION 1: CUSTOMER CONTACT */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-black text-slate-900">
                <User className="size-4.5 text-emerald-600" /> 1. Thông tin liên hệ
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nguyễn Văn An"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Số điện thoại <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Email nhận hóa đơn
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="an.nguyen@example.com"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:text-sm"
                  />
                </div>
              </div>
            </section>

            {/* SECTION 2: DELIVERY ADDRESS (SAVED ADDRESSES OR VIETNAM ADDRESS SELECTOR) */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-base font-black text-slate-900">
                  <Truck className="size-4.5 text-emerald-600" /> 2. Địa chỉ giao hàng & Lắp đặt
                </h2>

                {savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUseNewAddress(!useNewAddress)}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    {useNewAddress ? '← Chọn địa chỉ đã lưu' : '+ Nhập địa chỉ mới'}
                  </button>
                )}
              </div>

              {/* Saved Address Cards */}
              {!useNewAddress && savedAddresses.length > 0 ? (
                <div className="mt-5 space-y-3">
                  <p className="text-xs text-slate-500">Chọn địa chỉ từ sổ địa chỉ của bạn:</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedSavedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => {
                            setSelectedSavedAddressId(addr.id);
                            setCustomerName(addr.name);
                            setCustomerPhone(addr.phone);
                          }}
                          className={`cursor-pointer rounded-2xl border p-4 transition ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/30'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-xs font-bold text-slate-900">{addr.name}</strong>
                            {addr.isDefault && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-slate-500">{addr.phone}</p>
                          <p className="mt-2 text-xs leading-relaxed text-slate-700 line-clamp-2">
                            {addr.fullAddress}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Dynamic Vietnam Administrative Address Selector */
                <div className="mt-5 space-y-4">
                  <VietnamAddressSelector
                    initialData={addressData}
                    onChange={(data) => setAddressData(data)}
                    required
                  />
                </div>
              )}

              {/* Delivery Note */}
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Ghi chú giao hàng (Tùy chọn)
                </label>
                <textarea
                  rows={2}
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến 15 phút, lên lầu 3 có thang máy..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:text-sm"
                />
              </div>
            </section>

            {/* SECTION 3: SHIPPING METHOD */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-black text-slate-900">
                <Clock className="size-4.5 text-emerald-600" /> 3. Gói vận chuyển & Lắp đặt
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    id: 'standard' as const,
                    title: 'Tiêu chuẩn',
                    fee: 30000,
                    time: '2-3 ngày làm việc',
                    desc: 'Giao hàng tận nơi toàn quốc',
                  },
                  {
                    id: 'express' as const,
                    title: 'Hỏa tốc 2H',
                    fee: 60000,
                    time: 'Trong vòng 2 giờ',
                    desc: 'Áp dụng nội thành HN & HCM',
                  },
                  {
                    id: 'free_install' as const,
                    title: 'Lắp đặt tận nhà',
                    fee: 0,
                    time: 'Hẹn giờ theo yêu cầu',
                    desc: 'Kỹ thuật viên Bảo An hỗ trợ',
                  },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setShippingOption(s.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      shippingOption === s.id
                        ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{s.title}</span>
                      <strong className="text-xs font-black text-emerald-700">
                        {s.fee === 0 ? 'Miễn phí' : vndMoney.format(s.fee)}
                      </strong>
                    </div>
                    <span className="mt-1 block text-[11px] font-semibold text-emerald-600">
                      {s.time}
                    </span>
                    <p className="mt-1 text-[11px] text-slate-500">{s.desc}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* SECTION 4: PAYMENT METHOD */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-black text-slate-900">
                <CreditCard className="size-4.5 text-emerald-600" /> 4. Phương thức thanh toán
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    id: 'cod' as const,
                    label: 'Thanh toán khi nhận hàng (COD)',
                    desc: 'Kiểm tra hàng trước khi thanh toán tiền mặt cho shipper',
                  },
                  {
                    id: 'bank' as const,
                    label: 'Chuyển khoản VietQR tức thì',
                    desc: 'Quét mã QR từ mọi app ngân hàng (Techcombank 1903 6868 8888)',
                  },
                  {
                    id: 'vnpay' as const,
                    label: 'Cổng thanh toán VNPAY / Thẻ ATM',
                    desc: 'Hỗ trợ thẻ nội địa 40+ ngân hàng Việt Nam',
                  },
                  {
                    id: 'momo' as const,
                    label: 'Ví điện tử MoMo',
                    desc: 'Thanh toán an toàn, tích điểm đổi quà',
                  },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayment(m.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      payment === m.id
                        ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="block text-xs font-bold text-slate-900">{m.label}</span>
                    <span className="mt-1 block text-[11px] text-slate-500 leading-relaxed">
                      {m.desc}
                    </span>
                  </button>
                ))}
              </div>

              {/* Bank Transfer preview */}
              {payment === 'bank' && (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <Sparkles className="size-4 text-emerald-600" />
                    <span>Sau khi bấm "Xác nhận đặt hàng", mã VietQR sẽ hiển thị trên màn hình.</span>
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-800">
                    Bạn chỉ cần mở app ngân hàng quét mã, số tiền và nội dung sẽ được điền tự động 100%.
                  </p>
                </div>
              )}
            </section>

            {/* SECTION 5: VAT INVOICE OPTION */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requestVat}
                  onChange={(e) => setRequestVat(e.target.checked)}
                  className="size-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="flex items-center gap-2 text-xs font-bold text-slate-800 sm:text-sm">
                  <Receipt className="size-4 text-slate-500" />
                  Yêu cầu xuất hóa đơn GTGT điện tử (VAT) cho doanh nghiệp
                </span>
              </label>

              {requestVat && (
                <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600">Tên công ty / Tổ chức *</label>
                    <input
                      type="text"
                      required={requestVat}
                      value={vatCompany}
                      onChange={(e) => setVatCompany(e.target.value)}
                      placeholder="Công ty TNHH Giải Pháp..."
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600">Mã số thuế *</label>
                    <input
                      type="text"
                      required={requestVat}
                      value={vatTaxCode}
                      onChange={(e) => setVatTaxCode(e.target.value)}
                      placeholder="0108123456"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600">Email nhận HĐĐT *</label>
                    <input
                      type="email"
                      required={requestVat}
                      value={vatEmail}
                      onChange={(e) => setVatEmail(e.target.value)}
                      placeholder="ketoan@congty.com"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600">Địa chỉ theo đăng ký kinh doanh *</label>
                    <input
                      type="text"
                      required={requestVat}
                      value={vatAddress}
                      onChange={(e) => setVatAddress(e.target.value)}
                      placeholder="Số 45, Phố Duy Tân, Cầu Giấy, Hà Nội..."
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
                    />
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: STICKY ORDER SUMMARY & COUPON              */}
          {/* ======================================================== */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:sticky lg:top-28">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-slate-900">
                  Đơn hàng ({items.length} sản phẩm)
                </h2>
                <Link href="/cart" className="text-xs font-bold text-emerald-700 hover:underline">
                  Sửa giỏ hàng
                </Link>
              </div>

              {/* Items List */}
              <div className="mt-4 max-h-60 space-y-3 overflow-y-auto pr-1 scrollbar-thin">
                {items.map((item) => (
                  <div key={item.variantId} className="flex items-center gap-3 text-xs">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <Image
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=600&q=80'}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 truncate">{item.name}</h3>
                      <p className="mt-0.5 text-slate-400">SL: ×{item.quantity}</p>
                    </div>
                    <strong className="shrink-0 font-black text-slate-900">
                      {vndMoney.format(item.price * item.quantity)}
                    </strong>
                  </div>
                ))}
              </div>

              {/* Coupon input */}
              <div className="mt-5 border-t border-slate-100 pt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Mã khuyến mãi / Voucher
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Nhập BAOANSPORT, FREESHIP..."
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold uppercase outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-600"
                  >
                    Áp dụng
                  </button>
                </div>
                {couponError && (
                  <p className="mt-1.5 text-[11px] font-semibold text-rose-600">{couponError}</p>
                )}
                {appliedDiscount && (
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800">
                    <span className="font-bold">Mã {appliedDiscount.code} đã áp dụng</span>
                    <button
                      type="button"
                      onClick={() => setAppliedDiscount(null)}
                      className="text-[11px] text-slate-400 hover:text-rose-600"
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </div>

              {/* Cost calculations */}
              <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính tiền hàng:</span>
                  <span className="font-semibold text-slate-900">{vndMoney.format(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Phí giao hàng:</span>
                  <span className="font-semibold text-slate-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold">Miễn phí</span>
                    ) : (
                      vndMoney.format(shippingFee)
                    )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Ưu đãi giảm giá:</span>
                    <span>-{vndMoney.format(discountAmount)}</span>
                  </div>
                )}
                <div className="flex items-baseline justify-between border-t border-slate-100 pt-3 text-sm">
                  <span className="font-black text-slate-900">Tổng thanh toán:</span>
                  <strong className="text-xl font-black text-emerald-700">
                    {vndMoney.format(total)}
                  </strong>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 active:scale-[0.99]"
              >
                <CheckCircle2 className="size-4.5" />
                <span>Xác nhận đặt hàng</span>
              </button>

              {/* Guarantee badges */}
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  <span>Cam kết 100% hàng chính hãng {STORE_CONFIG.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="size-4 text-emerald-600" />
                  <span>Kiểm tra hàng trước khi thanh toán tiền mặt (COD)</span>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </main>
    </StorefrontLayout>
  );
}
