import Link from "next/link";
import { ArrowRight, Check, Mail, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LeafPattern } from "@/components/ui/LeafPattern";
import { RevealOnView } from "@/components/ui/RevealOnView";
import { FacebookIcon, InstagramIcon } from "@/components/store/SocialIcons";
import { FooterShopLinks } from "@/components/store/FooterShopLinks";
import { buildWhatsAppLink } from "@/features/whatsapp/lib/link";
import { siteConfig } from "@/config/site";
import { revealStyle } from "@/lib/revealStyle";

// Anchors, not routes — the storefront is a single page today, and the
// old /shop, /about, /why-maavitram, /recipes and /contact hrefs all 404'd.
const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/#products" },
  { label: "About Us", href: "/#about" },
  { label: "Why Maavitram", href: "/#why-maavitram" },
  { label: "Contact", href: "/#contact" },
] as const;

/**
 * Replaces the old "Customer Care" column. Those five links (Shipping,
 * Returns, FAQs, Privacy, Terms) all pointed at pages that don't exist,
 * and there's no policy content to link to yet — so the column now
 * carries statements instead of navigation, keeping the three-column
 * balance without promising pages that aren't there.
 */
const promises = [
  "Stone-ground blends",
  "No added colour",
  "Sourced from farms",
  "Packed fresh",
  "Trusted Recipes",
] as const;

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  {
    label: "WhatsApp",
    href: buildWhatsAppLink("Hi Maavitram, I need help."),
    icon: MessageCircle,
  },
] as const;

const contactHref = buildWhatsAppLink(
  "Hi Maavitram, I would like to get in touch.",
);
const contactEmail = "maavigram.info@gmail.com";

export function StoreFooter() {
  return (
    <RevealOnView
      as="footer"
      className="relative overflow-hidden bg-[#fcf8f0] text-foreground"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/20 to-white/45"
      />
      <LeafPattern
        id="store-footer-leaves"
        className="text-green opacity-[0.025]"
      />

      <Container className="relative z-10 py-9 sm:py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_2.45fr_1.15fr] lg:gap-10">
          <div style={revealStyle(0)} className="reveal-section-child">
            <Link href="/" className="inline-flex flex-col">
              <span className="font-serif text-3xl leading-none font-semibold tracking-[0.08em] text-green sm:text-4xl">
                MAAVITRAM
              </span>
              <span className="mt-2 text-[9px] font-semibold tracking-[0.28em] text-gold uppercase">
                Rooted in Nature, Blended with Care
              </span>
            </Link>

            <p className="mt-4 max-w-60 text-sm leading-6 text-muted">
              Pure, honest masalas crafted for everyday Indian kitchens.
            </p>

            <div className="mt-5 flex items-center gap-2.5">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/58 transition-colors duration-[var(--duration-fast)] hover:bg-green/8 hover:text-green"
                  >
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid gap-7 sm:grid-cols-3 sm:gap-8">
            <div style={revealStyle(1)} className="reveal-section-child">
              <FooterLinkColumn title="Quick Links" links={quickLinks} />
            </div>
            <div style={revealStyle(2)} className="reveal-section-child">
              <FooterPromiseColumn />
            </div>
            <div style={revealStyle(3)} className="reveal-section-child">
              <FooterShopLinks />
            </div>
          </div>

          <div
            style={revealStyle(4)}
            className="reveal-section-child border-t border-foreground/10 pt-7 sm:border-t-0 sm:pt-0 lg:border-l lg:pl-8"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-green">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Get in Touch
            </div>

            <p className="mt-3 max-w-64 text-sm leading-6 text-foreground/62">
              Questions about our masalas, orders, or availability? We&rsquo;re
              just a message away.
            </p>

            <a
              href={`mailto:${contactEmail}`}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-foreground/64 transition-colors duration-[var(--duration-fast)] hover:text-green"
            >
              <Mail className="h-4 w-4 text-green/75" aria-hidden="true" />
              {contactEmail}
            </a>

            <a
              href={contactHref}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary mt-5 min-h-10 gap-2 rounded-md px-5 text-xs"
            >
              Chat on WhatsApp
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div
          style={revealStyle(5)}
          className="reveal-section-child mt-8 border-t border-foreground/10 pt-5 text-center text-sm text-muted"
        >
          &copy; 2026 {siteConfig.name}. All rights reserved.
        </div>
      </Container>
    </RevealOnView>
  );
}

function FooterPromiseColumn() {
  return (
    <section aria-labelledby="footer-promise-title">
      <h2 id="footer-promise-title" className="text-sm font-semibold text-green">
        Our Promise
      </h2>
      <ul className="mt-3.5 grid gap-2.5">
        {promises.map((promise) => (
          <li
            key={promise}
            className="flex items-start gap-2 text-sm leading-5 font-medium text-foreground/62"
          >
            <Check
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green/70"
              aria-hidden="true"
            />
            {promise}
          </li>
        ))}
      </ul>
    </section>
  );
}

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <nav aria-label={title}>
      <h2 className="text-sm font-semibold text-green">{title}</h2>
      <ul className="mt-3.5 grid gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm font-medium text-foreground/62 transition-colors duration-[var(--duration-fast)] hover:text-green"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
