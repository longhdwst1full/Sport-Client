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
      <div className={`relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50/90 via-white to-slate-50/50 p-6 sm:p-10 lg:p-12 text-slate-950 shadow-sm ${SMART_FIT_CARD_MIN_HEIGHT}`}>
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-red-500/10 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 size-72 rounded-full bg-sky-500/10 blur-3xl" aria-hidden="true" />

        {/* Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-slate-200/80 pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50/80 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-sky-700 shadow-2xs">
              <Sparkles className="size-3 text-sky-500" aria-hidden="true" />
              Smart Fit Advisor
            </div>
            <h2 className="mt-2.5 text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
              Không Chỉ Bán Thiết Bị. Chúng Tôi Giúp Bạn Chọn Đúng.
            </h2>
            <p className="mt-2 text-sm text-slate-600 font-medium max-w-2xl">
              Chỉ mất 30 giây để xác định cấu hình phòng tập chuẩn huấn luyện theo diện tích, mục tiêu và khả năng chi trả.
            </p>
          </div>

          {step < 4 ? (
            <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 shadow-2xs">
              <span>Bước {step}/3</span>
              <div className="flex gap-1.5" aria-hidden="true">
                {[1, 2, 3].map((s) => (
                  <span
                    key={s}
                    className={`h-2 w-6 rounded-full transition-all duration-300 ${
                      s <= step ? 'bg-red-600 shadow-xs' : 'bg-slate-200'
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
              className={`gap-1.5 rounded-full px-4 border-slate-300 font-bold ${ADVISOR_SECONDARY_BUTTON}`}
            >
              <RefreshCw className="size-3.5 text-red-600" aria-hidden="true" />
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
                return (
                  <OptionCardContent
                    isSelected={isSelected}
                    label={g.label}
                    desc={g.desc}
                    lead={
                      <OptionIconTile isSelected={isSelected}>
                        <Icon className="size-5" />
                      </OptionIconTile>
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
                  lead={
                    <OptionIconTile isSelected={isSelected}>
                      <Maximize2 className="size-5" />
                    </OptionIconTile>
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
                  labelClassName="text-base sm:text-lg text-slate-950 font-black"
                  lead={
                    <span className="rounded-full border border-amber-300 bg-amber-100 px-3 py-0.5 text-xs font-black text-amber-900 shadow-2xs">
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
