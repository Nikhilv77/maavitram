import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LeafPattern } from "@/components/ui/LeafPattern";
import { FacebookIcon, InstagramIcon } from "@/components/store/SocialIcons";
import { buildWhatsAppLink } from "@/features/whatsapp/lib/link";
import { siteConfig } from "@/config/site";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Why Maavitram", href: "/why-maavitram" },
  { label: "Recipes", href: "/recipes" },
  { label: "Contact", href: "/contact" },
] as const;

const careLinks = [
  { label: "Shipping & Delivery", href: "/shipping" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "FAQs", href: "/faqs" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
] as const;

const shopLinks = [
  { label: "Maavitram Mix Tez", href: "/shop/maavitram-tez" },
  { label: "Maavitram Mix Saumya", href: "/shop/maavitram-saumya" },
  {
    label: "Maavitram Achaari Virasat",
    href: "/shop/maavitram-achaari-virasat",
  },
  { label: "Maavitram Lal Tadka", href: "/shop/maavitram-lal-tadka" },
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

export function StoreFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#fcf8f0] text-foreground">
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
          <div>
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
            <FooterLinkColumn title="Quick Links" links={quickLinks} />
            <FooterLinkColumn title="Customer Care" links={careLinks} />
            <FooterLinkColumn title="Shop" links={shopLinks} />
          </div>

          <div className="border-t border-foreground/10 pt-7 sm:border-t-0 sm:pt-0 lg:border-l lg:pl-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-green">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Get in Touch
            </div>

            <p className="mt-3 max-w-64 text-sm leading-6 text-foreground/62">
              Questions about our masalas, orders, or availability? We&rsquo;re
              just a message away.
            </p>

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

        <div className="mt-8 border-t border-foreground/10 pt-5 text-center text-sm text-muted">
          &copy; 2026 {siteConfig.name}. All rights reserved.
        </div>
      </Container>
    </footer>
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
