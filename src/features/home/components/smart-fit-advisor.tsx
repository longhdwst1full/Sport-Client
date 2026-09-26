'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Dumbbell,
  Flame,
  HeartPulse,
  Maximize2,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { STORE_CONTACT } from '@/shared/constants';

interface Option {
  id: string;
  label: string;
  desc: string;
}

const GOAL_OPTIONS: (Option & { icon: typeof Dumbbell })[] = [
  {
    id: 'muscle',
    label: 'Tăng cơ & Sức mạnh',
    desc: 'Tập trung cơ bắp toàn thân, thể lực',
    icon: Dumbbell,
  },
  {
    id: 'fatloss',
    label: 'Đốt mỡ & Giảm cân',
    desc: 'Cardio, săn chắc vóc dáng, bền bỉ',
    icon: Flame,
  },
  {
    id: 'health',
    label: 'Sức khỏe cả gia đình',
    desc: 'Mọi lứa tuổi, vận động nhẹ nhàng',
    icon: HeartPulse,
  },
  {
    id: 'rehab',
    label: 'Phục hồi chức năng',
    desc: 'Trị liệu cơ xương khớp, người lớn tuổi',
    icon: ShieldCheck,
  },
];

const SPACE_OPTIONS: Option[] = [
  { id: 'under-5m2', label: 'Góc nhỏ < 5m²', desc: 'Góc phòng ngủ, phòng khách hoặc ban công' },
  { id: '5-10m2', label: 'Phòng riêng 5 – 10m²', desc: 'Không gian lý tưởng cho 1–2 máy tập chính' },
  { id: '10-20m2', label: 'Home Gym 10 – 20m²', desc: 'Đầy đủ giàn tạ, máy cardio & sàn cao su' },
  { id: 'over-20m2', label: 'Studio / Phòng Gym > 20m²', desc: 'Quy mô kinh doanh hoặc phòng gym gia đình lớn' },
];

const BUDGET_OPTIONS: Option[] = [
  { id: 'under-2m', label: 'Dưới 2 Triệu', desc: 'Phụ kiện tập, tạ tay, thảm, dây kháng lực' },
  { id: '2-5m', label: '2 – 5 Triệu', desc: 'Ghế tập đa năng, xe đạp thể lực, tạ đĩa' },
  { id: '5-15m', label: '5 – 15 Triệu', desc: 'Máy chạy bộ gia đình, giàn tạ khối trọn bộ' },
  { id: 'over-15m', label: 'Trên 15 Triệu', desc: 'Thiết bị chuyên nghiệp cao cấp, trọn gói phòng tập' },
];

