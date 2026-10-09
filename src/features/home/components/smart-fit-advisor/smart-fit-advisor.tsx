'use client';

import { useState, type ReactNode } from 'react';
import { Button } from '@/foundation/components/buttons';
import { Check, Maximize2, RefreshCw, Sparkles } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { GOAL_OPTIONS, SPACE_OPTIONS, BUDGET_OPTIONS } from '../../model/smart-fit.constants';
import { ADVISOR_SECONDARY_BUTTON, AdvisorOptionStep } from './advisor-option-step';
import { AdvisorResults } from './advisor-results';
import { SMART_FIT_CARD_MIN_HEIGHT } from './smart-fit-advisor.layout';

/** Ô icon đầu thẻ lựa chọn (bước mục tiêu/không gian), đổi màu theo trạng thái chọn. */
function OptionIconTile({ isSelected, children }: { isSelected: boolean; children: ReactNode }) {
  return (
    <div
      className={`grid size-11 place-items-center rounded-xl border transition-all ${
        isSelected
          ? 'border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-950/20'
          : 'border-slate-200 bg-slate-100/80 text-slate-700 group-hover:bg-slate-200/70 group-hover:text-slate-900'
      }`}
    >
      {children}
    </div>
  );
}

/** Nội dung chung của một thẻ lựa chọn: phần đầu + dấu tích khi chọn, nhãn và mô tả. */
function OptionCardContent({
  lead,
  isSelected,
  label,
  desc,
  labelClassName = 'text-sm sm:text-base text-slate-950',
}: {
  lead: ReactNode;
  isSelected: boolean;
  label: string;
  desc: string;
  labelClassName?: string;
}) {
  return (
    <>
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        {lead}
        {isSelected && (
          <div className="grid size-6 place-items-center rounded-full bg-red-600 text-white shadow-xs animate-scale-up">
            <Check className="size-3.5 stroke-[3]" aria-hidden="true" />
          </div>
        )}
      </div>
      <strong className={`block font-extrabold mb-1 ${labelClassName}`}>{label}</strong>
      <p className="text-xs text-slate-500 font-medium leading-snug">{desc}</p>
    </>
  );
}

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
    <section className="page-section">
      <div className={`relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-10 lg:p-12 text-white shadow-2xl ${SMART_FIT_CARD_MIN_HEIGHT}`}>
        {/* Subtle Ambient Glowing Spheres */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-red-600/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 size-80 rounded-full bg-sky-600/20 blur-3xl" aria-hidden="true" />

        {/* Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-slate-800/80 pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-sky-400 shadow-xs backdrop-blur-md">
              <Sparkles className="size-3.5 text-sky-400 animate-pulse" aria-hidden="true" />
              Smart Fit Advisor
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Không Chỉ Bán Thiết Bị. Chúng Tôi Giúp Bạn Chọn Đúng.
            </h2>
            <p className="mt-2 text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
              Chỉ mất 30 giây để xác định cấu hình phòng tập chuẩn huấn luyện theo diện tích, mục tiêu và khả năng chi trả.
            </p>
          </div>

          {step < 4 ? (
            <div className="flex items-center gap-2.5 rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-2 text-xs font-black text-slate-200 shadow-md">
              <span>Bước {step}/3</span>
              <div className="flex gap-1.5" aria-hidden="true">
                {[1, 2, 3].map((s) => (
                  <span
                    key={s}
                    className={`h-2 w-6 rounded-full transition-all duration-300 ${
                      s <= step ? 'bg-red-500 shadow-sm shadow-red-500/50' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReset}
              className="gap-1.5 rounded-full px-4 border-slate-700 bg-slate-800 text-white hover:bg-slate-700 font-bold"
            >
              <RefreshCw className="size-3.5 text-red-400" aria-hidden="true" />
              <span>Làm lại từ đầu</span>
            </Button>
          )}
        </div>

        {/* Wizard Body */}
        <div className="relative z-10 mt-8">
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
                const iconColors: Record<string, { tile: string; text: string }> = {
                  muscle: { tile: 'bg-rose-500/20 border-rose-500/40 text-rose-400', text: 'text-rose-400' },
                  fatloss: { tile: 'bg-amber-500/20 border-amber-500/40 text-amber-400', text: 'text-amber-400' },
                  health: { tile: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400', text: 'text-emerald-400' },
                  rehab: { tile: 'bg-sky-500/20 border-sky-500/40 text-sky-400', text: 'text-sky-400' },
                };
                const style = iconColors[g.id] || { tile: 'bg-slate-800 border-slate-700 text-slate-200', text: 'text-slate-200' };

                return (
                  <OptionCardContent
                    isSelected={isSelected}
                    label={g.label}
                    desc={g.desc}
                    labelClassName="text-sm sm:text-base text-white font-extrabold"
                    lead={
                      <div className={`grid size-11 place-items-center rounded-xl border transition-all duration-300 ${style.tile} group-hover:scale-110`}>
                        <Icon className="size-5 transition-transform duration-300 group-hover:rotate-6" />
                      </div>
                    }
                  />
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
                <OptionCardContent
                  isSelected={isSelected}
                  label={s.label}
                  desc={s.desc}
                  labelClassName="text-sm sm:text-base text-white font-extrabold"
                  lead={
                    <div className="grid size-11 place-items-center rounded-xl border border-sky-500/40 bg-sky-500/20 text-sky-400 transition-all duration-300 group-hover:scale-110">
                      <Maximize2 className="size-5" />
                    </div>
                  }
                />
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
                <OptionCardContent
                  isSelected={isSelected}
                  label={b.label}
                  desc={b.desc}
                  labelClassName="text-base sm:text-lg text-white font-black"
                  lead={
                    <span className="rounded-full border border-amber-400/40 bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-300 shadow-sm">
                      {b.label}
                    </span>
                  }
                />
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
