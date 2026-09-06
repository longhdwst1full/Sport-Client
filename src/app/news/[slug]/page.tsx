import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  ChevronRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { StorefrontLayout } from '@/layouts/storefront-layout';

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Human-readable title generation from slug
  const title = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <StorefrontLayout>
      <div className="bg-stone-50/60 pb-20 pt-8">
        <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-xs font-semibold text-stone-500">
            <Link href="/" className="hover:text-emerald-700">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link href="/news" className="hover:text-emerald-700">Kiến thức luyện tập</Link>
            <span className="mx-2">/</span>
            <span className="font-bold text-ink truncate">{title}</span>
          </nav>

          <article className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-12">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-emerald-700">
              <span className="rounded-full bg-emerald-100 px-3 py-1 uppercase tracking-wider text-emerald-800">
                Tư vấn chuyên gia Bảo An Sport
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-stone-400">
                <Clock className="size-3.5" /> 6 phút đọc
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-stone-400">
                <Calendar className="size-3.5" /> Tháng 9, 2026
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-black leading-tight text-ink sm:text-4xl lg:text-5xl">
              {title}
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-stone-600 border-l-4 border-emerald-500 pl-4 italic">
              "Việc tập luyện đúng kỹ thuật cùng thiết bị đạt chuẩn an toàn không chỉ giúp tăng hiệu suất tối đa mà còn bảo vệ hệ thống cơ xương khớp dài hạn."
            </p>

            <div className="relative my-10 aspect-[16/9] overflow-hidden rounded-2xl bg-stone-100">
              <Image
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=85"
                alt={title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
            </div>

            <div className="prose prose-stone max-w-none text-base leading-8 text-stone-700 space-y-6">
              <p>
                Khi bắt đầu thiết lập không gian tập luyện tại nhà, đa số người tập thường băn khoăn giữa việc đầu tư từng món rời rạc hay chọn một combo giàn tạ hoàn chỉnh. Theo khảo sát từ hơn 10.000 khách hàng tại Bảo An Sport, việc lựa chọn đúng thiết bị nền tảng ngay từ đầu giúp tiết kiệm đến 40% chi phí nâng cấp về sau.
              </p>

              <h2 className="text-2xl font-bold text-ink">1. Tiêu chí lựa chọn kết cấu khung thép</h2>
              <p>
                Độ dày thành thép là yếu tố sống còn quyết định độ vững chắc khi gánh tạ nặng. Các dòng khung power rack đạt tiêu chuẩn Olympic của Bảo An Sport luôn sử dụng thép hộp 75x75mm với độ dày từ 2.5mm đến 3.0mm, sơn tĩnh điện sần chống trầy xước.
              </p>

              <h2 className="text-2xl font-bold text-ink">2. Tối ưu sàn nhà và giảm chấn cách âm</h2>
              <p>
                Khi tập tạ tại chung cư hoặc nhà phố liền kề, tiếng ồn va đập xuống sàn là nỗi lo lớn nhất. Việc trang bị thảm cao su EPDM mật độ cao 15mm - 20mm kết hợp các đĩa tạ bọc cao su đúc nguyên khối sẽ triệt tiêu đến 95% rung chấn truyền qua kết cấu sàn bê tông.
              </p>

              <h2 className="text-2xl font-bold text-ink">3. Lời khuyên từ huấn luyện viên thể hình</h2>
              <p>
                Hãy bắt đầu với các chuyển động đa khớp căn bản: Squat, Bench Press, Deadlift, Overhead Press. Đừng vội mua quá nhiều phụ kiện chuyên biệt cho đến khi bạn đã xây dựng được thói quen kỷ luật tối thiểu 3 buổi mỗi tuần trong suốt 3 tháng liên tục.
              </p>
            </div>

            {/* Author Footer */}
            <div className="mt-12 flex items-center justify-between border-t border-stone-100 pt-6">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-full bg-emerald-500 font-bold text-ink">
                  HLV
                </div>
                <div>
                  <strong className="block text-sm font-bold text-ink">Ban Chuyên Môn Bảo An Sport</strong>
                  <span className="text-xs text-stone-400">Đội ngũ kỹ sư thiết bị & HLV Thể hình</span>
                </div>
              </div>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-5 py-2.5 text-xs font-bold text-ink transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                <ArrowLeft className="size-4" /> Xem bài viết khác
              </Link>
            </div>
          </article>
        </main>
      </div>
    </StorefrontLayout>
  );
}
