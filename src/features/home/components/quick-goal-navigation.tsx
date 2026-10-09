'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, Dumbbell, Flame, Home, MoveUpRight } from 'lucide-react';

interface GoalItem {
  id: string;
  icon: typeof Home;
  title: string;
  subtitle: string;
  badge: string;
  href: string;
  gradient: string;
  iconColor: string;
  badgeStyle: string;
}

const GOALS: GoalItem[] = [
  {
    id: 'home-gym',
    icon: Home,
    title: 'Tập Luyện Tại Nhà',
    subtitle: 'Máy chạy, xe đạp, ghế tập & tạ tay gọn gàng',
    badge: 'Phổ biến nhất',
    href: '/products?category=may-tap-the-duc',
    gradient: 'hover:border-sky-500/80 hover:shadow-2xl hover:shadow-sky-500/20',
    iconColor: 'bg-sky-50 text-sky-600 border-sky-200 group-hover:bg-sky-600 group-hover:text-white',
    badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  {
    id: 'strength',
    icon: Dumbbell,
    title: 'Tăng Cơ & Thể Lực',
    subtitle: 'Giàn tạ đa năng, tạ khối & khung gánh an toàn',
    badge: 'Chuyên sâu',
    href: '/products?category=dung-cu-tap-gym',
    gradient: 'hover:border-rose-500/80 hover:shadow-2xl hover:shadow-rose-500/20',
    iconColor: 'bg-rose-50 text-rose-600 border-rose-200 group-hover:bg-rose-600 group-hover:text-white',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    id: 'cardio',
    icon: Flame,
    title: 'Đốt Mỡ & Giảm Cân',
    subtitle: 'Máy chạy bộ cao cấp, xe đạp tập & cardio',
    badge: 'Hiệu quả cao',
    href: '/products?category=may-chay-bo',
    gradient: 'hover:border-amber-500/80 hover:shadow-2xl hover:shadow-amber-500/20',
    iconColor: 'bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-600 group-hover:text-white',
    badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'commercial',
    icon: Building2,
    title: 'Setup Phòng Gym',
    subtitle: 'Tư vấn thiết kế & combo thiết bị cho dự án',
    badge: 'Hỗ trợ trọn gói',
    href: '/contact',
    gradient: 'hover:border-emerald-500/80 hover:shadow-2xl hover:shadow-emerald-500/20',
    iconColor: 'bg-emerald-50 text-emerald-600 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
];

export function QuickGoalNavigation() {
  return (
    <section className="page-section">
      <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-100/80 via-white to-slate-100/60 p-6 sm:p-8 lg:p-10 shadow-sm">
        <div className="mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50/80 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-sky-700 shadow-2xs">
              <span className="size-1.5 rounded-full bg-sky-600 animate-pulse" />
              Định hướng tập luyện
            </div>
            <h2 className="mt-2.5 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
              Bạn Đang Tìm Thiết Bị Cho Mục Tiêu Nào?
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-500 max-w-2xl">
              Chọn nhanh giải pháp phù hợp với diện tích phòng và nhu cầu rèn luyện của bạn
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {GOALS.map((goal, idx) => {
            const Icon = goal.icon;
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <Link
                  href={goal.href}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 transition-all duration-300 focus-ring animate-shine h-full ${goal.gradient}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div
                        className={`grid size-12 sm:size-14 place-items-center rounded-2xl border text-xl transition-all duration-300 group-hover:scale-110 shadow-xs ${goal.iconColor}`}
                      >
                        <Icon className="size-6 sm:size-7" aria-hidden="true" />
                      </div>
                      <span className={`hidden rounded-full border px-3 py-0.5 text-xs font-black sm:inline shadow-2xs ${goal.badgeStyle}`}>
                        {goal.badge}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black leading-snug text-slate-900 transition-colors group-hover:text-red-600">
                      {goal.title}
                    </h3>
                    <p className="mt-1.5 text-xs font-medium text-slate-500 leading-relaxed max-sm:hidden">
                      {goal.subtitle}
                    </p>
                  </div>

                  <div className="mt-5 sm:mt-6 flex items-center gap-1.5 text-xs font-black text-red-600 group-hover:text-red-700 transition">
                    <span>Khám phá ngay</span>
                    <MoveUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
