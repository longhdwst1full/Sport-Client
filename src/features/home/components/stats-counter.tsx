'use client';

import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { MOCK_HOME_STATS as STATS } from '@/shared/data/mocks';

function useCountUp(target: number, duration = 2000, trigger = false) {
  const [count, setCount] = useState(0);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!trigger) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [trigger, target, duration]);

  return count;
}

export function StatsCounter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ icon: Icon, value, suffix, label }) => (
          <StatCard key={label} icon={Icon} value={value} suffix={suffix} label={label} visible={visible} />
        ))}
      </div>
    </section>
  );
}

function StatCard({
  icon: Icon,
  value,
  suffix,
  label,
  visible,
}: {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  visible: boolean;
}) {
  const count = useCountUp(value, 2000, visible);

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-ink/5 bg-white p-6 shadow-sm">
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="size-6" />
      </span>
      <div>
        <p className="text-3xl font-black text-ink">
          {count.toLocaleString('vi-VN')}
          {suffix}
        </p>
        <p className="mt-0.5 text-sm text-stone-500">{label}</p>
      </div>
    </div>
  );
}
