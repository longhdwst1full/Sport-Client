import { Mail } from 'lucide-react';
import { NewsletterForm } from '@/widgets/newsletter-form/newsletter-form';

export function FooterNewsletterBanner() {
  return (
    <section className="bg-gradient-to-b from-slate-900 to-slate-950 px-6 py-16 text-white border-t border-slate-800 lg:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <Mail className="size-6" />
        </div>
        <h2 className="mt-5 text-2xl font-black sm:text-3xl text-white">
          Nhận ưu đãi độc quyền & kiến thức thể thao
        </h2>
        <p className="mt-2.5 text-sm text-slate-400 sm:text-base">
          Đăng ký email để nhận thông tin sản phẩm mới, combo thiết bị giảm giá và bài viết hướng dẫn tập luyện từ HLV.
        </p>
        <div className="mt-6">
          <NewsletterForm />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Chúng tôi cam kết bảo mật thông tin. Bạn có thể hủy nhận tin bất cứ lúc nào.
        </p>
      </div>
    </section>
  );
}
