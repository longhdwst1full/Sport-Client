import { Breadcrumb } from '@/foundation/components/navigation';
import { ShowroomList } from '../components/showroom-list';
import { SupportContacts } from '../components/support-contacts';
import { ConsultationForm } from '../components/consultation-form';

export function ContactPage() {
  return (
      <div className="bg-stone-50/60 pb-20 pt-8">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <Breadcrumb
            className="mb-6"
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Hệ thống showroom & Liên hệ' },
            ]}
          />

          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-brand-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-brand-800">
              Hệ thống phân phối toàn quốc
            </span>
            <h1 className="mt-4 text-2xl font-black text-ink sm:text-4xl lg:text-5xl">
              Ghé thăm showroom & Tư vấn chuyên sâu
            </h1>
            <p className="mt-3 text-base text-stone-600 sm:text-lg">
              Trải nghiệm thực tế cảm giác cầm nắm, tải trọng thiết bị và nhận bản vẽ bố trí không gian tập Home Gym miễn phí từ chuyên gia.
            </p>
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Showroom List */}
            <div className="space-y-6">
              <ShowroomList />
              {/* Direct Support Contacts */}
              <SupportContacts />
            </div>

            {/* Consultation Request Form */}
            <ConsultationForm />
          </div>
        </main>
      </div>
  );
}
