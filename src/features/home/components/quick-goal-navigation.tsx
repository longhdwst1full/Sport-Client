import { Reveal } from '@/foundation/components/motion';
import Link from 'next/link';
import { Building2, Dumbbell, Flame, Home, MoveUpRight } from 'lucide-react';

interface GoalItem {
  id: string;
  icon: typeof Home;
  title: string;
  subtitle: string;
  badge: string;
  href: string;
}

/**
 * Một kiểu cho mọi thẻ mục tiêu (bảng màu logo, `20-design-tokens.md`): ô icon xám trung tính, hover nhấn
 * đỏ thương hiệu; trước đây mỗi mục tiêu một màu (amber/xanh) không mang nghĩa trạng thái.
 */
const GOAL_ICON_TILE =
  'border-neutral-200 bg-neutral-50 text-neutral-800 group-hover:border-brand-200 group-hover:bg-brand-50 group-hover:text-brand-600';
const GOAL_BADGE = 'border-neutral-200 bg-neutral-50 text-neutral-700';

const GOALS: GoalItem[] = [
  {
    id: 'home-gym',
    icon: Home,
    title: 'Tập Luyện Tại Nhà',
    subtitle: 'Máy chạy, xe đạp, ghế tập & tạ tay gọn gàng',
    badge: 'Phổ biến nhất',
    href: '/products?category=may-tap-the-duc',
  },
  {
    id: 'strength',
    icon: Dumbbell,
    title: 'Tăng Cơ & Thể Lực',
    subtitle: 'Giàn tạ đa năng, tạ khối & khung gánh an toàn',
    badge: 'Chuyên sâu',
    href: '/products?category=dung-cu-tap-gym',
  },
  {
    id: 'cardio',
    icon: Flame,
    title: 'Đốt Mỡ & Giảm Cân',
    subtitle: 'Máy chạy bộ cao cấp, xe đạp tập & cardio',
    badge: 'Hiệu quả cao',
    href: '/products?category=may-chay-bo',
  },
  {
    id: 'commercial',
    icon: Building2,
    title: 'Setup Phòng Gym',
    subtitle: 'Tư vấn thiết kế & combo thiết bị cho dự án',
    badge: 'Hỗ trợ trọn gói',
    href: '/contact',
  },
];

export function QuickGoalNavigation() {
  return (
    <section className="page-section">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8 lg:p-10">
        <Reveal rootMargin="-60px" className="mb-6 sm:mb-8">
          <div>
            <p className="eyebrow text-neutral-900">Định hướng tập luyện</p>
            <h2 className="mt-2.5 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900">
              Bạn Đang Tìm Thiết Bị Cho Mục Tiêu Nào?
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm font-medium text-neutral-500 max-w-2xl">
              Chọn nhanh giải pháp phù hợp với diện tích phòng và nhu cầu rèn luyện của bạn
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {GOALS.map((goal) => {
            const Icon = goal.icon;
            return (
              <Reveal
                key={goal.id}
                variant="zoom-in"
                stagger
                rootMargin="-60px"
                className="transition-transform duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] motion-reduce:transition-none"
              >
                <Link
                  href={goal.href}
                  className="card-interactive group relative flex h-full flex-col justify-between p-5 sm:p-6 focus-ring"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div
                        className={`grid size-12 sm:size-14 place-items-center rounded-2xl border text-xl transition-all duration-300 group-hover:scale-110 shadow-xs ${GOAL_ICON_TILE}`}
                      >
                        <Icon className="size-6 sm:size-7" aria-hidden="true" />
                      </div>
                      <span className={`hidden rounded-full border px-3 py-0.5 text-xs font-bold sm:inline shadow-2xs ${GOAL_BADGE}`}>
                        {goal.badge}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold leading-snug text-neutral-900 transition-colors group-hover:text-neutral-950">
                      {goal.title}
                    </h3>
                    <p className="mt-1.5 text-xs font-medium text-neutral-500 leading-relaxed max-sm:hidden">
                      {goal.subtitle}
                    </p>
                  </div>

                  <div className="mt-5 sm:mt-6 flex items-center gap-1.5 text-xs font-bold text-neutral-900 group-hover:text-neutral-950 transition">
                    <span>Khám phá ngay</span>
                    <MoveUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
