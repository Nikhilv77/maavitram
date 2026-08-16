import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FacebookIcon, InstagramIcon } from "@/components/store/SocialIcons";

interface AnnouncementBarProps {
  instagramUrl?: string;
  facebookUrl?: string;
}

/**
 * Slim utility bar above the main nav: shipping/quality note + social links.
 * Icons hide below `sm` so the message stays centered and legible on
 * narrow screens rather than competing for space.
 */
export function AnnouncementBar({
  instagramUrl = "#",
  facebookUrl = "#",
}: AnnouncementBarProps) {
  return (
    <div className="bg-green-dark text-surface">
      <Container className="grid grid-cols-1 items-center gap-1 py-2 sm:grid-cols-[1fr_auto_1fr]">
        <span aria-hidden="true" className="hidden sm:block" />

        <p className="text-center text-[11px] font-medium tracking-wide text-balance sm:text-xs">
          <span className="sm:hidden">
            Free shipping over ₹499 <span className="text-surface/45">|</span>{" "}
            Premium Quality
          </span>
          <span className="hidden sm:inline">
            Free shipping on orders above ₹499{" "}
            <span className="text-surface/45">|</span> 100% Natural & Premium
            Quality
          </span>
        </p>

        <div className="hidden items-center justify-end gap-3 sm:flex">
          <Link
            href={instagramUrl}
            aria-label="Maavitram on Instagram"
            className="cursor-pointer text-surface/85 transition-colors duration-[var(--duration-fast)] hover:text-surface"
          >
            <InstagramIcon className="h-4 w-4" />
          </Link>
          <Link
            href={facebookUrl}
            aria-label="Maavitram on Facebook"
            className="cursor-pointer text-surface/85 transition-colors duration-[var(--duration-fast)] hover:text-surface"
          >
            <FacebookIcon className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </div>
  );
}
