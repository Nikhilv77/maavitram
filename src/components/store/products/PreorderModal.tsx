"use client";

import Image from "next/image";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Loader2, PartyPopper, X, ArrowRight } from "lucide-react";
import { LeafPattern } from "@/components/ui/LeafPattern";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { productImageSrc } from "@/config/images";
import {
  submitPreorder,
  type PreorderActionState,
} from "@/features/orders/lib/actions";
import type { CatalogueVariant } from "@/features/products/lib/queries";
import { MAX_PREORDER_QUANTITY } from "@/schemas/order";
import { cn } from "@/lib/utils";

export interface PreorderProduct {
  name: string;
  flavor: string;
  accent: string;
  image: { src: string; alt: string; width: number; height: number };
}

interface PreorderModalProps {
  product: PreorderProduct;
  /** Real variants for this product, empty if it isn't in the catalogue. */
  variants: CatalogueVariant[];
  onClose: () => void;
}

const initialState: PreorderActionState = {};

const fieldClass =
  "h-11 w-full rounded-md border border-black/[0.10] bg-white px-3 text-sm text-foreground placeholder:text-muted/60 transition-colors duration-[var(--duration-fast)] outline-none hover:border-black/[0.18] focus:border-green/45 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0";

export function PreorderModal({
  product,
  variants,
  onClose,
}: PreorderModalProps) {
  const [state, formAction, pending] = useActionState(
    submitPreorder,
    initialState,
  );
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const panelRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const patternId = useId();

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const focusables = () =>
      [
        ...panel.querySelectorAll<HTMLElement>(
          "button:not([disabled]), input:not([disabled]), select, textarea, a[href]",
        ),
      ].filter((el) => el.offsetParent !== null);

    focusables()[0]?.focus();

    // Escape is deliberately NOT handled here — ProductModalProvider owns
    // it for the whole stack. Handling it in both places closed two
    // layers on one keypress: keydown is a discrete event, so React
    // flushes this modal's close synchronously before the event finishes
    // bubbling, and the provider's listener then saw an already-empty
    // preorder state and closed the details sheet underneath as well.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const items = focusables();
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener("keydown", onKeyDown);

    return () => {
      panel.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, state.reserved]);

  // Rendered into <body> so the sheet can't be clipped or re-stacked by
  // an ancestor — a `transform`, `filter` or `overflow: hidden` anywhere
  // up the storefront tree traps a `position: fixed` overlay inside it.
  // A `typeof document` guard rather than a mounted flag: the modal only
  // mounts from a click, so `document` exists by then, and this avoids a
  // setState-in-effect round trip just to render nothing on the server.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="presentation"
      className="animate-fade-in fixed inset-0 z-[90] flex items-end justify-center bg-black/30 p-3 backdrop-blur-[3px] sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
    >
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="animate-modal-in scrollbar-none relative max-h-[92vh] w-full max-w-[46rem] overflow-y-auto rounded-xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.16)]"
      >
        {/* Close */}
        <button
          type="button"
          aria-label="Close preorder form"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 cursor-pointer items-center justify-center text-foreground/45 transition-colors duration-[var(--duration-fast)] hover:text-green"
        >
          <X className="h-4.5 w-4.5" aria-hidden="true" />
        </button>

        {/* Product Visual */}
        <div
          className="relative flex h-[15rem] items-end justify-center overflow-hidden rounded-t-xl sm:h-[18rem]"
          style={{
            background:
              "radial-gradient(circle at 50% 95%, color-mix(in srgb, var(--product-accent) 9%, transparent), transparent 56%), #fffefa",
            ["--product-accent" as string]: product.accent,
          }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <LeafPattern id={`preorder-leaves-${patternId}`} />
          </div>

          <Image
            src={productImageSrc(product.image.src)}
            alt={product.image.alt}
            width={product.image.width}
            height={product.image.height}
            sizes="(min-width: 640px) 32rem, 80vw"
            className="relative z-10 h-auto max-h-[14rem] w-auto object-contain drop-shadow-[0_16px_24px_rgba(31,39,29,0.10)] sm:max-h-[17rem]"
          />
        </div>

        {state.reserved ? (
          <SuccessState product={product} onClose={onClose} />
        ) : (
          <div className="bg-white px-6 py-7 sm:px-9 sm:py-9">
            {/* Intro */}
            <div>
              <span
                className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-white uppercase"
                style={{ backgroundColor: product.accent }}
              >
                Preorder
              </span>

              <h3
                id={titleId}
                className="mt-4 max-w-xl font-serif text-3xl leading-[1.08] font-semibold text-foreground sm:text-4xl"
              >
                We&rsquo;re getting your Maavitram blend ready with care.
              </h3>

              <p className="mt-4 max-w-xl text-sm leading-7 text-foreground/58 sm:text-[15px]">
                Our first batches are being prepared, and we&rsquo;d love to
                reserve yours. Preorder now and we&rsquo;ll personally reach out
                with availability and next steps.
              </p>
            </div>

            <div className="my-7 h-px bg-black/[0.06]" />

            {variants.length === 0 ? (
              <div className="rounded-xl bg-gold/[0.07] px-4 py-4">
                <p className="text-sm leading-6 text-achaari">
                  This blend isn&rsquo;t open for reservations yet. Please check
                  back shortly.
                </p>
              </div>
            ) : (
              <form action={formAction} className="space-y-6">
                <input type="hidden" name="variantId" value={variantId} />
                <input type="hidden" name="quantity" value={quantity} />

                {/* Product Summary */}
                <div className="rounded-xl bg-[#fffefa] p-5">
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-muted">{product.flavor}</p>
                  </div>

                  {/* Variant */}
                  <fieldset className="mt-5">
                    <legend className="text-[10px] font-semibold tracking-[0.18em] text-foreground/45 uppercase">
                      How much quantity do you want?
                    </legend>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {variants.map((variant) => (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setVariantId(variant.id)}
                          aria-pressed={variant.id === variantId}
                          className={cn(
                            "cursor-pointer rounded-lg px-4 py-2.5 text-xs font-medium",
                            "transition-colors duration-[var(--duration-fast)]",
                            variant.id === variantId
                              ? "bg-green/[0.10] text-green-dark"
                              : "bg-white text-foreground/60 hover:text-green",
                          )}
                        >
                          {variant.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  {/* Quantity */}
                  <div className="mt-5">
                    <p className="mb-3 text-[10px] font-semibold tracking-[0.18em] text-foreground/45 uppercase">
                      Number of packs
                    </p>
                    <QuantityStepper
                      value={quantity}
                      onChange={setQuantity}
                      min={1}
                      max={MAX_PREORDER_QUANTITY}
                      label="Quantity"
                      className="bg-white"
                    />

                    {state.fieldErrors?.quantity ? (
                      <p className="mt-2 text-xs text-red">
                        {state.fieldErrors.quantity}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Customer Details */}
                <div>
                  <div className="mb-4">
                    <p className="text-[10px] font-semibold tracking-[0.18em] text-foreground/45 uppercase">
                      Your Details
                    </p>

                    <p className="mt-1 text-sm text-muted">
                      We&rsquo;ll use these details only to contact you about
                      your reservation.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Field
                      name="name"
                      label="Name"
                      placeholder="Your full name"
                      autoComplete="name"
                      error={state.fieldErrors?.name}
                      required
                    />

                    <Field
                      name="phone"
                      label="Phone / WhatsApp"
                      type="tel"
                      inputMode="numeric"
                      placeholder="10-digit mobile number"
                      autoComplete="tel"
                      error={state.fieldErrors?.phone}
                      required
                    />

                    <Field
                      name="email"
                      label="Email"
                      optional
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      error={state.fieldErrors?.email}
                    />
                  </div>
                </div>

                {state.error ? (
                  <p
                    role="alert"
                    className="rounded-lg bg-red/[0.06] px-4 py-3 text-sm text-red"
                  >
                    {state.error}
                  </p>
                ) : null}

                {/* CTA */}
                <div>
                  <button
                    type="submit"
                    disabled={pending}
                    className="btn btn-primary flex min-h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pending ? (
                      <>
                        <Loader2
                          className="h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                        Reserving…
                      </>
                    ) : (
                      <>
                        Reserve My Pack
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </button>

                  <p className="mt-3 text-center text-xs leading-5 text-foreground/42">
                    No payment now — we&rsquo;ll confirm availability with you
                    personally before anything moves forward.
                  </p>
                </div>
              </form>
            )}
          </div>
        )}
      </section>
    </div>,
    document.body,
  );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  optional?: boolean;
  error?: string;
}

function Field({ name, label, optional, error, ...props }: FieldProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-foreground">
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-muted">(optional)</span>
        ) : null}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        className={fieldClass}
        {...props}
      />
      {error ? <p className="text-xs text-red">{error}</p> : null}
    </div>
  );
}

