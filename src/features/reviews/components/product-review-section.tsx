'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Camera,
  Filter,
  ShieldCheck,
  ChevronDown,
  X,
  Sparkles,
  Send,
} from 'lucide-react';
import { STORE_CONFIG } from '@/constants';

export interface ReviewItem {
  id: string;
  authorName: string;
  isVerifiedPurchase: boolean;
  rating: number;
  date: string;
  variantName?: string;
  content: string;
  pros?: string;
  cons?: string;
  images?: string[];
  helpfulCount: number;
  officialReply?: {
    author: string;
    date: string;
    content: string;
  };
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    authorName: 'Trần Quang Huy',
    isVerifiedPurchase: true,
    rating: 5,
    date: '2 ngày trước',
    variantName: 'Bản Tiêu Chuẩn',
    content:
      'Thiết bị tập rất đầm và êm ái, khung thép dày dặn chắc chắn. Kháng lực từ chuyển nấc mượt mà không hề có tiếng rít như dòng xích cơ cũ. Giao hàng hỏa tốc trong 2h tại Q7 đúng như cam kết. Rất hài lòng với dịch vụ lắp đặt của Bảo An Sport!',
    pros: 'Chạy êm ái dưới 25dB, màn hình LED sắc nét, sơn tĩnh điện đẹp.',
    cons: 'Khung xe đầm và nặng nên khiêng lên lầu cần 2 người.',
    images: [
      '/images/products/spin-bike.jpg',
      'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=600&q=80',
    ],
    helpfulCount: 24,
    officialReply: {
      author: 'Chăm Sóc Khách Hàng Bảo An Sport',
      date: '1 ngày trước',
      content:
        'Bảo An Sport chân thành cảm ơn anh Huy đã tin tưởng lựa chọn sản phẩm! Chúc anh cùng gia đình luôn tràn đầy năng lượng và đạt mục tiêu sức khỏe tốt nhất. Đội ngũ CSKH luôn sẵn sàng hỗ trợ anh bảo dưỡng định kỳ miễn phí ạ!',
    },
  },
  {
    id: 'rev-2',
    authorName: 'Lê Minh Tuấn (HLV Gym)',
    isVerifiedPurchase: true,
    rating: 5,
    date: '1 tuần trước',
    variantName: 'Bản Cao Cấp Pro',
    content:
      'Đã mua cho phòng tập cá nhân của mình. Độ hoàn thiện cơ khí rất cao, chịu tải 150kg thoải mái khi tập HIIT cường độ cao. Tích hợp kết nối Kinomap và Zwift đạp xe ảo qua Bluetooth mượt mà.',
    pros: 'Bánh đà thép đúc cân bằng tốt, yên ngồi công thái học êm.',
    helpfulCount: 19,
  },
  {
    id: 'rev-3',
    authorName: 'Nguyễn Thị Mai',
    isVerifiedPurchase: true,
    rating: 5,
    date: '2 tuần trước',
    variantName: 'Bản Tiêu Chuẩn',
    content:
      'Mình mua tặng ba mẹ tập thể dục mỗi sáng. Xe đạp rất êm không gây ồn ào ảnh hưởng phòng khách. Bàn đạp có quai cài chân chống trượt an toàn cho người lớn tuổi. Kỹ thuật viên giao hàng mang tận phòng và hướng dẫn sử dụng rất chu đáo.',
    pros: 'Êm ái bảo vệ khớp gối, chiều cao yên tùy chỉnh linh hoạt.',
    images: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=600&q=80',
    ],
    helpfulCount: 15,
  },
  {
    id: 'rev-4',
    authorName: 'Hoàng Quốc Việt',
    isVerifiedPurchase: true,
    rating: 4,
    date: '3 tuần trước',
    variantName: 'Bản Tiêu Chuẩn',
    content:
      'Sản phẩm đẹp đúng như trên mô phỏng 3D của website. Đóng gói thùng xốp 3 lớp cẩn thận. Trừ 1 sao nhỏ vì bên vận chuyển giao trễ 30 phút so với giờ hẹn, nhưng bạn kỹ thuật viên hỗ trợ nhiệt tình bù lại.',
    pros: 'Thiết kế đẹp hiện đại, giá hợp lý trong phân khúc.',
    cons: 'Giao hàng cần căn đúng giờ hẹn hơn.',
    helpfulCount: 8,
    officialReply: {
      author: 'Chăm Sóc Khách Hàng Bảo An Sport',
      date: '3 tuần trước',
      content:
        'Chào anh Việt, Bảo An Sport chân thành xin lỗi vì sự bất tiện giao hàng trễ 30 phút do kẹt xe giờ cao điểm tại khu vực. Chúng tôi đã ghi nhận và tối ưu lộ trình điều phối tốt hơn. Cảm ơn anh đã đánh giá công tâm!',
    },
  },
];

