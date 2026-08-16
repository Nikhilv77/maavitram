"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessagesSquare } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { buildWhatsAppLink } from "@/features/whatsapp/lib/link";
import { storeNav } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";


const transition = "transition-colors duration-[var(--duration-fast)]";

// Number comes from NEXT_PUBLIC_WHATSAPP_NUMBER via siteConfig — this is
// the default recipient of buildWhatsAppLink. The message differs from the
// footer's so it's clear in WhatsApp which surface someone came from.
const whatsAppHref = buildWhatsAppLink(
  "Hi Maavitram, I'd like to know more about your masalas.",
);

const iconButtonClass = cn(
  "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-foreground/65 sm:h-9 sm:w-9",
  transition,
  "hover:bg-green/8 hover:text-green",
);

/**
 * Main storefront nav: logo, centered link list, and utility icons.
 * Client component — needs the mobile menu's open state and the active
 * route (for link highlighting).
 */
export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="store-nav relative">
      <Container className="grid grid-cols-[auto_1fr] items-center gap-2 py-2 sm:gap-4 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
        <Link href="/" className="flex w-fit items-center">
          {/* Wordmark + tagline are baked into this asset — no separate
              text lockup needed here. */}
          <Image
            src="/brand/maavitram-nav.png"
            alt={siteConfig.name}
            width={2172}
            height={724}
            preload
            className="h-8 w-auto object-contain sm:h-13 lg:h-14"
          />
        </Link>

        <nav aria-label="Main" className="hidden lg:flex lg:justify-center">
          <ul className="flex items-center gap-8">
            {storeNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "text-sm font-medium",
                    transition,
                    isActive(item.href)
                      ? "text-green"
                      : "text-foreground/70 hover:text-green",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-end gap-0.5 sm:gap-2">
          <a
            href={whatsAppHref}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat with us on WhatsApp"
            className={iconButtonClass}
          >
            <MessagesSquare className="h-5 w-5" aria-hidden="true" />
          </a>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(iconButtonClass, "lg:hidden")}
          >
            {/* Three bars morphing into an X via transform, rather than
                swapping between two separate icons — the 7px translate
                matches this h-4 container's justify-between bar spacing
                exactly, so the two outer bars converge on the middle
                bar's line before rotating into place. */}
            <span className="flex h-4 w-5 flex-col justify-between">
              <span
                className={cn(
                  "h-0.5 w-full rounded-full bg-current transition-transform duration-[var(--duration-base)] ease-out",
                  menuOpen && "translate-y-[7px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "h-0.5 w-full rounded-full bg-current transition-opacity duration-[var(--duration-fast)]",
                  menuOpen && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "h-0.5 w-full rounded-full bg-current transition-transform duration-[var(--duration-base)] ease-out",
                  menuOpen && "-translate-y-[7px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </Container>

      <nav
        aria-label="Mobile"
        inert={!menuOpen}
        className={cn(
          "store-nav absolute inset-x-0 top-full z-40 backdrop-blur-md transition-[opacity,translate] duration-[var(--duration-base)] ease-out lg:hidden",
          menuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0",
        )}
      >
        <ul className="container flex flex-col gap-1 py-4">
          {storeNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "block rounded-md px-4 py-3 text-base font-medium",
                  transition,
                  isActive(item.href)
                    ? "bg-green/10 text-green-dark"
                    : "text-foreground/75 hover:bg-surface/75 hover:text-green",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
