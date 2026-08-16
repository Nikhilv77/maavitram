"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  /** Optional supporting line shown under the label in the list. */
  description?: string;
}

interface SelectProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  options: SelectOption<T>[];
  /** Accessible name for the trigger. */
  label: string;
  className?: string;
  /**
   * Where the dropdown is portalled. Inside a native modal <dialog> this
   * must be the dialog element — content portalled to <body> renders
   * *behind* the dialog, because the top layer beats normal stacking
   * order no matter what z-index it has.
   */
  container?: HTMLElement | null;
}

/**
 * Styled wrapper around Radix Select. Radix supplies the behaviour that
 * a native <select> can't be styled into and that is genuinely hard to
 * hand-roll — listbox semantics, roving focus, typeahead, collision-aware
 * positioning — and this file supplies the Maavitram surface for it.
 */
export function Select<T extends string>({
  value,
  onValueChange,
  options,
  label,
  className,
  container,
}: SelectProps<T>) {
  return (
    <RadixSelect.Root
      value={value}
      // Guarded against the empty string: when the caller swaps the
      // option set (the reason list changes with Add/Remove), Radix
      // reconciles against items that have not mounted yet and emits ""
      // — propagating that would blank the selection and then fail enum
      // validation on submit.
      onValueChange={(next) => {
        if (next) onValueChange(next as T);
      }}
    >
      <RadixSelect.Trigger
        aria-label={label}
        className={cn(
          "group inline-flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md bg-background px-3",
          "text-sm text-foreground transition-colors duration-[var(--duration-fast)]",
          "hover:bg-green/6 data-[state=open]:bg-green/8 focus:outline-none",
          className,
        )}
      >
        {/* The label is resolved from `options` rather than rendered with
            <Select.Value />. Radix unmounts its items while the list is
            closed, so a value changed programmatically (switching Add →
            Remove swaps the reason set here) leaves <Select.Value /> blank
            until the list is reopened. */}
        <span className="truncate">
          {options.find((option) => option.value === value)?.label ?? ""}
        </span>
        <RadixSelect.Icon asChild>
          <ChevronDown
            className="h-4 w-4 shrink-0 text-muted transition-transform duration-[var(--duration-base)] group-data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal container={container ?? undefined}>
        <RadixSelect.Content
          position="popper"
          sideOffset={6}
          className={cn(
            "z-50 max-h-64 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md bg-surface p-1",
            "shadow-[var(--shadow-card-hover)]",
            "data-[state=open]:animate-rise-in",
          )}
        >
          <RadixSelect.Viewport>
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className={cn(
                  "relative flex cursor-pointer flex-col rounded-sm px-2.5 py-2 pr-8 text-sm text-foreground select-none",
                  "transition-colors duration-[var(--duration-fast)]",
                  "data-[highlighted]:bg-green/8 data-[highlighted]:text-green-dark data-[highlighted]:outline-none",
                  "data-[state=checked]:font-medium",
                )}
              >
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                {option.description ? (
                  <span className="mt-0.5 text-xs text-muted">
                    {option.description}
                  </span>
                ) : null}
                <RadixSelect.ItemIndicator className="absolute top-2.5 right-2.5">
                  <Check className="h-3.5 w-3.5 text-green" aria-hidden="true" />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