interface ProductReviewSectionProps {
  productName: string;
  productSlug?: string;
}

export function ProductReviewSection({
  productName,
  productSlug,
}: ProductReviewSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [activeFilter, setActiveFilter] = useState<'all' | '5' | '4' | 'has_media' | 'verified'>('all');
  const [helpfulLiked, setHelpfulLiked] = useState<Record<string, boolean>>({});

  // Review submission modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formAuthorName, setFormAuthorName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formPros, setFormPros] = useState('');
  const [formCons, setFormCons] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate statistics
  const totalReviews = reviews.length + 124; // Mock social base proof
  const averageRating = 4.9;

  const starBreakdown = [
    { star: 5, count: 108, pct: 84 },
    { star: 4, count: 15, pct: 12 },
    { star: 3, count: 3, pct: 2 },
    { star: 2, count: 1, pct: 1 },
    { star: 1, count: 1, pct: 1 },
  ];

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (activeFilter === '5') return r.rating === 5;
      if (activeFilter === '4') return r.rating === 4;
      if (activeFilter === 'has_media') return (r.images?.length ?? 0) > 0;
      if (activeFilter === 'verified') return r.isVerifiedPurchase;
      return true;
    });
  }, [reviews, activeFilter]);

  const handleToggleHelpful = (id: string) => {
    if (helpfulLiked[id]) return;
    setHelpfulLiked((prev) => ({ ...prev, [id]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r)),
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formContent.trim() || !formAuthorName.trim()) {
      alert('Vui lòng nhập tên và nội dung đánh giá.');
      return;
    }

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      authorName: formAuthorName.trim(),
      isVerifiedPurchase: true,
      rating: formRating,
      date: 'Vừa xong',
      variantName: 'Bản Tiêu Chuẩn',
      content: formContent.trim(),
      pros: formPros.trim() || undefined,
      cons: formCons.trim() || undefined,
      helpfulCount: 0,
      officialReply: {
        author: 'Chăm Sóc Khách Hàng Bảo An Sport',
        date: 'Vừa xong',
        content: `Cảm ơn bạn ${formAuthorName.trim()} đã tin dùng thiết bị chính hãng tại Bảo An Sport!`,
      },
    };

    setReviews([newRev, ...reviews]);
    setIsModalOpen(false);
    setFormContent('');
    setFormPros('');
    setFormCons('');
    setToastMessage('Cảm ơn bạn đã gửi đánh giá! Đánh giá đã được xuất bản.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <section aria-labelledby="product-reviews-title" className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-emerald-500/40 bg-slate-900/95 px-6 py-3.5 text-xs font-bold text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Review Overview Container */}
      <div className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-800">
                <ShieldCheck className="size-3.5 text-emerald-700" /> Đánh giá xác thực
              </span>
            </div>
            <h2
              id="product-reviews-title"
              className="mt-2 text-xl font-black text-slate-900 sm:text-2xl"
            >
              Đánh giá & Nhận xét từ khách hàng
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Nhận xét thực tế từ người dùng đã mua và trải nghiệm thiết bị {productName}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 active:scale-95"
          >
            <MessageSquare className="size-4" />
            <span>Viết đánh giá của bạn</span>
          </button>
        </div>

        {/* Rating Score & Star Breakdown */}
        <div className="mt-8 grid gap-8 rounded-2xl bg-slate-50/70 p-6 sm:grid-cols-[200px_1fr] sm:p-8">
          {/* Left Column: Big Score */}
          <div className="flex flex-col items-center justify-center border-b border-slate-200/60 pb-6 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-8 text-center">
            <span className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
              {averageRating}
            </span>
            <div className="mt-2 flex text-amber-400">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="size-4 fill-amber-400" />
              ))}
            </div>
            <span className="mt-2 text-xs font-bold text-slate-700">
              {totalReviews} lượt đánh giá
            </span>
            <span className="text-[11px] text-slate-400">100% người mua hài lòng</span>
          </div>

          {/* Right Column: Bars */}
          <div className="space-y-2.5">
            {starBreakdown.map((row) => (
              <div key={row.star} className="flex items-center gap-3 text-xs">
                <span className="flex w-12 items-center gap-1 font-bold text-slate-700">
                  {row.star} <Star className="size-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all duration-500"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-10 text-right font-mono text-[11px] font-semibold text-slate-500">
                  {row.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-slate-100 pb-5">
          <span className="mr-1 text-xs font-bold text-slate-500">Lọc theo:</span>
          {[
            { id: 'all' as const, label: `Tất cả (${reviews.length})` },
            { id: '5' as const, label: '5 sao ★' },
            { id: '4' as const, label: '4 sao ★' },
            { id: 'has_media' as const, label: 'Có hình ảnh thực tế' },
            { id: 'verified' as const, label: 'Đã mua hàng chính hãng' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                activeFilter === f.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Review Cards List */}
        <div className="mt-6 divide-y divide-slate-100">
          {filteredReviews.map((rev) => (
            <article key={rev.id} className="py-6 first:pt-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-sm font-black text-white shadow-sm">
                    {rev.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-bold text-slate-900">
                        {rev.authorName}
                      </strong>
                      {rev.isVerifiedPurchase && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                          <CheckCircle2 className="size-3" /> Đã mua hàng
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{rev.date}</span>
                      {rev.variantName && <span>· Phân loại: {rev.variantName}</span>}
                    </div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${
                        i < rev.rating ? 'fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <p className="mt-3 text-xs leading-relaxed text-slate-700 sm:text-sm">
                {rev.content}
              </p>

              {/* Pros and Cons */}
              {(rev.pros || rev.cons) && (
                <div className="mt-3 space-y-1 text-xs">
                  {rev.pros && (
                    <p className="text-emerald-800">
                      <strong className="font-bold">Ưu điểm:</strong> {rev.pros}
                    </p>
                  )}
                  {rev.cons && (
                    <p className="text-slate-500">
                      <strong className="font-bold">Hạn chế:</strong> {rev.cons}
                    </p>
                  )}
                </div>
              )}

              {/* Attached Photos */}
              {rev.images && rev.images.length > 0 && (
                <div className="mt-3.5 flex flex-wrap gap-2.5">
                  {rev.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative size-16 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 transition hover:scale-105"
                    >
                      <Image
                        src={img}
                        alt="Ảnh thực tế từ khách hàng"
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Official Store Reply */}
              {rev.officialReply && (
                <div className="mt-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <Sparkles className="size-3.5 text-emerald-600" />
                      {rev.officialReply.author}
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      {rev.officialReply.date}
                    </span>
                  </div>
                  <p className="mt-1.5 leading-relaxed text-emerald-950">
                    {rev.officialReply.content}
                  </p>
                </div>
              )}

              {/* Helpful footer */}
              <div className="mt-3 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleToggleHelpful(rev.id)}
                  disabled={helpfulLiked[rev.id]}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    helpfulLiked[rev.id]
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <ThumbsUp className="size-3.5" />
                  <span>Hữu ích ({rev.helpfulCount})</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* WRITE REVIEW MODAL                                       */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Đánh giá sản phẩm</h3>
                <p className="mt-0.5 text-xs text-slate-500 truncate">{productName}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="mt-6 space-y-4">
              {/* Star Rating Interactive Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Mức độ hài lòng của bạn *
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setFormHoverRating(star)}
                        onMouseLeave={() => setFormHoverRating(0)}
                        onClick={() => setFormRating(star)}
                        className="p-1 transition hover:scale-110"
                      >
                        <Star
                          className={`size-7 ${
                            star <= (formHoverRating || formRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="ml-2 text-xs font-bold text-amber-600">
                    {formRating === 5
                      ? 'Tuyệt vời (5/5)'
                      : formRating === 4
                      ? 'Hài lòng (4/5)'
                      : formRating === 3
                      ? 'Bình thường (3/5)'
                      : formRating === 2
                      ? 'Tạm được (2/5)'
                      : 'Không hài lòng (1/5)'}
                  </span>
                </div>
              </div>

              {/* Author Name and Phone */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={formAuthorName}
                    onChange={(e) => setFormAuthorName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Số điện thoại (Bảo mật) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Detailed review comment */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Nội dung đánh giá *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Chia sẻ cảm nhận thực tế khi sử dụng: máy chạy có êm không, độ chịu lực, âm thanh, tính năng nào bạn thích nhất..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 sm:text-sm"
                />
              </div>

              {/* Pros and Cons */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Điểm thích nhất (Ưu điểm)
                  </label>
                  <input
                    type="text"
                    value={formPros}
                    onChange={(e) => setFormPros(e.target.value)}
                    placeholder="Ví dụ: Máy êm, thiết kế đẹp..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Cần cải thiện (Hạn chế)
                  </label>
                  <input
                    type="text"
                    value={formCons}
                    onChange={(e) => setFormCons(e.target.value)}
                    placeholder="Ví dụ: Hơi nặng khi di chuyển..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Notice */}
              <p className="text-[11px] text-slate-400">
                * Số điện thoại của bạn sẽ được ẩn nhằm bảo vệ quyền riêng tư cá nhân.
              </p>

              {/* Modal Buttons */}
              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500"
                >
                  <Send className="size-3.5" />
                  <span>Gửi đánh giá ngay</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
