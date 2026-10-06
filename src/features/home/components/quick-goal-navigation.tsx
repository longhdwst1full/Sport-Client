import Link from 'next/link';
import { Building2, Dumbbell, Flame, Home, MoveUpRight, Sparkles } from 'lucide-react';

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
    gradient: 'from-brand-500/10 via-brand-500/5 to-transparent hover:border-brand-500/40',
    iconColor: 'bg-brand-500/10 text-brand-600 border-brand-500/20',
  },
  {
    id: 'strength',
    icon: Dumbbell,
    title: 'Tăng Cơ & Thể Lực',
    subtitle: 'Giàn tạ đa năng, tạ khối & khung gánh an toàn',
    badge: 'Chuyên sâu',
    href: '/products?category=dung-cu-tap-gym',
    gradient: 'from-slate-500/10 via-slate-500/5 to-transparent hover:border-slate-500/40',
    iconColor: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
  },
  {
    id: 'cardio',
    icon: Flame,
    title: 'Đốt Mỡ & Giảm Cân',
    subtitle: 'Máy chạy bộ cao cấp, xe đạp tập & cardio',
    badge: 'Hiệu quả cao',
    href: '/products?category=may-chay-bo',
    gradient: 'from-orange-500/10 via-orange-500/5 to-transparent hover:border-orange-500/40',
    iconColor: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  },
  {
    id: 'commercial',
    icon: Building2,
    title: 'Setup Phòng Gym',
    subtitle: 'Tư vấn thiết kế & combo thiết bị cho dự án',
    badge: 'Hỗ trợ trọn gói',
    href: '/contact',
    gradient: 'from-sky-500/10 via-sky-500/5 to-transparent hover:border-sky-500/40',
    iconColor: 'bg-sky-500/10 text-sky-700 border-sky-500/20',
  },
];

export function QuickGoalNavigation() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-100/80 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-800 mb-2">
              <Sparkles className="size-3.5" aria-hidden="true" />
              <span>ĐỊNH HƯỚNG TẬP LUYỆN</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900">
              Bạn đang tìm thiết bị cho mục tiêu nào?
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Chọn nhanh giải pháp phù hợp với diện tích phòng và nhu cầu rèn luyện của bạn
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GOALS.map((goal) => {
            const Icon = goal.icon;
            return (
              <Link
                key={goal.id}
                href={goal.href}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white bg-gradient-to-br p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${goal.gradient}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div
                      className={`grid size-12 place-items-center rounded-xl border text-lg ${goal.iconColor}`}
                    >
                      <Icon className="size-6" aria-hidden="true" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                      {goal.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-brand-700 transition">
                    {goal.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                    {goal.subtitle}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-1.5 text-xs font-black text-slate-800 group-hover:text-brand-600 transition">
                  <span>Khám phá ngay</span>
                  <MoveUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