function SuccessState({
  product,
  onClose,
}: {
  product: PreorderProduct;
  onClose: () => void;
}) {
  return (
    <div className="animate-rise-in flex flex-col items-center px-5 py-9 text-center sm:px-7">
      <span
        className="inline-flex h-14 w-14 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: product.accent }}
      >
        <PartyPopper className="h-6 w-6" aria-hidden="true" />
      </span>

      <h3 className="mt-4 font-serif text-2xl leading-tight font-semibold text-balance text-foreground sm:text-3xl">
        You&rsquo;re on the list!
      </h3>
      <p className="mt-3 max-w-sm text-sm leading-6 text-pretty text-muted">
        We&rsquo;ll contact you as soon as your Maavitram pack is ready.
      </p>

      <ul className="mt-5 flex flex-col gap-2 text-left">
        {[
          "Your reservation is saved against this batch",
          "We'll reach out on WhatsApp with availability",
          "No payment until you confirm",
        ].map((line) => (
          <li
            key={line}
            className="flex items-center gap-2.5 text-sm text-foreground/75"
          >
            <span
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: product.accent }}
            >
              <Check className="h-3 w-3" aria-hidden="true" />
            </span>
            {line}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onClose}
        className="btn mt-7 min-h-11 w-full rounded-md border border-green/35 bg-transparent text-sm text-green/80 outline-none ring-0 hover:border-green/35 hover:bg-transparent hover:text-green/80 hover:outline-none hover:ring-0 focus:border-green/35 focus:text-green/80 focus:outline-none focus:ring-0 focus-visible:border-green/35 focus-visible:outline-none focus-visible:ring-0 sm:w-auto sm:min-w-48"
      >
        Continue browsing
      </button>
    </div>
  );
}
