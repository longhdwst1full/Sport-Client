import { Dumbbell, Flame, HeartPulse, ShieldCheck } from 'lucide-react';

export interface AdvisorOption {
  id: string;
  label: string;
  desc: string;
}

export const GOAL_OPTIONS: (AdvisorOption & { icon: typeof Dumbbell })[] = [
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

export const SPACE_OPTIONS: AdvisorOption[] = [
  { id: 'under-5m2', label: 'Góc nhỏ < 5m²', desc: 'Góc phòng ngủ, phòng khách hoặc ban công' },
  { id: '5-10m2', label: 'Phòng riêng 5 – 10m²', desc: 'Không gian lý tưởng cho 1–2 máy tập chính' },
  { id: '10-20m2', label: 'Home Gym 10 – 20m²', desc: 'Đầy đủ giàn tạ, máy cardio & sàn cao su' },
  { id: 'over-20m2', label: 'Studio / Phòng Gym > 20m²', desc: 'Quy mô kinh doanh hoặc phòng gym gia đình lớn' },
];

export const BUDGET_OPTIONS: AdvisorOption[] = [
  { id: 'under-2m', label: 'Dưới 2 Triệu', desc: 'Phụ kiện tập, tạ tay, thảm, dây kháng lực' },
  { id: '2-5m', label: '2 – 5 Triệu', desc: 'Ghế tập đa năng, xe đạp thể lực, tạ đĩa' },
  { id: '5-15m', label: '5 – 15 Triệu', desc: 'Máy chạy bộ gia đình, giàn tạ khối trọn bộ' },
  { id: 'over-15m', label: 'Trên 15 Triệu', desc: 'Thiết bị chuyên nghiệp cao cấp, trọn gói phòng tập' },
];
