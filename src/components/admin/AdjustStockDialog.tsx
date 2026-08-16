"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Minus, Plus, X } from "lucide-react";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Select, type SelectOption } from "@/components/ui/Select";
import { productImageSrc } from "@/config/images";
import { adjustmentReasonLabel } from "@/features/inventory/lib/labels";
import { getStockStatus } from "@/features/inventory/lib/stock";
import { inventoryAdjustmentInputSchema } from "@/schemas/inventory";
import type { InventoryLine } from "@/features/admin/lib/mock-inventory";
import type {
  InventoryAdjustmentReason,
  StockStatus,
} from "@/types/inventory";
import { cn } from "@/lib/utils";

interface AdjustStockDialogProps {
  /** The line being adjusted, or null when the dialog is closed. */
  line: InventoryLine | null;
  onClose: () => void;
  onApply: (input: {
    quantityChange: number;
    reason: InventoryAdjustmentReason;
    note?: string;
  }) => void;
}

const reasonOptions: Record<
  "add" | "remove",
  SelectOption<InventoryAdjustmentReason>[]
> = {
  add: [
    {
      value: "restock",
      label: adjustmentReasonLabel.restock,
      description: "New batch received from the mill",
    },
    {
      value: "correction",
      label: adjustmentReasonLabel.correction,
      description: "Fixing a miscount",
    },
  ],
  remove: [
    {
      value: "sale",
      label: adjustmentReasonLabel.sale,
      description: "Sold outside a WhatsApp order",
    },
    {
      value: "damage",
      label: adjustmentReasonLabel.damage,
      description: "Spoiled, spilled or written off",
    },
    {
      value: "correction",
      label: adjustmentReasonLabel.correction,
      description: "Fixing a miscount",
    },
  ],
};

const QUICK_AMOUNTS = [5, 10, 25, 50];

const statusStyle: Record<StockStatus, { pill: string; dot: string; label: string }> =
  {
    "in-stock": {
      pill: "bg-saumya/10 text-saumya",
      dot: "bg-saumya",
      label: "In stock",
    },
    "low-stock": {
      pill: "bg-gold/12 text-achaari",
      dot: "bg-gold",
      label: "Low",
    },
    "out-of-stock": { pill: "bg-red/10 text-red", dot: "bg-red", label: "Out" },
  };

/**
 * Uses the native <dialog> element so focus trapping, Escape-to-close,
 * inertness of the page behind and the backdrop all come from the
 * platform rather than being hand-rolled.
 */
export function AdjustStockDialog({
  line,
  onClose,
  onApply,
}: AdjustStockDialogProps) {
  // Held in state, not a ref: the dropdown below needs this node as its
  // portal container *during render*, and a ref would still be null on
  // the first pass — Radix would then portal to <body>, which renders
  // behind the dialog's top layer.
  const [dialogEl, setDialogEl] = useState<HTMLDialogElement | null>(null);

  useEffect(() => {
    const el = dialogEl;
    if (!el) return;
    if (line && !el.open) {
      el.showModal();
      // Must run *after* showModal: its own focusing steps look for a real
      // `autofocus` attribute, which React's `autoFocus` prop never
      // renders — so without this the close button takes focus instead of
      // the field you came to fill in.
      const field = el.querySelector<HTMLInputElement>("[data-autofocus]");
      field?.focus();
      field?.select();
    }
    if (!line && el.open) el.close();
  }, [line, dialogEl]);

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
      // margin to 0 on every element — without it the dialog pins to the
      // top-left corner of the viewport.
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg bg-surface p-0 text-foreground backdrop:bg-foreground/40 backdrop:backdrop-blur-[2px] sm:w-full"
    >
      {/* Keyed remount gives each SKU a fresh form without resetting
          state from an effect. */}
      {line ? (
        <AdjustStockForm
          key={line.sku}
          line={line}
          dialogEl={dialogEl}
          onClose={onClose}
          onApply={onApply}
        />
      ) : null}
    </dialog>
  );
}

