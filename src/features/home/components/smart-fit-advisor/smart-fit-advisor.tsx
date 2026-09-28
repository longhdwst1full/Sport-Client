'use client';

import { useState } from 'react';
import { Check, Maximize2, RefreshCw, Sparkles, Trophy } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { GOAL_OPTIONS, SPACE_OPTIONS, BUDGET_OPTIONS } from '../../model/smart-fit.constants';
import { AdvisorOptionStep } from './advisor-option-step';
import { AdvisorResults } from './advisor-results';

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
            <AdvisorOptionStep
              title="1. Mục tiêu tập luyện ưu tiên của bạn là gì?"
              options={GOAL_OPTIONS}
              selectedId={selectedGoal}
              onSelect={setSelectedGoal}
              onNext={() => setStep(2)}
              nextLabel="Tiếp tục: Chọn không gian"
              NextIcon={ArrowRight}
              renderCard={(g, isSelected) => {
                const Icon = g.icon;
                return (
                  <>
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
                  </>
                );
              }}
            />
          )}

          {/* STEP 2: Space */}
          {step === 2 && (
            <AdvisorOptionStep
              title="2. Diện tích không gian dự kiến đặt thiết bị?"
              options={SPACE_OPTIONS}
              selectedId={selectedSpace}
              onSelect={setSelectedSpace}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
              nextLabel="Tiếp tục: Chọn ngân sách"
              NextIcon={ArrowRight}
              renderCard={(s, isSelected) => (
                <>
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
                </>
              )}
            />
          )}

          {/* STEP 3: Budget */}
          {step === 3 && (
            <AdvisorOptionStep
              title="3. Khoảng ngân sách đầu tư bạn mong muốn?"
              options={BUDGET_OPTIONS}
              selectedId={selectedBudget}
              onSelect={setSelectedBudget}
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
              nextLabel="Xem cấu hình đề xuất"
              NextIcon={Sparkles}
              renderCard={(b, isSelected) => (
                <>
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
                </>
              )}
            />
          )}

          {/* STEP 4: Results */}
          {step === 4 && (
            <AdvisorResults
              recommendation={recommendation}
              goalLabel={getGoalLabel()}
              spaceLabel={getSpaceLabel()}
              budgetLabel={getBudgetLabel()}
            />
          )}
        </div>
      </div>
    </section>
  );
}
