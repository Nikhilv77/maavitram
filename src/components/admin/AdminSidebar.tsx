"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, Store, X } from "lucide-react";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { adminNav } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * `/admin` is a prefix of every other admin route, so it only counts as
 * active on an exact match — otherwise it would stay highlighted on all
 * of them.
 */
function isActiveRoute(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-5">
        <Link href="/admin" onClick={onNavigate} className="flex w-fit">
          <Image
            src="/brand/maavitram-nav.png"
            alt={siteConfig.name}
            width={2172}
            height={724}
            className="h-9 w-auto object-contain"
          />
        </Link>
      </div>

      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {adminNav.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
                    "transition-colors duration-[var(--duration-fast)]",
                    active
                      ? "bg-green/10 text-green-dark"
                      : "text-foreground/70 hover:bg-green/6 hover:text-green",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-[18px] w-[18px] shrink-0",
                      active ? "text-green" : "text-foreground/45",
                    )}
                    aria-hidden="true"
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-border p-3">
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          onClick={onNavigate}
          className="group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors duration-[var(--duration-fast)] hover:bg-green/6 hover:text-green"
        >
          <Store
            className="h-[18px] w-[18px] shrink-0 text-foreground/45"
            aria-hidden="true"
          />
          View Store
          <ArrowUpRight
            className="ml-auto h-3.5 w-3.5 shrink-0 text-foreground/30 transition-colors duration-[var(--duration-fast)] group-hover:text-green"
            aria-hidden="true"
          />
        </Link>

        <LogoutButton />
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      {/* Mobile bar — the only place the drawer can be opened from. */}
      <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-surface px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-foreground/70 transition-colors duration-[var(--duration-fast)] hover:bg-green/8 hover:text-green"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Image
          src="/brand/maavitram-nav.png"
          alt={siteConfig.name}
          width={2172}
          height={724}
          className="h-8 w-auto object-contain"
        />
      </div>

      {/* Desktop rail. Fixed so the dashboard scrolls under it. */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-surface lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer. Kept mounted so both it and the scrim can
          transition, rather than popping in and out of the DOM. `inert`
          pulls the closed panel out of tab order and off assistive tech. */}
      <div
        onClick={close}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-foreground/25 transition-opacity duration-[var(--duration-base)] lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        inert={!open}
        aria-label="Admin"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-surface lg:hidden",
          "transition-transform duration-[var(--duration-base)] ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close menu"
          className="absolute top-4 right-3 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-foreground/70 transition-colors duration-[var(--duration-fast)] hover:bg-green/8 hover:text-green"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarContent onNavigate={close} />
      </aside>
    </>
  );
}