function AdjustStockForm({
  line,
  dialogEl,
  onClose,
  onApply,
}: {
  line: InventoryLine;
  dialogEl: HTMLDialogElement | null;
  onClose: () => void;
  onApply: AdjustStockDialogProps["onApply"];
}) {
  const [direction, setDirection] = useState<"add" | "remove">("add");
  const [quantity, setQuantity] = useState(10);
  const [reason, setReason] = useState<InventoryAdjustmentReason>("restock");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const quantityChange = direction === "add" ? quantity : -quantity;
  const resultingStock = line.stockQuantity + quantityChange;
  const currentStatus = statusStyle[line.status];
  const nextStatus = statusStyle[getStockStatus(Math.max(0, resultingStock))];
  const overRemoving = resultingStock < 0;

  const setDirectionAndReason = (next: "add" | "remove") => {
    setDirection(next);
    // Reasons are directional — "Restock" makes no sense on a removal.
    setReason(next === "add" ? "restock" : "sale");
    setError(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Validated against the same schema the server action will use, so
    // the UI can't produce a shape the domain would reject.
    const parsed = inventoryAdjustmentInputSchema.safeParse({
      variantId: line.sku,
      quantityChange,
      reason,
      note: note.trim() || undefined,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid adjustment.");
      return;
    }

    // Not expressible in the schema — it depends on current stock, which
    // the schema has no view of.
    if (overRemoving) {
      setError(
        `Only ${line.stockQuantity} units on hand — cannot remove ${quantity}.`,
      );
      return;
    }

    onApply({
      quantityChange: parsed.data.quantityChange,
      reason: parsed.data.reason,
      note: parsed.data.note,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <header className="flex items-start gap-3 px-5 pt-5 pb-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-background">
          <Image
            src={productImageSrc(line.image)}
            alt=""
            fill
            sizes="48px"
            className="object-contain p-1"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold tracking-tight text-foreground">
            {line.productName}
          </h2>
          <p className="mt-0.5 truncate text-xs text-muted">
            {line.variantLabel} · {line.sku}
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
        {/* Before → after, so the outcome is visible without doing the
            arithmetic in your head. */}
        <div className="flex items-center gap-3 rounded-md bg-background px-4 py-3">
          <div className="min-w-0">
            <p className="text-[11px] tracking-wide text-muted uppercase">
              On hand
            </p>
            <p className="mt-1 flex items-center gap-2">
              <span className="text-lg font-semibold tabular-nums text-foreground">
                {line.stockQuantity}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                  currentStatus.pill,
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn("h-1.5 w-1.5 rounded-full", currentStatus.dot)}
                />
                {currentStatus.label}
              </span>
            </p>
          </div>

          <ArrowRight
            className="mx-auto h-4 w-4 shrink-0 text-muted/60"
            aria-hidden="true"
          />

          <div className="min-w-0 text-right">
            <p className="text-[11px] tracking-wide text-muted uppercase">
              After
            </p>
            <p className="mt-1 flex items-center justify-end gap-2">
              <span
                className={cn(
                  "text-lg font-semibold tabular-nums",
                  overRemoving ? "text-red" : "text-foreground",
                )}
              >
                {Math.max(0, resultingStock)}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                  nextStatus.pill,
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn("h-1.5 w-1.5 rounded-full", nextStatus.dot)}
                />
                {nextStatus.label}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-foreground">Movement</span>

          <div className="grid grid-cols-2 gap-1 rounded-md bg-background p-1">
            {(
              [
                ["add", Plus, "Add"],
                ["remove", Minus, "Remove"],
              ] as const
            ).map(([value, Icon, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setDirectionAndReason(value)}
                aria-pressed={direction === value}
                className={cn(
                  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-sm px-3 py-2 text-xs font-medium",
                  "transition-colors duration-[var(--duration-fast)]",
                  direction === value
                    ? value === "add"
                      ? "bg-saumya/12 text-saumya"
                      : "bg-red/10 text-red"
                    : "text-muted hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-foreground">Quantity</span>
          <div className="flex flex-wrap items-center gap-3">
            <QuantityStepper
              value={quantity}
              onChange={(next) => {
                setQuantity(next);
                setError(null);
              }}
              label="Quantity"
              inputProps={{ "data-autofocus": "" } as Record<string, string>}
            />
            <div className="flex flex-wrap gap-1">
              {QUICK_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setQuantity(amount);
                    setError(null);
                  }}
                  className={cn(
                    "cursor-pointer rounded-md px-2 py-1 text-xs font-medium tabular-nums",
                    "transition-colors duration-[var(--duration-fast)]",
                    quantity === amount
                      ? "bg-green/10 text-green-dark"
                      : "text-muted hover:bg-background hover:text-green",
                  )}
                >
                  {direction === "add" ? "+" : "−"}
                  {amount}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-foreground">Reason</span>
          <Select
            value={reason}
            onValueChange={setReason}
            options={reasonOptions[direction]}
            label="Adjustment reason"
            // Portalled into the dialog, not <body> — see Select's note.
            container={dialogEl}
          />
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium text-foreground">
            Note <span className="font-normal text-muted">(optional)</span>
          </span>
          <input
            type="text"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="e.g. New batch from the mill"
            className="h-10 rounded-md bg-background px-3 text-sm text-foreground placeholder:text-muted/70 focus:outline-none"
          />
        </label>

        {error ? (
          <p role="alert" className="text-xs text-red">
            {error}
          </p>
        ) : null}

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary h-10 px-4 text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={overRemoving}
            className="btn btn-primary h-10 px-4 text-xs disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save adjustment
          </button>
        </div>
      </div>
    </form>
  );
}
