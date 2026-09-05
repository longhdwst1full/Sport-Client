import Link from 'next/link';
import Image from 'next/image';
import {
  Dumbbell,
  Footprints,
  Goal,
  HeartPulse,
  Bike,
  Swords,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { StorefrontLayout } from '@/layouts/storefront-layout';

const ALL_CATEGORIES = [
  {
    slug: 'gym-fitness',
    title: 'Gym & Sức mạnh',
    description: 'Tạ đơn, tạ đòn, ghế tập, giàn tạ đa năng và phụ kiện thể hình chuyên nghiệp.',
    itemCount: '120+ thiết bị',
    icon: Dumbbell,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'chay-bo-cardio',
    title: 'Chạy bộ & Cardio',
    description: 'Máy chạy bộ gia đình, máy chèo thuyền, xe đạp tập và phụ kiện marathon.',
    itemCount: '85+ sản phẩm',
    icon: Footprints,
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'bong-da',
    title: 'Bóng đá & Đồng đội',
    description: 'Quả bóng tiêu chuẩn FIFA, giày đinh sân cỏ nhân tạo, phụ kiện thủ môn.',
    itemCount: '60+ sản phẩm',
    icon: Goal,
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'yoga-phuc-hoi',
    title: 'Yoga & Phục hồi cơ',
    description: 'Thảm định tuyến, con lăn foam roller, bóng gai massage, dây kháng lực.',
    itemCount: '95+ sản phẩm',
    icon: HeartPulse,
    image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'xe-dap-the-thao',
    title: 'Xe đạp thể thao',
    description: 'Xe đạp kháng lực từ, xe đạp spinning tập đùi và phụ kiện đồng hồ đo nhịp tim.',
    itemCount: '45+ mẫu mã',
    icon: Bike,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'vo-thuat-boxing',
    title: 'Võ thuật & Boxing',
    description: 'Bao cát đấm bốc da bò, găng tay đối kháng boxing, băng quấn tay thể thao.',
    itemCount: '50+ sản phẩm',
    icon: Swords,
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80',
  },
];

export const metadata = {
  title: 'Danh mục thiết bị thể thao — DCTD Sport',
  description: 'Khám phá trọn bộ các dòng thiết bị thể hình, cardio, yoga và thể thao đồng đội chính hãng.',
};

export default function CategoriesIndexPage() {
  return (
    <StorefrontLayout>
      <div className="bg-stone-50/60 pb-20 pt-8">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-xs font-semibold text-stone-500">
            <Link href="/" className="hover:text-emerald-700">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="font-bold text-ink">Danh mục thể thao</span>
          </nav>

          <div className="max-w-2xl">
            <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-emerald-800">
              Phân loại chuyên sâu
            </span>
            <h1 className="mt-3 text-3xl font-black text-ink sm:text-5xl">
              Tất cả môn thể thao & Thiết bị
            </h1>
            <p className="mt-3 text-base text-stone-600 sm:text-lg">
              Lựa chọn đúng môn tập bạn theo đuổi để xem các thiết bị, phụ kiện và combo được tuyển chọn kỹ lưỡng.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[32px] border border-stone-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-emerald-400 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-ink">
                        {cat.itemCount}
                      </span>
                      <Icon className="size-6 text-emerald-300" />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <h2 className="text-xl font-black text-ink group-hover:text-emerald-700">
                        {cat.title}
                      </h2>
                      <p className="mt-2 text-xs leading-relaxed text-stone-500">
                        {cat.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4 text-xs font-bold text-emerald-700">
                      <span>Xem toàn bộ sản phẩm</span>
                      <ChevronRight className="size-4 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </main>
      </div>
    </StorefrontLayout>
  );
}
