/** Bỏ dấu tiếng Việt + chữ thường để "ha noi" khớp "Hà Nội", "dong da" khớp "Đống Đa". */
export function foldVietnamese(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export interface ComboboxOption {
  value: string;
  label: string;
}

interface IndexedOption extends ComboboxOption {
  folded: string;
  initials: string;
}

export function indexOptions(options: readonly ComboboxOption[]): IndexedOption[] {
  return options.map((option) => {
    const folded = foldVietnamese(option.label);
    return { ...option, folded, initials: folded.split(' ').map((word) => word[0]).join('') };
  });
}

/**
 * Lọc không dấu, khớp cả chữ viết tắt ("hcm" → "TP. Hồ Chí Minh", "bd" → "Bình Dương").
 * Mục bắt đầu bằng từ khoá hoặc có một từ bắt đầu bằng từ khoá xếp trước.
 */
export function filterOptions<T extends IndexedOption>(options: readonly T[], query: string): T[] {
  const needle = foldVietnamese(query);
  if (!needle) return [...options];
  const compact = needle.replace(/ /g, '');
  const ranked: Array<{ option: T; rank: number }> = [];
  for (const option of options) {
    let rank = -1;
    if (option.folded.startsWith(needle)) rank = 0;
    else if (` ${option.folded}`.includes(` ${needle}`)) rank = 1;
    else if (option.initials === compact) rank = 1;
    else if (option.initials.includes(compact)) rank = 2;
    else if (option.folded.includes(needle)) rank = 3;
    if (rank >= 0) ranked.push({ option, rank });
  }
  // Cùng hạng thì tên ngắn trước: "q1" → "Quận 1" trước "Quận 12".
  return ranked
    .sort((a, b) => a.rank - b.rank || a.option.folded.length - b.option.folded.length)
    .map(({ option }) => option);
}
