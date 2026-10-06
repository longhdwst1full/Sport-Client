import { StateBlock, type StateBlockProps } from './state-block';

/** Khối "chưa có gì ở đây" — xem `StateBlock`. */
export function EmptyState(props: StateBlockProps) {
  return <StateBlock tone="neutral" {...props} />;
}
