import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
  CheckCircle2,
  Box,
  Flame,
  Info,
} from 'lucide-react';
import type { Metadata } from 'next';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { ProductPurchasePanel } from '@/features/catalog/components/product-purchase-panel';
import { ProductRelatedSection } from '@/features/catalog/components/product-related-section';
import { Product3DViewer } from '@/components/3d/product-3d-viewer';
import { ProductReviewSection } from '@/features/reviews/components/product-review-section';
import { getCatalogProduct } from '@/generated/api/catalog/catalog';
import { ApiError } from '@/lib/api/fetcher';

export const revalidate = 0;

const FALLBACK_DETAILS: Record<string, any> = {
  'may-chay-bo-dctd-pro-x1': {
    id: 'prod-1',
    productNo: 'PRD-X1-001',
    name: 'Máy Chạy Bộ Điện Đa Năng DCTD Pro X1',
    slug: 'may-chay-bo-dctd-pro-x1',
    brand: 'Bảo An Sport',
    primaryCategory: 'Máy chạy bộ',
    productType: 'SIMPLE',
    status: 'ACTIVE',
    version: 1,
    minPrice: '14500000',
    currency: 'VND',
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=85',
    shortDescription: 'Máy chạy bộ điện thông minh DCTD Pro X1 với động cơ 3.5HP êm ái, thảm chạy kim cương 7 lớp chống chấn thương, kết nối Bluetooth thông minh và gập gọn thủy lực tiện lợi.',
    description: 'Trang bị động cơ AC biến tần thế hệ mới chịu tải lên đến 150kg, tốc độ tối đa 18km/h, độ dốc tự động 15 mức và tích hợp 12 bài tập chuyên sâu từ HLV Olympic.',
    variants: [
      {
        id: 'var-1-1',
        sku: 'DCTD-X1-STD',
        name: 'Bản Tiêu Chuẩn (Động cơ 3.0HP)',
        effectivePrice: '14500000',
        inventoryQuantity: 25,
      },
      {
        id: 'var-1-2',
        sku: 'DCTD-X1-PRO',
        name: 'Bản Cao Cấp (Động cơ 3.5HP + Nâng dốc tự động)',
        effectivePrice: '16900000',
        inventoryQuantity: 18,
      },
    ],
    techSpecs: [
      { label: 'Thương hiệu', value: 'DCTD Sport' },
      { label: 'Loại động cơ', value: 'Động cơ AC biến tần 3.5 HP Continuous (Đỉnh 5.0 HP)' },
      { label: 'Tốc độ tối đa', value: '0.8 – 18.0 km/h (Tùy chỉnh bước nhảy 0.1km/h)' },
      { label: 'Độ dốc tự động', value: '0 – 15 mức điều khiển điện tử' },
      { label: 'Kích thước băng tải', value: '1400 x 520 mm (Thảm Diamond 7 lớp chống trượt)' },
      { label: 'Hệ thống giảm xóc', value: '8 đệm lò xo Silicon đôi Air-Cushioning bảo vệ khớp gối' },
      { label: 'Tải trọng người tập', value: 'Tối đa 150 KG' },
      { label: 'Chính sách bảo hành', value: 'Bảo hành motor 6 năm, khung máy trọn đời, hỗ trợ tận nhà' },
    ],
    media: [],
    categories: [],
    categoryIds: [],
  },
  'bo-ta-tay-dieu-chinh-24kg': {
    id: 'prod-2',
    productNo: 'PRD-DMB-024',
    name: 'Bộ Tạ Tay Điều Chỉnh Thông Minh 24KG Pro',
    slug: 'bo-ta-tay-dieu-chinh-24kg',
    brand: 'Bảo An Sport',
    primaryCategory: 'Gym & Sức mạnh',
    productType: 'SIMPLE',
    status: 'ACTIVE',
    version: 1,
    minPrice: '3850000',
    currency: 'VND',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=85',
    shortDescription: 'Thay thế 15 cặp tạ truyền thống chỉ với 1 núm xoay chuyển nấc từ 2.5kg đến 24kg. Lõi thép carbon nguyên khối bọc nhựa kỹ thuật cao cấp chống va đập.',
    description: 'Cơ chế xoay đĩa cơ học chuẩn xác từng click, khay đế đúc chịu va đập giữ đĩa tạ cố định an toàn tuyệt đối khi tập luyện tại nhà.',
    variants: [
      {
        id: 'var-2-1',
        sku: 'DCTD-DMB-SINGLE',
        name: '1 Quả (2.5kg - 24kg)',
        effectivePrice: '3850000',
        inventoryQuantity: 50,
      },
      {
        id: 'var-2-2',
        sku: 'DCTD-DMB-PAIR',
        name: '1 Cặp 2 Quả (Kèm 2 khay đế chống va đập)',
        effectivePrice: '7200000',
        inventoryQuantity: 30,
      },
    ],
    techSpecs: [
      { label: 'Thương hiệu', value: 'DCTD Sport' },
      { label: 'Dải trọng lượng', value: '2.5kg – 24kg (15 mức điều chỉnh: 2.5, 3.5, 4.5, 5.5, 6.5, 8, 9, 10, 11.5, 13.5, 16, 18, 20.5, 22.5, 24kg)' },
      { label: 'Chất liệu đĩa tạ', value: 'Thép tấm cán nguội cắt CNC bọc nhựa nhiệt dẻo PU không mùi' },
      { label: 'Tay nắm (Handle)', value: 'Mạ Crom nhám kim cương công thái học chống trượt tay' },
      { label: 'Khay đế cố định', value: 'Nhựa Composite siêu bền chịu lực 100kg' },
      { label: 'Kích thước mỗi quả', value: '40 x 20 x 23 cm' },
      { label: 'Chính sách bảo hành', value: 'Bảo hành cơ cấu chuyển số 24 tháng, 1 đổi 1 trong 30 ngày' },
    ],
    media: [],
    categories: [],
    categoryIds: [],
  },
  'gian-ta-da-nang-smith-pro': {
    id: 'prod-3',
    productNo: 'PRD-SMT-003',
    name: 'Combo Giàn Tạ Đa Năng Smith Machine All-in-One',
    slug: 'gian-ta-da-nang-smith-pro',
    brand: 'Bảo An Sport',
    primaryCategory: 'Combo Home Gym',
    productType: 'BUNDLE',
    status: 'ACTIVE',
    version: 1,
    minPrice: '28900000',
    currency: 'VND',
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=85',
    shortDescription: 'Trọn bộ giàn tạ tích hợp khung kéo xô, thanh đòn Smith dẫn hướng an toàn, xà đơn xà kép và ghế tập tạ điều chỉnh cao cấp.',
    description: 'Thiết kế giải pháp phòng tập tại gia đỉnh cao all-in-one cho phép tập luyện hơn 45 bài tập: Squat an toàn, Bench Press, Lat Pulldown, Low Row, Cable Crossover...',
    variants: [
      {
        id: 'var-3-1',
        sku: 'DCTD-SMT-BUNDLE',
        name: 'Trọn Bộ Giàn Tạ + Ghế Tập + Phụ Kiện Kéo Xô',
        effectivePrice: '28900000',
        inventoryQuantity: 10,
        bundle: {
          bundleVariantId: 'var-3-1',
          components: [
            { componentVariantId: 'comp-1', componentName: 'Khung Smith dẫn hướng chịu lực 500kg', quantity: 1 },
            { componentVariantId: 'comp-2', componentName: 'Ghế vớt tạ điều chỉnh 7 nấc DCTD', quantity: 1 },
            { componentVariantId: 'comp-3', componentName: 'Bộ ròng rọc kéo xô đôi cao thấp', quantity: 1 },
          ],
        },
      },
      {
        id: 'var-3-2',
        sku: 'DCTD-SMT-FULL-PLATES',
        name: 'Gói Full Option (Kèm 100kg Tạ Đĩa Bọc Cao Su Phi 50)',
        effectivePrice: '34500000',
        inventoryQuantity: 6,
      },
    ],
    techSpecs: [
      { label: 'Thương hiệu', value: 'DCTD Sport' },
      { label: 'Khung thép chính', value: 'Thép hộp cường lực Q235 kích thước 75x75mm dày 3.0mm' },
      { label: 'Dây cáp & ròng rọc', value: 'Cáp máy bay bọc Nylon tải trọng kéo 1000kg + Bánh xe ròng rọc nhôm CNC' },
      { label: 'Tải trọng an toàn', value: 'Đòn Smith: 350kg | Khung gánh tạ tự do J-cup: 500kg | Xà đơn: 250kg' },
      { label: 'Kích thước sàn đặt', value: 'Dài 185cm x Rộng 165cm x Cao 220cm (Yêu cầu trần > 2.3m)' },
      { label: 'Phụ kiện kèm theo', value: 'Thanh kéo xô rộng, tay cầm tam giác, dây thừng bắp tay sau, móc mắt cá chân' },
      { label: 'Bảo hành', value: 'Bảo hành khung thép 10 năm, ròng rọc & cáp kéo 3 năm' },
    ],
    media: [],
    categories: [],
    categoryIds: [],
  },
  'xe-dap-tap-the-duc-spin-bike': {
    id: 'prod-4',
    productNo: 'PRD-BIKE-004',
    name: 'Xe Đạp Tập Thể Dục Kháng Lực Từ DCTD AirBike',
    slug: 'xe-dap-tap-the-duc-spin-bike',
    brand: 'Bảo An Sport',
    primaryCategory: 'Xe đạp tập',
    productType: 'SIMPLE',
    status: 'ACTIVE',
    version: 1,
    minPrice: '6200000',
    currency: 'VND',
    imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=1200&q=85',
    shortDescription: 'Xe đạp tập thể lực tại nhà với bánh đà từ tính 12kg siêu êm, kháng lực đa cấp độ, màn hình LCD đo nhịp tim/quãng đường/calo tiêu thụ và kết nối app đạp xe ảo.',
    description: 'Truyền động dây curoa cao cấp êm ái tuyệt đối không phát ra tiếng ồn, khung sườn chữ tam giác kép ổn định ngay cả khi đứng đạp bứt tốc ở cường độ cao.',
    variants: [
      {
        id: 'var-4-1',
        sku: 'DCTD-BIKE-HOME',
        name: 'Bản Gia Đình (Bánh đà 10kg + Màn hình LCD)',
        effectivePrice: '6200000',
        inventoryQuantity: 40,
      },
      {
        id: 'var-4-2',
        sku: 'DCTD-BIKE-PRO',
        name: 'Bản Chuyên Nghiệp (Bánh đà 14kg + Kháng từ vô cấp + App Kinomap)',
        effectivePrice: '8500000',
        inventoryQuantity: 22,
      },
    ],
    techSpecs: [
      { label: 'Thương hiệu', value: 'DCTD Sport' },
      { label: 'Hệ kháng lực', value: 'Kháng lực từ tính Magnetic không ma sát, vĩnh cửu không mòn' },
      { label: 'Khối lượng bánh đà', value: '12.0 KG thép đúc cân bằng động lực học' },
      { label: 'Hệ truyền động', value: 'Dây curoa cao su gân rãnh Silent-Belt siêu êm < 25dB' },
      { label: 'Điều chỉnh tư thế', value: 'Yên xe & tay cầm điều chỉnh 4 chiều (lên/xuống/tiến/lùi)' },
      { label: 'Tải trọng tối đa', value: '150 KG' },
      { label: 'Bảo hành', value: 'Bảo hành khung sườn 5 năm, hệ từ tính 24 tháng' },
    ],
    media: [],
    categories: [],
    categoryIds: [],
  },
  'ghe-tap-ta-dieu-chinh-gap-gon': {
    id: 'prod-5',
    productNo: 'PRD-BNCH-005',
    name: 'Ghế Tập Tạ Đa Năng Điều Chỉnh 7 Cấp Độ',
    slug: 'ghe-tap-ta-dieu-chinh-gap-gon',
    brand: 'Bảo An Sport',
    primaryCategory: 'Gym & Sức mạnh',
    productType: 'SIMPLE',
    status: 'ACTIVE',
    version: 1,
    minPrice: '2150000',
    currency: 'VND',
    imageUrl: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1200&q=85',
    shortDescription: 'Ghế vớt tạ điều chỉnh 7 góc dốc (từ dốc âm -20°, nằm phẳng 0° đến dốc đứng 90°), gấp gọn tiện lợi chỉ trong 10 giây tiết kiệm diện tích phòng khách.',
    description: 'Khung thép hộp 50x50mm sơn sần tĩnh điện, đệm mút cao su non bọc da PU vân sợi carbon chống thấm mồ hôi, chịu tải trọng tĩnh lên tới 400kg.',
    variants: [
      {
        id: 'var-5-1',
        sku: 'DCTD-BNCH-FOLD',
        name: 'Bản Gập Gọn Tiêu Chuẩn',
        effectivePrice: '2150000',
        inventoryQuantity: 45,
      },
      {
        id: 'var-5-2',
        sku: 'DCTD-BNCH-PRO',
        name: 'Bản Chuyên Nghiệp (Kèm móc giữ chân gập bụng)',
        effectivePrice: '2650000',
        inventoryQuantity: 30,
      },
    ],
    techSpecs: [
      { label: 'Thương hiệu', value: 'DCTD Sport' },
      { label: 'Góc điều chỉnh', value: 'Tựa lưng 7 góc (-20°, 0°, 15°, 30°, 45°, 60°, 85°) & Đệm ngồi 3 góc' },
      { label: 'Khung thép', value: 'Thép hộp cường lực 50 x 50 mm, sơn tĩnh điện chống xước' },
      { label: 'Độ dày đệm', value: '60 mm mút bọt biển mật độ cao đàn hồi tốt' },
      { label: 'Tải trọng tối đa', value: '400 KG' },
      { label: 'Trọng lượng ghế', value: '16.5 KG (Có bánh xe hỗ trợ di chuyển)' },
      { label: 'Bảo hành', value: '36 tháng khung sườn, 12 tháng da bọc' },
    ],
    media: [],
    categories: [],
    categoryIds: [],
  },
  'tham-yoga-dinh-tuyen-cao-su': {
    id: 'prod-6',
    productNo: 'PRD-YOGA-006',
    name: 'Thảm Yoga Định Tuyến Cao Su Tự Nhiên PU 5mm',
    slug: 'tham-yoga-dinh-tuyen-cao-su',
    brand: 'Bảo An Sport',
    primaryCategory: 'Yoga & Phục hồi',
    productType: 'SIMPLE',
    status: 'ACTIVE',
    version: 1,
    minPrice: '890000',
    currency: 'VND',
    imageUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1200&q=85',
    shortDescription: 'Cao su thiên nhiên 100% kết hợp mặt bám PU công nghệ khắc Laser định tuyến Asana chuẩn xác. Chống trơn trượt tuyệt đối kể cả khi đổ nhiều mồ hôi.',
    description: 'Thảm có độ dày 5mm hoàn hảo bảo vệ các khớp xương cổ tay, đầu gối và mắt cá chân. Bề mặt thấm hút mồ hôi tức thì, vật liệu thân thiện môi trường không độc hại.',
    variants: [
      {
        id: 'var-6-1',
        sku: 'DCTD-YOGA-GREEN',
        name: 'Màu Xanh Rêu Emerald',
        effectivePrice: '890000',
        inventoryQuantity: 60,
      },
      {
        id: 'var-6-2',
        sku: 'DCTD-YOGA-BLACK',
        name: 'Màu Đen Titan Obsidian',
        effectivePrice: '890000',
        inventoryQuantity: 40,
      },
      {
        id: 'var-6-3',
        sku: 'DCTD-YOGA-PURPLE',
        name: 'Màu Tím Pastel Lavender',
        effectivePrice: '890000',
        inventoryQuantity: 35,
      },
    ],
    techSpecs: [
      { label: 'Thương hiệu', value: 'DCTD Sport' },
      { label: 'Chất liệu', value: 'Đế cao su thiên nhiên Rubber 100% + Bề mặt da PU cao cấp' },
      { label: 'Kích thước tiêu chuẩn', value: '1830 mm x 680 mm' },
      { label: 'Độ dày', value: '5.0 mm (Mật độ đàn hồi cao)' },
      { label: 'Đặc tính bề mặt', value: 'Khắc laser định tuyến Asana, chống trơn trượt Wet-Grip' },
      { label: 'Trọng lượng', value: '3.1 KG (Độ bám sàn vững chãi, không xê dịch)' },
      { label: 'Phụ kiện kèm', value: 'Túi đựng thảm cao cấp + Dây đai đeo vai tiện lợi' },
    ],
    media: [],
    categories: [],
    categoryIds: [],
  },
  'ta-binh-voi-kettlebell-gang-duc': {
    id: 'prod-7',
    productNo: 'PRD-KTB-007',
    name: 'Tạ Bình Vôi Kettlebell Gang Đúc Bọc Neoprene 16KG',
    slug: 'ta-binh-voi-kettlebell-gang-duc',
    brand: 'Bảo An Sport',
    primaryCategory: 'Gym & Sức mạnh',
    productType: 'SIMPLE',
    status: 'ACTIVE',
    version: 1,
    minPrice: '790000',
    currency: 'VND',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=85',
    shortDescription: 'Gang nguyên khối bọc cao su Neoprene dày dặn bảo vệ sàn nhà và giảm chấn va đập. Tay cầm mạ crom phủ sần chống trơn trượt khi vung tạ swing.',
    description: 'Thiết kế chuẩn thi đấu Crossfit & Thể hình, trọng tâm dồn chuẩn xác giúp tối ưu hóa chuyển động cho các bài tập Kettlebell Swing, Turkish Get-Up, Snatch...',
    variants: [
      {
        id: 'var-7-1',
        sku: 'DCTD-KTB-12KG',
        name: 'Trọng lượng 12 KG',
        effectivePrice: '620000',
        inventoryQuantity: 30,
      },
      {
        id: 'var-7-2',
        sku: 'DCTD-KTB-16KG',
        name: 'Trọng lượng 16 KG (Khuyên dùng)',
        effectivePrice: '790000',
        inventoryQuantity: 45,
      },
      {
        id: 'var-7-3',
        sku: 'DCTD-KTB-24KG',
        name: 'Trọng lượng 24 KG (Chuyên nghiệp)',
        effectivePrice: '1150000',
        inventoryQuantity: 20,
      },
    ],
    techSpecs: [
      { label: 'Thương hiệu', value: 'DCTD Sport' },
      { label: 'Chất liệu thân tạ', value: 'Gang đúc nguyên khối Cast-Iron đặc ruột không mối hàn' },
      { label: 'Lớp bọc bảo vệ', value: 'Cao su Neoprene đúc dày 5mm giảm chấn tối đa' },
      { label: 'Đường kính tay cầm', value: 'Phi 35 mm (Chuẩn thi đấu quốc tế IUKL)' },
      { label: 'Xử lý bề mặt quai', value: 'Sơn tĩnh điện chống rỉ, bám phấn magnesium tốt' },
      { label: 'Đáy tạ', value: 'Mặt đáy phẳng tuyệt đối, đặt vững trên sàn không rung lắc' },
      { label: 'Bảo hành', value: 'Bảo hành vĩnh viễn kết cấu thân gang' },
    ],
    media: [],
    categories: [],
    categoryIds: [],
  },
  'sung-massage-cam-tay-phuc-hoi': {
    id: 'prod-8',
    productNo: 'PRD-MSG-008',
    name: 'Súng Massage Cầm Tay Trị Liệu Cơ Bắp DCTD Recovery',
    slug: 'sung-massage-cam-tay-phuc-hoi',
    brand: 'Bảo An Sport',
    primaryCategory: 'Yoga & Phục hồi',
    productType: 'SIMPLE',
    status: 'ACTIVE',
    version: 1,
    minPrice: '1850000',
    currency: 'VND',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85',
    shortDescription: 'Động cơ không chổi than lực đấm sâu 12mm giải tỏa căng cứng cơ tức thì, 6 đầu massage chuyên dụng cho từng nhóm cơ, pin Lithium 2600mAh hoạt động liên tục 8 tiếng.',
    description: 'Công nghệ cảm biến áp lực AI tự động điều chỉnh tần số xung khi nhấn mạnh vào bó cơ sâu. Màn hình cảm ứng OLED hiện đại hiển thị tốc độ và dung lượng pin.',
    variants: [
      {
        id: 'var-8-1',
        sku: 'DCTD-MSG-4HEAD',
        name: 'Bản Tiêu Chuẩn (4 Đầu Massage + Cáp Type-C)',
        effectivePrice: '1850000',
        inventoryQuantity: 50,
      },
      {
        id: 'var-8-2',
        sku: 'DCTD-MSG-6HEAD-CASE',
        name: 'Bản Pro (6 Đầu Massage + Hộp Vali Đựng Chống Sốc)',
        effectivePrice: '2250000',
        inventoryQuantity: 35,
      },
    ],
    techSpecs: [
      { label: 'Thương hiệu', value: 'DCTD Sport' },
      { label: 'Động cơ', value: 'Brushless motor không chổi than công suất 65W' },
      { label: 'Biên độ rung', value: '12 mm (Độ sâu tác động đến lớp mạc cơ sâu fascia)' },
      { label: 'Tần số xung', value: '1800 – 3200 vòng/phút (5 cấp tốc độ linh hoạt)' },
      { label: 'Dung lượng pin', value: 'Pin Lithium-ion 2600 mAh (Dùng 6 - 8 giờ sau 1 lần sạc)' },
      { label: 'Độ ồn hoạt động', value: '< 45 dB (Công nghệ giảm tiếng ồn QuietGlide)' },
      { label: 'Bảo hành', value: '24 tháng, lỗi 1 đổi 1 trong 60 ngày đầu' },
    ],
    media: [],
    categories: [],
    categoryIds: [],
  },
  'gian-ta-da-nang-olympic-pro': {
    id: 'prod-9',
    productNo: 'PRD-OLY-009',
    name: 'Giàn Tạ Đa Năng 3 Vị Trí Olympic Pro (Kèm Xô Đôi)',
    slug: 'gian-ta-da-nang-olympic-pro',
    brand: 'Bảo An Sport',
    primaryCategory: 'Gym & Sức mạnh',
    productType: 'BUNDLE',
    status: 'ACTIVE',
    version: 1,
    minPrice: '18900000',
    currency: 'VND',
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=85',
    shortDescription: 'Khung Half Rack thép hộp 75x75mm dày 3mm, tích hợp xà kép, xà đơn multi-grip, thanh J-cup chịu lực 600kg và hệ thống kéo xô đôi cao thấp mượt mà.',
    description: 'Thiết kế tối ưu cho các bài tập compound nặng: Squat, Deadlift, Bench Press, Pull-up, Dip, Dips... Đảm bảo an toàn tuyệt đối với chốt an toàn dài 45cm.',
    variants: [
      {
        id: 'var-9-1',
        sku: 'DCTD-OLY-BASE',
        name: 'Khung Half Rack Tiêu Chuẩn + Kéo Xô',
        effectivePrice: '18900000',
        inventoryQuantity: 12,
      },
      {
        id: 'var-9-2',
        sku: 'DCTD-OLY-FULL',
        name: 'Full Option (Kèm Ghế Điều Chỉnh + 70kg Tạ Đĩa)',
        effectivePrice: '24500000',
        inventoryQuantity: 7,
      },
    ],
    techSpecs: [
      { label: 'Thương hiệu', value: 'DCTD Sport' },
      { label: 'Khung thép chịu lực', value: 'Thép hộp vuông 75 x 75 mm dày 3.0 mm sơn tĩnh điện sần' },
      { label: 'Tải trọng giá đỡ', value: 'J-cup chịu lực 600 KG | Safety Bar 800 KG' },
      { label: 'Kích thước đặt', value: 'Dài 170cm x Rộng 150cm x Cao 218cm' },
      { label: 'Bảo hành', value: '10 năm khung thép, hỗ trợ bảo dưỡng trọn đời' },
    ],
    media: [],
    categories: [],
    categoryIds: [],
  },
  'bo-ta-tay-thao-lap-cao-cap-20kg': {
    id: 'prod-10',
    productNo: 'PRD-DMB20-010',
    name: 'Bộ Tạ Tay Tháo Lắp Cao Cấp 20KG (Đĩa Cao Su Đúc)',
    slug: 'bo-ta-tay-thao-lap-cao-cap-20kg',
    brand: 'Bảo An Sport',
    primaryCategory: 'Gym & Sức mạnh',
    productType: 'SIMPLE',
    status: 'ACTIVE',
    version: 1,
    minPrice: '1890000',
    currency: 'VND',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=85',
    shortDescription: 'Trọn bộ 2 quả tạ đơn 20kg có thể tháo lắp linh hoạt, kèm thanh nối dài 40cm để biến thành đòn tạ dài Barbell tập đẩy ngực và gánh tạ tại nhà.',
    description: 'Đĩa tạ gang bọc cao su dày dặn không gây trầy xước sàn gạch men, đai ốc vặn xoắn ốc sâu cố định chắc chắn không lo tuột đĩa khi tập.',
    variants: [
      {
        id: 'var-10-1',
        sku: 'DCTD-DMB-20KG',
        name: 'Hộp 20KG (Kèm thanh nối Barbell)',
        effectivePrice: '1890000',
        inventoryQuantity: 55,
      },
      {
        id: 'var-10-2',
        sku: 'DCTD-DMB-30KG',
        name: 'Hộp 30KG (Kèm thanh nối Barbell + Găng tay)',
        effectivePrice: '2450000',
        inventoryQuantity: 30,
      },
    ],
    techSpecs: [
      { label: 'Thương hiệu', value: 'DCTD Sport' },
      { label: 'Tổng trọng lượng', value: '20.0 KG (Bao gồm đĩa, 2 đòn ngắn, 1 thanh nối, 4 ốc khoá)' },
      { label: 'Cấu tạo đĩa', value: 'Gang đúc nguyên khối bọc cao su đúc chịu lực' },
      { label: 'Chiều dài thanh nối', value: '400 mm mút xốp đệm cổ vai êm ái' },
      { label: 'Bảo hành', value: '24 tháng 1 đổi 1' },
    ],
    media: [],
    categories: [],
    categoryIds: [],
  },
  'may-chay-bo-dien-gia-dinh-king-pro': {
    id: 'prod-11',
    productNo: 'PRD-RUN-011',
    name: 'Máy Chạy Bộ Điện Gia Đình King-Pro Động Cơ 3.5HP',
    slug: 'may-chay-bo-dien-gia-dinh-king-pro',
    brand: 'Bảo An Sport',
    primaryCategory: 'Máy chạy bộ',
    productType: 'SIMPLE',
    status: 'ACTIVE',
    version: 1,
    minPrice: '13500000',
    currency: 'VND',
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=85',
    shortDescription: 'Máy chạy bộ gia đình cao cấp động cơ DC 3.5HP siêu êm, màn hình điều khiển sắc nét, tích hợp loa nghe nhạc Hi-Fi và hệ thống bơm dầu bôi trơn tự động.',
    description: 'Thảm chạy 5 lớp chống trượt rộng 480mm, hệ thống nâng dốc cơ học 3 nấc, tích hợp đầu rung massage bụng và thanh gập bụng tập cơ lõi toàn diện.',
    variants: [
      {
        id: 'var-11-1',
        sku: 'DCTD-KING-SINGLE',
        name: 'Bản Đơn Năng Chuyên Chạy Bộ',
        effectivePrice: '13500000',
        inventoryQuantity: 20,
      },
      {
        id: 'var-11-2',
        sku: 'DCTD-KING-MULTI',
        name: 'Bản Đa Năng (Kèm đầu rung massage + Gập bụng + Đĩa xoay eo)',
        effectivePrice: '15500000',
        inventoryQuantity: 15,
      },
    ],
    techSpecs: [
      { label: 'Thương hiệu', value: 'DCTD Sport' },
      { label: 'Động cơ', value: 'DC 3.5 HP vận hành êm ái tiết kiệm điện' },
      { label: 'Tốc độ', value: '1.0 – 16.0 km/h' },
      { label: 'Băng tải', value: '1300 x 480 mm bề mặt vân kim cương' },
      { label: 'Tải trọng', value: '130 KG' },
      { label: 'Gập gọn', value: 'Piston thủy lực trợ lực hạ chậm an toàn' },
      { label: 'Bảo hành', value: 'Bảo hành máy 5 năm, linh kiện 2 năm tại nhà' },
    ],
    media: [],
    categories: [],
    categoryIds: [],
  },
  'ghe-tap-ta-dieu-chinh-7-goc-do': {
    id: 'prod-12',
    productNo: 'PRD-PWRBNCH-012',
    name: 'Ghế Tập Tạ Điều Chỉnh 7 Góc Độ Tiêu Chuẩn PowerBench',
    slug: 'ghe-tap-ta-dieu-chinh-7-goc-do',
    brand: 'Bảo An Sport',
    primaryCategory: 'Gym & Sức mạnh',
    productType: 'SIMPLE',
    status: 'ACTIVE',
    version: 1,
    minPrice: '3850000',
    currency: 'VND',
    imageUrl: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1200&q=85',
    shortDescription: 'Ghế vớt tạ chịu lực tiêu chuẩn thương mại 500KG, đệm mút đúc lạnh không bao giờ xẹp lún, cơ chế khóa thang chữ U cực kỳ vững chắc khi tập nặng.',
    description: 'Thiết kế chuẩn thi đấu Powerlifting với khoảng hở giữa tựa lưng và đệm ngồi chỉ 3cm hạn chế cấn mông, bánh xe cao su êm ái di chuyển khắp phòng.',
    variants: [
      {
        id: 'var-12-1',
        sku: 'DCTD-PWR-STD',
        name: 'Ghế PowerBench Tiêu Chuẩn',
        effectivePrice: '3850000',
        inventoryQuantity: 28,
      },
      {
        id: 'var-12-2',
        sku: 'DCTD-PWR-MODULE',
        name: 'Bản Kèm Module Cuốn Tay Trước (Preacher Curl Pad)',
        effectivePrice: '4650000',
        inventoryQuantity: 16,
      },
    ],
    techSpecs: [
      { label: 'Thương hiệu', value: 'DCTD Sport' },
      { label: 'Khung thép', value: 'Thép hộp 60 x 60 mm dày 2.5 mm sơn tĩnh điện sần' },
      { label: 'Tải trọng kiểm định', value: '500 KG' },
      { label: 'Tựa lưng', value: '7 vị trí điều chỉnh (0°, 15°, 30°, 45°, 60°, 75°, 85°)' },
      { label: 'Đệm mút', value: 'Mút đúc nguyên khối dày 70mm bọc da nhân tạo vân Carbon' },
      { label: 'Bảo hành', value: '5 năm khung sườn' },
    ],
    media: [],
    categories: [],
    categoryIds: [],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = FALLBACK_DETAILS[slug] || {
    name: slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
    shortDescription:
      'Thiết bị thể thao chính hãng DCTD Sport — Đạt tiêu chuẩn an toàn thể thao châu Âu, bảo hành 2-5 năm, hỗ trợ giao lắp tận nhà.',
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=85',
  };

  const title = `${product.name} — Chính Hãng, Trả Góp 0%`;
  const description = product.shortDescription;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: product.imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product;
  try {
    product = await getCatalogProduct(slug);
  } catch (error) {
    if (FALLBACK_DETAILS[slug]) {
      product = FALLBACK_DETAILS[slug];
    } else if (FALLBACK_DETAILS['may-chay-bo-dctd-pro-x1']) {
      // Dynamic fallback for other demo slugs
      product = {
        ...FALLBACK_DETAILS['may-chay-bo-dctd-pro-x1'],
        slug,
        name: slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      };
    } else {
      if (error instanceof ApiError && error.status === 404) notFound();
      throw error;
    }
  }

  const TECH_SPECS = product.techSpecs ?? [
    { label: 'Thương hiệu', value: product.brand ?? 'DCTD Pro Series' },
    { label: 'Phân loại', value: product.primaryCategory ?? 'Thiết bị thể hình & Home Gym chuyên nghiệp' },
    { label: 'Quy cách khung thép', value: 'Thép hộp cường lực Q235 (độ dày 2.5mm - 3.0mm), sơn tĩnh điện sần' },
    { label: 'Tải trọng chịu lực', value: 'Tối đa 500 KG (Thử nghiệm quá tải chu kỳ 100.000 lần)' },
    { label: 'Kích thước lắp đặt', value: '1450 x 1200 x 2150 mm (Diện tích sàn an toàn tối thiểu 6m²)' },
    { label: 'Vật liệu đệm & tay cầm', value: 'Đệm PU mật độ cao 60mm bọc da Carbon + Tay cầm khía vân Diamond Knurl' },
    { label: 'Tiêu chuẩn kiểm định', value: 'Đạt chứng nhận an toàn thiết bị thể thao Châu Âu CE & EN957' },
    { label: 'Chính sách bảo hành', value: '60 tháng khung thép, 24 tháng linh kiện, 1 đổi 1 trong 7 ngày' },
  ];

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl,
    description: product.shortDescription,
    sku: product.productNo || product.slug,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'DCTD Sport',
    },
    offers: {
      '@type': 'Offer',
      url: `https://baoansport.vn/products/${product.slug}`,
      priceCurrency: 'VND',
      price: product.minPrice || '1890000',
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '128',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: 'https://baoansport.vn',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Sản phẩm',
        item: 'https://baoansport.vn/products',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://baoansport.vn/products/${product.slug}`,
      },
    ],
  };

  return (
    <StorefrontLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="bg-slate-50/70 pb-24">
        {/* Breadcrumbs Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mx-auto max-w-7xl px-4 py-4 text-xs font-semibold text-stone-500 sm:px-6 lg:px-8"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-emerald-700">
                Trang chủ
              </Link>
            </li>
            <li>
              <ChevronRight className="size-3 text-stone-400" />
            </li>
            <li>
              <Link href="/#products" className="hover:text-emerald-700">
                Sản phẩm
              </Link>
            </li>
            <li>
              <ChevronRight className="size-3 text-stone-400" />
            </li>
            <li className="font-bold text-ink">{product.name}</li>
          </ol>
        </nav>

        {/* Main Product Stage */}
        <main className="mx-auto grid max-w-7xl gap-10 px-4 py-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          {/* Left Column: Visual Showcase & Technical Detail */}
          <div className="space-y-8">
            {/* 3D Interactive Viewer Stage */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700">
                  <Sparkles className="size-4" />
                  Mô phỏng 3D tương tác đa chiều
                </span>
                <span className="text-xs font-semibold text-stone-500">
                  Xoay 360° · Xem bóc tách linh kiện
                </span>
              </div>
              <Product3DViewer productName={product.name} />
            </div>

            {/* Product Static Gallery Preview Fallback / Secondary Photos */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] border border-stone-200/80 bg-white shadow-sm">
              <Image
                src={product.imageUrl ?? 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=85'}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                Ảnh chụp thực tế tại Showroom
              </div>
            </div>

            {/* Product Story / Description */}
            <div className="rounded-[28px] border border-stone-200/80 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-black text-ink sm:text-2xl">Mô tả sản phẩm</h2>
              <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
                {product.shortDescription ||
                  'Dòng thiết bị tập luyện chuyên nghiệp DCTD Pro Series được thiết kế tối ưu cho các bài tập đa nhóm cơ. Khung kết cấu hợp kim thép cường lực, lớp phủ bề mặt mạ chrome và bọc cao su kỹ thuật giúp chống ăn mòn và giảm thiểu tiếng ồn va đập.'}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-stone-50 p-4">
                  <Flame className="size-5 text-emerald-600" />
                  <strong className="mt-2 block text-sm font-bold text-ink">Thiết kế công thái học</strong>
                  <p className="mt-1 text-xs text-stone-500">Tay cầm tiện dụng, hạn chế mỏi cổ tay khi nâng tạ nặng.</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-4">
                  <ShieldCheck className="size-5 text-emerald-600" />
                  <strong className="mt-2 block text-sm font-bold text-ink">Bọc cao su đúc</strong>
                  <p className="mt-1 text-xs text-stone-500">Bảo vệ bề mặt sàn gỗ, gạch hoa và chống nứt vỡ.</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-4">
                  <Award className="size-5 text-emerald-600" />
                  <strong className="mt-2 block text-sm font-bold text-ink">Độ bền công nghiệp</strong>
                  <p className="mt-1 text-xs text-stone-500">Chịu được hơn 100.000 chu kỳ tập luyện liên tục.</p>
                </div>
              </div>
            </div>

            {/* Technical Specifications Table */}
            <div className="rounded-[28px] border border-stone-200/80 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-black text-ink sm:text-2xl">Thông số kỹ thuật chi tiết</h2>
              <div className="mt-6 divide-y divide-stone-100 rounded-2xl border border-stone-100 bg-stone-50/50">
                {TECH_SPECS.map(({ label, value }: { label: string; value: string }) => (
                  <div key={label} className="grid grid-cols-1 gap-1 sm:grid-cols-[1fr_1.3fr] sm:gap-4 px-4 py-3.5 text-xs sm:px-6 sm:text-sm">
                    <span className="font-bold text-stone-500">{label}</span>
                    <span className="font-semibold text-ink">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Rating & Reviews Summary */}
            <ProductReviewSection productName={product.name} productSlug={slug} />
          </div>

          {/* Right Column: Sticky Purchase Panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductPurchasePanel product={product} />
          </div>
        </main>

        {/* Related Products ("Cùng loại"), Flash Sale & Category List */}
        <ProductRelatedSection
          currentSlug={slug}
          currentCategory={product.primaryCategory}
          productName={product.name}
        />
      </div>
    </StorefrontLayout>
  );
}
