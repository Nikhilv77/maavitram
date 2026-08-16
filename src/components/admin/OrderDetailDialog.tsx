"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, MapPin, MessageCircle, Phone, StickyNote, X } from "lucide-react";
import { orderStatusStyle } from "@/components/admin/order-status";
import { productImageSrc } from "@/config/images";
import { accentRailClass } from "@/features/admin/lib/accents";
import { formatPrice } from "@/features/products/lib/pricing";
import { formatPhoneNumber, phoneHref } from "@/features/orders/lib/format";
import {
  allowedTransitions,
  orderStatusLabel,
} from "@/features/orders/lib/status";
import { buildWhatsAppLink } from "@/features/whatsapp/lib/link";
import type { AdminOrder } from "@/features/admin/lib/mock-orders";
import type { OrderStatus } from "@/types/order";
import { cn } from "@/lib/utils";

interface OrderDetailDialogProps {
  /** The order being viewed, or null when the dialog is closed. */
  order: AdminOrder | null;
  onClose: () => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}

/** Wording for each move, so the button says what it does. */
const transitionLabel: Record<OrderStatus, string> = {
  pending: "Reopen",
  confirmed: "Mark confirmed",
  fulfilled: "Mark fulfilled",
  cancelled: "Cancel order",
};

export function OrderDetailDialog({
  order,
  onClose,
  onStatusChange,
}: OrderDetailDialogProps) {
  // Held in state rather than a ref so the effect below re-runs once the
  // node exists — same reasoning as the stock dialog.
  const [dialogEl, setDialogEl] = useState<HTMLDialogElement | null>(null);

  useEffect(() => {
    const el = dialogEl;
    if (!el) return;
    if (order && !el.open) el.showModal();
    if (!order && el.open) el.close();
  }, [order, dialogEl]);

  return (
    <dialog
      ref={setDialogEl}
      onClose={onClose}
      // Clicking the backdrop lands on the <dialog> itself, never on the
      // inner panel — that's what distinguishes an outside click here.
      onClick={(event) => {
        if (event.target === dialogEl) onClose();
      }}
      // `m-auto` is load-bearing: the UA stylesheet centres a modal
      // <dialog> with `margin: auto`, and Tailwind's preflight resets
      // margin to 0 on every element.
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-lg bg-surface p-0 text-foreground backdrop:bg-foreground/40 backdrop:backdrop-blur-[2px] sm:w-full"
    >
      {order ? (
        <OrderDetail
          key={order.id}
          order={order}
          onClose={onClose}
          onStatusChange={onStatusChange}
        />
      ) : null}
    </dialog>
  );
}

function OrderDetail({
  order,
  onClose,
  onStatusChange,
}: {
  order: AdminOrder;
  onClose: () => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}) {
  const status = orderStatusStyle[order.status];
  const moves = allowedTransitions[order.status];
  const firstName = order.customerName.split(" ")[0];

  const whatsAppHref = buildWhatsAppLink(
    `Hi ${firstName}, this is Maavitram about your order ${order.id} — ${order.itemSummary} (${formatPrice(order.totalAmount)}).`,
    // The mock stores bare 10-digit numbers; wa.me needs the country code.
    `91${order.customerPhone}`,
  );

  return (
    <div className="flex flex-col">
      <header className="flex items-start gap-3 px-5 pt-5 pb-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              {order.id}
            </h2>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                status.pill,
              )}
            >
              <span
                aria-hidden="true"
                className={cn("h-1.5 w-1.5 rounded-full", status.dot)}
              />
              {orderStatusLabel[order.status]}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">
            Placed {order.placedAt} · {order.itemCount} items
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted transition-colors duration-[var(--duration-fast)] hover:bg-background hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="flex flex-col gap-5 px-5 pb-5">
        <section className="rounded-md bg-background px-4 py-3">
          <p className="text-sm font-medium text-foreground">
            {order.customerName}
          </p>
          <div className="mt-2 flex flex-col gap-1.5">
            <a
              href={phoneHref(order.customerPhone)}
              className="inline-flex w-fit items-center gap-1.5 text-xs text-muted transition-colors duration-[var(--duration-fast)] hover:text-green"
            >
              <Phone className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span className="tabular-nums">
                {formatPhoneNumber(order.customerPhone)}
              </span>
            </a>
            {order.address ? (
              <p className="flex items-start gap-1.5 text-xs text-muted">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                {order.address}
              </p>
            ) : null}
            {order.notes ? (
              <p className="flex items-start gap-1.5 text-xs text-muted italic">
                <StickyNote
                  className="mt-0.5 h-3 w-3 shrink-0"
                  aria-hidden="true"
                />
                {order.notes}
              </p>
            ) : null}
          </div>

          {/* Orders arrive over WhatsApp, so replying there is the natural
              follow-up — prefilled with the order reference. */}
          <a
            href={whatsAppHref}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-green/10 px-2.5 py-1.5 text-xs font-medium text-green-dark transition-colors duration-[var(--duration-fast)] hover:bg-green/15"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Message on WhatsApp
          </a>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-xs font-medium text-foreground">Items</h3>
          <ul className="flex flex-col">
            {order.items.map((item) => (
              <li
                key={item.sku}
                className="flex items-center gap-3 border-t border-border/50 py-2.5 first:border-t-0 first:pt-0"
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-background">
                  <Image
                    src={productImageSrc(item.image)}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-contain p-1"
                  />
                </div>
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-8 w-1 shrink-0 rounded-full",
                    accentRailClass[item.accent],
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{item.productName}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {item.variantLabel} · {item.sku} ·{" "}
                    {formatPrice(item.unitPrice)} each
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium tabular-nums text-foreground">
                    {formatPrice(item.lineTotal)}
                  </p>
                  <p className="mt-0.5 text-xs tabular-nums text-muted">
                    × {item.quantity}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-1 flex items-center justify-between rounded-md bg-background px-4 py-3">
            <span className="text-xs tracking-wide text-muted uppercase">
              Total
            </span>
            <span className="text-lg font-semibold tabular-nums text-foreground">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {moves.length === 0 ? (
            <p className="mr-auto inline-flex items-center gap-1.5 text-xs text-muted">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              This order is closed.
            </p>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary h-10 px-4 text-xs"
          >
            Close
          </button>

          {moves.map((next) => (
            <button
              key={next}
              type="button"
              onClick={() => onStatusChange(order.id, next)}
              className={cn(
                "btn h-10 px-4 text-xs",
                next === "cancelled"
                  ? "btn-secondary text-red hover:border-red hover:bg-red/5"
                  : "btn-primary",
              )}
            >
              {transitionLabel[next]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
