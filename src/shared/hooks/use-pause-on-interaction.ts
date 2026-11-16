'use client';

import { useState, type FocusEvent, type PointerEvent } from 'react';

/**
 * Tạm dừng vòng tự chạy khi người dùng thật sự đang tương tác: rê chuột (chỉ chuột — chạm trên mobile
 * không để lại trạng thái "đang hover" làm slider đứng mãi) hoặc focus bàn phím (`:focus-visible`;
 * bấm nút mũi tên bằng chuột/chạm giữ focus nhưng không được coi là đang đọc bằng bàn phím).
 * Spread `handlers` lên phần tử bao slider.
 */
export function usePauseOnInteraction() {
  const [hovering, setHovering] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);

  const handlers = {
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType === 'mouse') setHovering(true);
    },
    onPointerLeave: () => setHovering(false),
    onFocus: (event: FocusEvent) => {
      if ((event.target as HTMLElement).matches(':focus-visible')) setKeyboardFocus(true);
    },
    onBlur: (event: FocusEvent) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setKeyboardFocus(false);
    },
  };

  return { paused: hovering || keyboardFocus, handlers };
}
