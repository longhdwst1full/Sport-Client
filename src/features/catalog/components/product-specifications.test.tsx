// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ProductSpecifications } from './product-specifications';

afterEach(() => {
  cleanup();
});

describe('ProductSpecifications Component', () => {
  const mockSpecs = [
    { label: 'Thương hiệu', value: 'Bảo An Sport' },
    { label: 'Phân loại', value: 'Máy chạy bộ' },
    { label: 'Mã sản phẩm', value: 'BA-TREAD-01' },
    { label: 'Công suất động cơ', value: '3.5 HP' },
    { label: 'Tải trọng tối đa', value: '150 kg' },
    { label: 'Tốc độ tối đa', value: '18 km/h' },
    { label: 'Độ dốc tự động', value: '0 - 15%' },
    { label: 'Bảo hành', value: '24 tháng' },
  ];

  it('không render gì nếu danh sách rỗng', () => {
    const { container } = render(<ProductSpecifications specs={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('hiển thị 5 mục ban đầu khi số thông số > 5 và có nút Xem thêm', () => {
    render(<ProductSpecifications specs={mockSpecs} initialLimit={5} />);

    expect(screen.getByText('Thông số kỹ thuật chi tiết')).toBeDefined();
    expect(screen.getByText('8 thông số')).toBeDefined();

    // 5 mục đầu hiển thị
    expect(screen.getByText('Thương hiệu')).toBeDefined();
    expect(screen.getByText('Tải trọng tối đa')).toBeDefined();

    // Mục thứ 6 chưa hiển thị
    expect(screen.queryByText('Tốc độ tối đa')).toBeNull();

    // Nút xem thêm với số lượng còn lại
    const expandBtn = screen.getByRole('button', { name: /Xem thêm thông số/i });
    expect(expandBtn).toBeDefined();
    expect(expandBtn.textContent).toContain('3 mục');
  });

  it('bấm Xem thêm mở rộng toàn bộ và bấm Thu gọn thì thu lại', () => {
    render(<ProductSpecifications specs={mockSpecs} initialLimit={5} />);

    const expandBtn = screen.getByRole('button', { name: /Xem thêm thông số/i });
    fireEvent.click(expandBtn);

    // Toàn bộ 8 mục hiển thị
    expect(screen.getByText('Tốc độ tối đa')).toBeDefined();
    expect(screen.getByText('Bảo hành')).toBeDefined();

    // Nút đổi thành Thu gọn
    const collapseBtn = screen.getByRole('button', { name: /Thu gọn thông số/i });
    expect(collapseBtn).toBeDefined();

    // Bấm thu gọn
    fireEvent.click(collapseBtn);
    expect(screen.queryByText('Tốc độ tối đa')).toBeNull();
    expect(screen.getByRole('button', { name: /Xem thêm thông số/i })).toBeDefined();
  });

  it('không hiển thị nút xem thêm nếu số lượng thông số <= limit', () => {
    const fewSpecs = mockSpecs.slice(0, 4);
    render(<ProductSpecifications specs={fewSpecs} initialLimit={5} />);

    expect(screen.getByText('4 thông số')).toBeDefined();
    expect(screen.queryByRole('button', { name: /Xem thêm/i })).toBeNull();
  });
});
