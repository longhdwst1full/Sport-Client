# Storefront React hooks

## RULE-HOOK-01: Không `setState` trong thân `useEffect` (P0)

```tsx
// ❌ render thừa, dễ lệch state
useEffect(() => { setView(toProductCardView(dto)); }, [dto]);

// ✅ derive
const view = useMemo(() => toProductCardView(dto), [dto]);
```

## RULE-HOOK-02: `useEffect` chỉ cho hệ thống ngoài (P0)

Subscription, timer, DOM/browser API, service worker. Mọi effect có đăng ký phải có cleanup.

## RULE-HOOK-03: Không mirror server state vào state cục bộ (P0)

TanStack Query đã sở hữu remote state. Copy `data` sang `useState` là nhân bản cache (`07-state-tools-performance.md`).

## RULE-HOOK-04: Đặt hook đúng tầng (P1)

| Phạm vi | Vị trí |
| --- | --- |
| Chỉ 1 feature, biết DTO | `features/<domain>/hooks/use-*.ts` |
| Trung lập domain | `shared/hooks/use-*.ts` |
| Trình bày thuần | `foundation/hooks/use-*.ts` |

## RULE-HOOK-05: Hook không phải nơi đặt ranh giới client (P1)

Hook dùng Query/Redux buộc file gọi nó thành `'use client'`. Giữ boundary nhỏ nhất (`01-next-rendering.md`).
