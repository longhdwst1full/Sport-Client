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
    gradient: 'from-neutral-800/10 via-neutral-800/5 to-transparent hover:border-neutral-900/40',
    iconColor: 'bg-neutral-900/10 text-neutral-900 border-neutral-900/20',
  },
  {
    id: 'strength',
    icon: Dumbbell,
    title: 'Tăng Cơ & Thể Lực',
    subtitle: 'Giàn tạ đa năng, tạ khối & khung gánh an toàn',
    badge: 'Chuyên sâu',
    href: '/products?category=dung-cu-tap-gym',
    gradient: 'from-neutral-500/10 via-neutral-500/5 to-transparent hover:border-neutral-500/40',
    iconColor: 'bg-neutral-500/10 text-neutral-700 border-neutral-500/20',
  },
  {
    id: 'cardio',
    icon: Flame,
    title: 'Đốt Mỡ & Giảm Cân',
    subtitle: 'Máy chạy bộ cao cấp, xe đạp tập & cardio',
    badge: 'Hiệu quả cao',
    href: '/products?category=may-chay-bo',
    gradient: 'from-brand-500/10 via-brand-500/5 to-transparent hover:border-brand-500/40',
    iconColor: 'bg-brand-500/10 text-brand-600 border-brand-500/20',
  },
  {
    id: 'commercial',
    icon: Building2,
    title: 'Setup Phòng Gym',
    subtitle: 'Tư vấn thiết kế & combo thiết bị cho dự án',
    badge: 'Hỗ trợ trọn gói',
    href: '/contact',
    gradient: 'from-neutral-500/10 via-neutral-500/5 to-transparent hover:border-neutral-500/40',
    iconColor: 'bg-neutral-500/10 text-neutral-700 border-neutral-500/20',
  },
];

export function QuickGoalNavigation() {
  return (
    <section className="page-section">
      <div className="rounded-3xl border border-neutral-200/80 bg-gradient-to-b from-white via-neutral-50/50 to-white p-4 sm:p-8 shadow-xs">
        <div className="mb-5 sm:mb-8">
          <div>
            <p className="eyebrow text-neutral-900">Định hướng tập luyện</p>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900">
              Bạn đang tìm thiết bị cho mục tiêu nào?
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500">
              Chọn nhanh giải pháp phù hợp với diện tích phòng và nhu cầu rèn luyện của bạn
            </p>
          </div>
        </div>

        {/* Mobile 2 cột gọn (ẩn mô tả, nhãn) thay vì 4 thẻ cao xếp dọc. */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {GOALS.map((goal) => {
            const Icon = goal.icon;
            return (
              <Link
                key={goal.id}
                href={goal.href}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white bg-gradient-to-br p-3.5 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-ring ${goal.gradient}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                    <div
                      className={`grid size-10 sm:size-12 place-items-center rounded-xl border text-lg ${goal.iconColor}`}
                    >
                      <Icon className="size-5 sm:size-6" aria-hidden="true" />
                    </div>
                    <span className="hidden rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-neutral-600 sm:inline">
                      {goal.badge}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-lg font-bold leading-snug text-neutral-900">
                    {goal.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed max-sm:hidden">
                    {goal.subtitle}
                  </p>
                </div>

                <div className="mt-3 sm:mt-5 flex items-center gap-1.5 text-xs font-bold text-neutral-800 group-hover:text-neutral-900 transition">
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
