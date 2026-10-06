'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ImageOff, Package, ShoppingCart, Ticket, Truck } from 'lucide-react';
import { SUPPORT_ROUTES, SupportTicketStatusBadge, type SupportTicketStatus } from '@/features/support';
import { formatDateTime } from '@/shared/format/date-time';
import { formatVnd } from '@/shared/format/money';
import { DescriptionList } from '@/foundation/components/structure';
import { useAssistantQuickAdd } from '../hooks/use-assistant-quick-add';
import { ASSISTANT_COPY } from '../model/assistant.constants';
import type { AssistantCardView, AssistantOrderCardView, AssistantProductCardView } from '../model/assistant.types';

/** INVARIANT (D75): chỉ "Còn hàng"/"Hết hàng"; `null` (API không nói) thì không gắn nhãn nào. */
function StockBadge({ inStock }: { inStock: boolean | null }) {
  if (inStock === null) return null;
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${inStock ? 'bg-success-50 text-success-700' : 'bg-slate-100 text-slate-600'}`}>
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
    <article className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        {card.imageUrl ? (
          <Image src={card.imageUrl} alt={card.name} fill sizes="64px" className="object-cover" />
        ) : (
          <div className="grid size-full place-items-center text-slate-400"><ImageOff className="size-5" aria-hidden /></div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="line-clamp-2 text-xs font-bold text-slate-900">{card.name}</h4>
        {card.brand && <p className="text-[11px] text-slate-500">{card.brand}</p>}
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
          {card.price !== null && (
            <strong className="text-brand-700">
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
            className="inline-flex min-h-9 items-center rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:border-brand-300 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {ASSISTANT_COPY.viewProduct}
          </Link>
          {card.quickAdd && (
            <button
              type="button"
              onClick={() => quickAdd.add(card)}
              className="inline-flex min-h-9 items-center gap-1 rounded-lg bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-brand-700 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              aria-label={`${ASSISTANT_COPY.addToCart}: ${card.name}`}
            >
              <ShoppingCart className="size-3.5" aria-hidden />
              {ASSISTANT_COPY.addToCart}
            </button>
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
      className="block rounded-2xl border border-slate-200 bg-white p-3 text-xs hover:border-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-mono font-black text-brand-700">
          <Package className="size-3.5" aria-hidden />
          {card.orderNo}
        </span>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">{card.statusLabel}</span>
      </div>
      <DescriptionList
        columns={2}
        className="mt-2 gap-1 text-[11px] text-slate-600"
        valueClassName="text-slate-600"
        items={[
          { label: 'Thanh toán', value: card.paymentStatusLabel },
          { label: 'Giao hàng', value: card.fulfillmentStatusLabel },
          { label: 'Đặt lúc', value: formatDateTime(card.placedAt) },
          {
            label: 'Tổng tiền',
            value: card.grandTotal !== null ? formatVnd(card.grandTotal) : null,
            valueClassName: 'text-brand-700',
            visible: card.grandTotal !== null,
          },
        ]}
      />
      {card.shipmentLabel && (
        <p className="mt-2 flex items-center gap-1.5 text-slate-600">
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
      className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-xs hover:border-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <span className="flex items-center gap-1.5 font-mono font-black text-brand-700">
        <Ticket className="size-3.5" aria-hidden />
        {card.ticketNo}
      </span>
      {card.status ? (
        <SupportTicketStatusBadge status={card.status} className="!px-2 !py-0.5 !text-[10px]" />
      ) : (
        card.statusCode && <span className="text-[10px] font-bold text-slate-500">{card.statusCode}</span>
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
