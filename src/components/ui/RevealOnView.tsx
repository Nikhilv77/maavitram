"use client";

import type {
  HTMLAttributes,
  MutableRefObject,
  ReactNode,
} from "react";
import { useInView } from "@/lib/useInView";
import { cn } from "@/lib/utils";

type RevealTag = "section" | "footer" | "div";

interface RevealOnViewProps extends HTMLAttributes<HTMLElement> {
  as?: RevealTag;
  children: ReactNode;
  rootMargin?: string;
  threshold?: number;
}

export function RevealOnView({
  as = "section",
  children,
  className,
  rootMargin,
  threshold,
  ...props
}: RevealOnViewProps) {
  const { ref, inView } = useInView<HTMLElement>({ rootMargin, threshold });
  const Tag = as;
  const setRef = (node: HTMLElement | null) => {
    (ref as MutableRefObject<HTMLElement | null>).current = node;
  };

  return (
    <Tag
      {...props}
      ref={setRef}
      data-revealed={inView ? "true" : "false"}
      className={cn("reveal-section", inView && "is-revealed", className)}
    >
      {children}
    </Tag>
  );
}
