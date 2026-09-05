'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Dumbbell,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { STORE_CONFIG, STORE_CONTACT, STORE_SHOWROOMS } from '@/constants';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    spaceSize: '10-20m2',
    purpose: 'home-gym',
    note: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <StorefrontLayout>
      <div className="bg-stone-50/60 pb-20 pt-8">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-xs font-semibold text-stone-500">
            <Link href="/" className="hover:text-emerald-700">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <span className="font-bold text-ink">Hệ thống showroom & Liên hệ</span>
          </nav>

          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-emerald-800">
              Hệ thống phân phối toàn quốc
            </span>
            <h1 className="mt-4 text-3xl font-black text-ink sm:text-5xl">
              Ghé thăm showroom & Tư vấn chuyên sâu
            </h1>
            <p className="mt-3 text-base text-stone-600 sm:text-lg">
              Trải nghiệm thực tế cảm giác cầm nắm, tải trọng thiết bị và nhận bản vẽ bố trí không gian tập Home Gym miễn phí từ chuyên gia.
            </p>
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Showroom List */}
            <div className="space-y-6">
              <h2 className="text-xl font-black text-ink">Hệ thống Showroom chính hãng</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {STORE_SHOWROOMS.map((s) => (
                  <div
                    key={s.name}
                    className="flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm transition hover:border-emerald-400 hover:shadow-md"
                  >
                    <div>
                      <span className="inline-block rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-bold text-stone-600">
                        {s.city}
                      </span>
                      <h3 className="mt-2 text-base font-black text-ink">{s.name}</h3>
                      <p className="mt-1 text-xs font-semibold text-emerald-700">
                        {s.isHeadquarter ? 'Trụ sở chính & Kho trung tâm' : 'Chi nhánh miền Nam & Kho hàng'}
                      </p>

                      <div className="mt-4 space-y-2 text-xs text-stone-600">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                          <span>{s.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="size-4 shrink-0 text-emerald-600" />
                          <strong className="text-ink">{s.phone}</strong>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="size-4 shrink-0 text-emerald-600" />
                          <span>{s.hours}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`tel:${s.phoneRaw}`}
                      className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-stone-100 py-2.5 text-xs font-bold text-ink transition hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      Gọi showroom này
                    </a>
                  </div>
                ))}
              </div>

              {/* Direct Support Contacts */}
              <div className="rounded-3xl bg-ink p-8 text-white">
                <h3 className="text-lg font-black text-white">Tổng đài hỗ trợ toàn quốc</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-emerald-400 text-ink">
                      <Phone className="size-5" />
                    </span>
                    <div>
                      <span className="block text-xs text-white/60">Hotline tư vấn (08:30 - 21:30)</span>
                      <strong className="text-base text-white">{STORE_CONTACT.primaryHotline}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-emerald-400 text-ink">
                      <Mail className="size-5" />
                    </span>
                    <div>
                      <span className="block text-xs text-white/60">Email liên hệ</span>
                      <strong className="text-base text-white">{STORE_CONTACT.email}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Consultation Request Form */}
            <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-black text-ink">Đăng ký tư vấn thiết kế Home Gym</h2>
              <p className="mt-1 text-xs text-stone-500">
                Đội ngũ kỹ sư thể hình {STORE_CONFIG.name} sẽ liên hệ gửi bản vẽ 3D và báo giá tối ưu trong 30 phút.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-2xl bg-emerald-50 p-6 text-center">
                  <CheckCircle2 className="mx-auto size-12 text-emerald-600" />
                  <h3 className="mt-3 text-lg font-bold text-ink">Gửi yêu cầu thành công!</h3>
                  <p className="mt-1 text-xs text-stone-600">
                    Cảm ơn bạn. Chuyên viên {STORE_CONFIG.name} sẽ gọi điện tư vấn trực tiếp qua số {form.phone}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-5 rounded-full bg-ink px-6 py-2.5 text-xs font-bold text-white"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-500">Họ và tên *</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500">Số điện thoại *</label>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="0912 345 678"
                        className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="email@example.com"
                        className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500">Diện tích dự kiến</label>
                      <select
                        value={form.spaceSize}
                        onChange={(e) => setForm({ ...form, spaceSize: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      >
                        <option value="under-10m2">Dưới 10m² (Góc tập nhỏ)</option>
                        <option value="10-20m2">10m² - 20m² (Phòng ngủ / Ban công)</option>
                        <option value="20-50m2">20m² - 50m² (Tầng thượng / Sân thượng)</option>
                        <option value="over-50m2">Trên 50m² (Phòng Gym chuyên nghiệp)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500">Mục tiêu tập luyện</label>
                      <select
                        value={form.purpose}
                        onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      >
                        <option value="home-gym">Tăng cơ & Giảm mỡ toàn thân</option>
                        <option value="cardio">Cardio & Giảm cân chạy bộ</option>
                        <option value="rehab">Phục hồi chức năng & Yoga</option>
                        <option value="commercial">Mở phòng tập thể hình kinh doanh</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-500">Ghi chú thêm</label>
                    <textarea
                      rows={3}
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                      placeholder="Mô tả ngân sách dự kiến hoặc yêu cầu đặc biệt..."
                      className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-4 font-black text-ink shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
                  >
                    <Send className="size-4" />
                    <span>Gửi yêu cầu tư vấn miễn phí</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </StorefrontLayout>
  );
}
