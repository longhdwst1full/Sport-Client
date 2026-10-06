import { StateBlock, type StateBlockProps } from './state-block';

/** Khối lỗi (tải thất bại / không có quyền); mặc định `section` + `h1` vì thường thay cả trang. */
export function ErrorState({ as = 'section', titleAs = 'h1', ...props }: StateBlockProps) {
  return <StateBlock tone="error" as={as} titleAs={titleAs} {...props} />;
}
