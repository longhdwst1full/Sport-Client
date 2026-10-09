'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ImageOff, Package, ShoppingCart, Ticket, Truck } from 'lucide-react';
import { SUPPORT_ROUTES, SupportTicketStatusBadge, type SupportTicketStatus } from '@/features/support';
import { formatDateTime } from '@/shared/format/date-time';
import { formatVnd } from '@/shared/format/money';
import { Button } from '@/foundation/components/buttons';
import { DescriptionList } from '@/foundation/components/structure';
import { useAssistantQuickAdd } from '../hooks/use-assistant-quick-add';
import { ASSISTANT_COPY } from '../model/assistant.constants';
import type { AssistantCardView, AssistantOrderCardView, AssistantProductCardView } from '../model/assistant.types';

/** INVARIANT (D75): chỉ "Còn hàng"/"Hết hàng"; `null` (API không nói) thì không gắn nhãn nào. */
function StockBadge({ inStock }: { inStock: boolean | null }) {
  if (inStock === null) return null;
  return (
    <span className={`rounded-full px-2 py-0.5 text-3xs font-bold ${inStock ? 'bg-success-50 text-success-700' : 'bg-neutral-100 text-neutral-600'}`}>
      {inStock ? ASSISTANT_COPY.inStock : ASSISTANT_COPY.outOfStock}
    </span>
  );
}

function ProductCard({
  card,
  onNavigate,
  quickAdd,
}: {
  card: AssistantProductCardView;
  onNavigate: () => void;
  quickAdd: ReturnType<typeof useAssistantQuickAdd>;
}) {
  return (
    <article className="flex gap-3 rounded-2xl border border-neutral-200 bg-white p-3">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        {card.imageUrl ? (
          <Image src={card.imageUrl} alt={card.name} fill sizes="64px" className="object-cover" />
        ) : (
          <div className="grid size-full place-items-center text-neutral-400"><ImageOff className="size-5" aria-hidden /></div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="line-clamp-2 text-xs font-bold text-neutral-900">{card.name}</h4>
        {card.brand && <p className="text-2xs text-neutral-500">{card.brand}</p>}
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
          {card.price !== null && (
            <strong className="text-neutral-950">
              {card.variants.length > 1 ? 'Từ ' : ''}
              {formatVnd(card.price)}
            </strong>
          )}
          <StockBadge inStock={card.inStock} />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Link
            href={`/products/${encodeURIComponent(card.slug)}`}
            onClick={onNavigate}
            aria-label={`${ASSISTANT_COPY.viewProduct}: ${card.name}`}
            className="inline-flex min-h-9 items-center rounded-lg border border-neutral-200 px-2.5 py-1 text-2xs font-bold text-neutral-700 hover:border-neutral-300 hover:text-neutral-900 focus-ring-tight"
          >
            {ASSISTANT_COPY.viewProduct}
          </Link>
          {card.quickAdd && (
            <Button
              size="sm"
              onClick={() => quickAdd.add(card)}
              className="gap-1 rounded-lg px-2.5 text-2xs font-bold"
              aria-label={`${ASSISTANT_COPY.addToCart}: ${card.name}`}
            >
              <ShoppingCart className="size-3.5" aria-hidden />
              {ASSISTANT_COPY.addToCart}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

function OrderCard({ card, onNavigate }: { card: AssistantOrderCardView; onNavigate: () => void }) {
  return (
    <Link
      href={`/orders/${encodeURIComponent(card.orderNo)}`}
      onClick={onNavigate}
      className="block rounded-2xl border border-neutral-200 bg-white p-3 text-xs hover:border-neutral-300 focus-ring-tight"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-mono font-bold text-neutral-900">
          <Package className="size-3.5" aria-hidden />
          {card.orderNo}
        </span>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-3xs font-bold text-amber-800">{card.statusLabel}</span>
      </div>
      <DescriptionList
        columns={2}
        className="mt-2 gap-1 text-2xs text-neutral-600"
        valueClassName="text-neutral-600"
        items={[
          { label: 'Thanh toán', value: card.paymentStatusLabel },
          { label: 'Giao hàng', value: card.fulfillmentStatusLabel },
          { label: 'Đặt lúc', value: formatDateTime(card.placedAt) },
          {
            label: 'Tổng tiền',
            value: card.grandTotal !== null ? formatVnd(card.grandTotal) : null,
            valueClassName: 'text-neutral-900',
            visible: card.grandTotal !== null,
          },
        ]}
      />
      {card.shipmentLabel && (
        <p className="mt-2 flex items-center gap-1.5 text-neutral-600">
          <Truck className="size-3.5" aria-hidden />
          {card.shipmentLabel}
        </p>
      )}
    </Link>
  );
}

export function AssistantTicketCard({
  card,
  onNavigate,
}: {
  card: { ticketNo: string; status: SupportTicketStatus | null; statusCode?: string };
  onNavigate: () => void;
}) {
  return (
    <Link
      href={SUPPORT_ROUTES.detail(card.ticketNo)}
      onClick={onNavigate}
      className="flex items-center justify-between gap-2 rounded-2xl border border-neutral-200 bg-white p-3 text-xs hover:border-neutral-300 focus-ring-tight"
    >
      <span className="flex items-center gap-1.5 font-mono font-bold text-neutral-900">
        <Ticket className="size-3.5" aria-hidden />
        {card.ticketNo}
      </span>
      {card.status ? (
        <SupportTicketStatusBadge status={card.status} className="!px-2 !py-0.5 !text-3xs" />
      ) : (
        card.statusCode && <span className="text-3xs font-bold text-neutral-500">{card.statusCode}</span>
      )}
    </Link>
  );
}

export function AssistantCardList({ cards, onNavigate }: { cards: AssistantCardView[]; onNavigate: () => void }) {
  const quickAdd = useAssistantQuickAdd();
  return (
    <div className="space-y-2">
      {cards.map((card, index) => {
        switch (card.kind) {
          case 'product':
            return <ProductCard key={`product-${card.slug}-${index}`} card={card} onNavigate={onNavigate} quickAdd={quickAdd} />;
          case 'order':
            return <OrderCard key={`order-${card.orderNo}-${index}`} card={card} onNavigate={onNavigate} />;
          case 'ticket':
            return <AssistantTicketCard key={`ticket-${card.ticketNo}-${index}`} card={card} onNavigate={onNavigate} />;
        }
      })}
    </div>
  );
}