export function SmartFitAdvisor() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedGoal, setSelectedGoal] = useState<string>('muscle');
  const [selectedSpace, setSelectedSpace] = useState<string>('5-10m2');
  const [selectedBudget, setSelectedBudget] = useState<string>('2-5m');

  const handleReset = () => {
    setStep(1);
    setSelectedGoal('muscle');
    setSelectedSpace('5-10m2');
    setSelectedBudget('2-5m');
  };

  const getGoalLabel = () => GOAL_OPTIONS.find((g) => g.id === selectedGoal)?.label || '';
  const getSpaceLabel = () => SPACE_OPTIONS.find((s) => s.id === selectedSpace)?.label || '';
  const getBudgetLabel = () => BUDGET_OPTIONS.find((b) => b.id === selectedBudget)?.label || '';

  const getRecommendation = () => {
    if (selectedGoal === 'fatloss') {
      return {
        title: 'Gói Cardio Đốt Mỡ & Vóc Dáng Thon Gọn',
        items: ['Máy chạy bộ gia đình xếp gọn', 'Dây nhảy tốc độ & Thảm yoga chống trượt', 'Tạ tay bọc cao su 2-5kg'],
        catalogHref: '/products?category=cardio',
      };
    }
    if (selectedGoal === 'health') {
      return {
        title: 'Gói Vận Động Sức Khỏe Gia Đình Toàn Diện',
        items: ['Xe đạp tập thể lực có tựa lưng', 'Bàn bóng bàn thi đấu gấp gọn', 'Dây kháng lực đa năng'],
        catalogHref: '/products',
      };
    }
    if (selectedGoal === 'rehab') {
      return {
        title: 'Gói Phục Hồi Chức Năng & Vận Động Êm Ái',
        items: ['Xe đạp phục hồi có trợ lực', 'Thảm tập yoga TPE đàn hồi cao', 'Con lăn giãn cơ & bóng massage'],
        catalogHref: '/products',
      };
    }
    return {
      title: 'Gói Tăng Cơ Home Gym Đa Năng Cốt Lõi',
      items: ['Ghế tập tạ đa năng điều chỉnh 7 góc', 'Bộ tạ tay tháo lắp 24kg', 'Đòn tạ thẳng 1m5 & đĩa tạ bọc cao su'],
      catalogHref: '/products?category=gym',
    };
  };

  const recommendation = getRecommendation();
  const zaloMessage = encodeURIComponent(
    `Xin chào Bảo An Sport! Tôi cần tư vấn cấu hình thiết bị: Mục tiêu [${getGoalLabel()}], Không gian [${getSpaceLabel()}], Ngân sách [${getBudgetLabel()}]. Nhờ shop gửi báo giá chi tiết!`
  );

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="overflow-hidden rounded-[32px] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 sm:p-10 lg:p-12 text-white shadow-2xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-slate-800/80 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-emerald-400">
              <Trophy className="size-4 text-emerald-400" />
              BẢO AN SMART FIT ADVISOR
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              Không Chỉ Bán Thiết Bị. Chúng Tôi Giúp Bạn Chọn Đúng.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl">
              Chỉ mất 30 giây để xác định cấu hình phòng tập chuẩn huấn luyện theo diện tích, mục tiêu và khả năng chi trả.
            </p>
          </div>

          {step < 4 ? (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>Bước {step}/3</span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((s) => (
                  <span
                    key={s}
                    className={`h-1.5 w-6 rounded-full transition-all ${
                      s <= step ? 'bg-emerald-400' : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 transition"
            >
              <RefreshCw className="size-3.5" />
              <span>Làm lại từ đầu</span>
            </button>
          )}
        </div>

        {/* Wizard Body */}
        <div className="mt-8">
          {/* STEP 1: Goal */}
          {step === 1 && (
            <div>
              <h3 className="text-base sm:text-lg font-black text-white mb-4">
                1. Mục tiêu tập luyện ưu tiên của bạn là gì?
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {GOAL_OPTIONS.map((g) => {
                  const Icon = g.icon;
                  const isSelected = selectedGoal === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGoal(g.id)}
                      className={`flex flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/60 ring-2 ring-emerald-500/40 shadow-lg'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`grid size-11 place-items-center rounded-xl border ${
                            isSelected
                              ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-400'
                              : 'border-slate-800 bg-slate-800/80 text-slate-300'
                          }`}
                        >
                          <Icon className="size-5" />
                        </div>
                        {isSelected && (
                          <div className="grid size-6 place-items-center rounded-full bg-emerald-500 text-slate-950">
                            <Check className="size-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <strong className="block text-sm sm:text-base font-bold text-white mb-1">
                        {g.label}
                      </strong>
                      <p className="text-xs text-slate-400 leading-snug">{g.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                >
                  <span>Tiếp tục: Chọn không gian</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Space */}
          {step === 2 && (
            <div>
              <h3 className="text-base sm:text-lg font-black text-white mb-4">
                2. Diện tích không gian dự kiến đặt thiết bị?
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {SPACE_OPTIONS.map((s) => {
                  const isSelected = selectedSpace === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSpace(s.id)}
                      className={`flex flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/60 ring-2 ring-emerald-500/40 shadow-lg'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`grid size-11 place-items-center rounded-xl border ${
                            isSelected
                              ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-400'
                              : 'border-slate-800 bg-slate-800/80 text-slate-300'
                          }`}
                        >
                          <Maximize2 className="size-5" />
                        </div>
                        {isSelected && (
                          <div className="grid size-6 place-items-center rounded-full bg-emerald-500 text-slate-950">
                            <Check className="size-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <strong className="block text-sm sm:text-base font-bold text-white mb-1">
                        {s.label}
                      </strong>
                      <p className="text-xs text-slate-400 leading-snug">{s.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                >
                  <span>Tiếp tục: Chọn ngân sách</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Budget */}
          {step === 3 && (
            <div>
              <h3 className="text-base sm:text-lg font-black text-white mb-4">
                3. Khoảng ngân sách đầu tư bạn mong muốn?
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {BUDGET_OPTIONS.map((b) => {
                  const isSelected = selectedBudget === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBudget(b.id)}
                      className={`flex flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/60 ring-2 ring-emerald-500/40 shadow-lg'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-300">
                          {b.label}
                        </span>
                        {isSelected && (
                          <div className="grid size-6 place-items-center rounded-full bg-emerald-500 text-slate-950">
                            <Check className="size-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <strong className="block text-base sm:text-lg font-bold text-emerald-400 mb-1">
                        {b.label}
                      </strong>
                      <p className="text-xs text-slate-400 leading-snug">{b.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                >
                  <span>Xem cấu hình đề xuất</span>
                  <Sparkles className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Results */}
          {step === 4 && (
            <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-slate-800 pb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-400 mb-2">
                    <Sparkles className="size-3.5" />
                    <span>CẤU HÌNH ĐƯỢC CHUYÊN GIA BẢO AN SPORT TỐI ƯU</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {recommendation.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                    <span className="rounded-md bg-slate-800 px-2 py-0.5">Mục tiêu: {getGoalLabel()}</span>
                    <span className="rounded-md bg-slate-800 px-2 py-0.5">Không gian: {getSpaceLabel()}</span>
                    <span className="rounded-md bg-slate-800 px-2 py-0.5">Ngân sách: {getBudgetLabel()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://zalo.me/${STORE_CONTACT.primaryHotlineRaw}?text=${zaloMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
                  >
                    <Send className="size-3.5" />
                    <span>Nhận báo giá Zalo</span>
                  </a>
                  <Link
                    href={recommendation.catalogHref}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition"
                  >
                    <span>Xem sản phẩm</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>

              <div className="mt-6">
                <span className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                  Thiết bị nên có trong combo này:
                </span>
                <div className="grid gap-3 sm:grid-cols-3">
                  {recommendation.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                    >
                      <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-emerald-500/20 text-xs font-black text-emerald-400">
                        {idx + 1}
                      </div>
                      <span className="text-xs font-bold text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
