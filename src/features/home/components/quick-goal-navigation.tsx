import Link from 'next/link';
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
}

/**
 * Slug danh mục đối chiếu với seed `api/prisma/migrations/20260914080000_seed_baoansport_catalog`
 * (lọc theo slug cha gồm cả danh mục con). Đổi slug ở admin thì phải sửa ở đây.
 */
const GOALS: GoalItem[] = [
  {
    id: 'home-gym',
    icon: Home,
    title: 'Tập Luyện Tại Nhà',
    subtitle: 'Máy chạy, xe đạp, ghế tập & tạ tay gọn gàng',
    badge: 'Phổ biến nhất',
    href: '/products?category=may-tap-the-duc',
    gradient: 'hover:border-sky-500/80 hover:shadow-sky-500/15',
    iconColor: 'bg-sky-50 text-sky-600 border-sky-200 group-hover:bg-sky-600 group-hover:text-white',
  },
  {
    id: 'strength',
    icon: Dumbbell,
    title: 'Tăng Cơ & Thể Lực',
    subtitle: 'Giàn tạ đa năng, tạ khối & khung gánh an toàn',
    badge: 'Chuyên sâu',
    href: '/products?category=dung-cu-tap-gym',
    gradient: 'hover:border-rose-500/80 hover:shadow-rose-500/15',
    iconColor: 'bg-rose-50 text-rose-600 border-rose-200 group-hover:bg-rose-600 group-hover:text-white',
  },
  {
    id: 'cardio',
    icon: Flame,
    title: 'Đốt Mỡ & Giảm Cân',
    subtitle: 'Máy chạy bộ cao cấp, xe đạp tập & cardio',
    badge: 'Hiệu quả cao',
    href: '/products?category=may-chay-bo',
    gradient: 'hover:border-amber-500/80 hover:shadow-amber-500/15',
    iconColor: 'bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-600 group-hover:text-white',
  },
  {
    id: 'commercial',
    icon: Building2,
    title: 'Setup Phòng Gym',
    subtitle: 'Tư vấn thiết kế & combo thiết bị cho dự án',
    badge: 'Hỗ trợ trọn gói',
    href: '/contact',
    gradient: 'hover:border-emerald-500/80 hover:shadow-emerald-500/15',
    iconColor: 'bg-emerald-50 text-emerald-600 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white',
  },
];

export function QuickGoalNavigation() {
  return (
    <section className="page-section">
      <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-100/80 via-white to-slate-100/60 p-5 sm:p-8 lg:p-10 shadow-xs">
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
          {GOALS.map((goal) => {
            const Icon = goal.icon;
            return (
              <Link
                key={goal.id}
                href={goal.href}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl focus-ring ${goal.gradient}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                    <div
                      className={`grid size-11 sm:size-12 place-items-center rounded-xl border text-lg transition-all duration-300 group-hover:scale-110 ${goal.iconColor}`}
                    >
                      <Icon className="size-5 sm:size-6" aria-hidden="true" />
                    </div>
                    <span className="hidden rounded-full border border-slate-200/80 bg-slate-100/80 px-3 py-0.5 text-xs font-extrabold text-slate-700 sm:inline shadow-2xs">
                      {goal.badge}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black leading-snug text-slate-900 transition-colors group-hover:text-red-600">
                    {goal.title}
                  </h3>
                  <p className="mt-1.5 text-xs font-medium text-slate-500 leading-relaxed max-sm:hidden">
                    {goal.subtitle}
                  </p>
                </div>

                <div className="mt-4 sm:mt-6 flex items-center gap-1.5 text-xs font-black text-red-600 group-hover:text-red-700 transition">
                  <span>Khám phá ngay</span>
                  <MoveUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
