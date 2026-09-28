import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Flame, ShieldCheck } from 'lucide-react';

export function HeroPromoCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:col-span-4">
      {/* Promo Card 1: Chính sách bảo hành (trang CMS thật) */}
      <Link
        href="/chinh-sach/chinh-sach-bao-hanh"
        className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-900 to-slate-950 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl min-h-[180px] sm:min-h-[210px] lg:min-h-[230px]"
      >
        {/* Background Cover */}
        <div className="relative size-full">
          <Image
            src="/images/banners/banner-bao-hanh.jpg"
            alt="Chính sách bảo hành Bảo An Sport"
            fill
            sizes="(max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent" />
        </div>

        {/* Text Info */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-400">
            <ShieldCheck className="size-3.5" />
            BẢO AN SPORT CHÍNH HÃNG
          </span>
          <h3 className="mt-1 text-base font-black leading-snug sm:text-lg group-hover:text-emerald-300 transition">
            Chính Sách Bảo Hành
          </h3>
          <p className="mt-0.5 text-xs text-slate-300 line-clamp-2">
            Điều kiện, thời hạn và cách gửi yêu cầu bảo hành
          </p>
          <div className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:underline">
            <span>Tra cứu chính sách</span>
            <ArrowRight className="size-3 transition group-hover:translate-x-1" />
          </div>
        </div>
      </Link>

      {/* Promo Card 2: Tạ Tay & Phụ Kiện */}
      <Link
        href="/category/dung-cu-tap-gym"
        className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-900 to-slate-950 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl min-h-[180px] sm:min-h-[210px] lg:min-h-[230px]"
      >
        {/* Background Cover */}
        <div className="relative size-full">
          <Image
            src="/images/banners/banner-ta-tay.jpg"
            alt="Tạ tay & phụ kiện gym chính hãng"
            fill
            sizes="(max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent" />
        </div>

        {/* Text Info */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-amber-400">
            <Flame className="size-3.5 fill-amber-400 text-amber-400" />
            {/* Thẻ này dẫn sang danh mục, không phải chương trình flash sale; gọi đúng tên
                để không hứa một chương trình có thể đang không chạy. */}
            PHỤ KIỆN TẬP GYM
          </span>
          <h3 className="mt-1 text-base font-black leading-snug sm:text-lg group-hover:text-amber-300 transition">
            Tạ Tay & Phụ Kiện Thể Thao
          </h3>
          <p className="mt-0.5 text-xs text-slate-300 line-clamp-2">
            Tạ tay, tạ đơn, ghế tập và phụ kiện cho phòng tập tại nhà
          </p>
          <div className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:underline">
            <span>Xem danh mục</span>
            <ArrowRight className="size-3 transition group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </div>
  );
}
