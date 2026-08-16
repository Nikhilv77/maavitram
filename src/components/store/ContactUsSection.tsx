import Image from "next/image";
import { ArrowRight, Leaf, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RevealOnView } from "@/components/ui/RevealOnView";
import { localImageSrc } from "@/config/images";
import { buildWhatsAppLink } from "@/features/whatsapp/lib/link";
import { revealStyle } from "@/lib/revealStyle";

const whatsappHref = buildWhatsAppLink(
  "Hi Maavitram, I have a question about your masalas.",
);

export function ContactUsSection() {
  return (
    <RevealOnView
      id="contact"
      className="relative scroll-mt-4 overflow-hidden bg-white pb-12 sm:pb-16 lg:pb-18"
    >
      <Container>
        <div
          style={revealStyle(0)}
          className="reveal-section-child relative isolate overflow-hidden rounded-md bg-[#fffefa]"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_17%_48%,rgba(33,78,36,0.07),transparent_23%),radial-gradient(circle_at_83%_54%,rgba(201,144,22,0.08),transparent_23%),radial-gradient(circle_at_50%_50%,rgba(243,227,200,0.16),transparent_42%)]"
          />

          <div className="relative z-10 grid min-h-[15.5rem] grid-cols-1 items-center gap-2 px-5 py-8 sm:px-7 lg:grid-cols-[0.9fr_1.25fr_0.9fr] lg:px-9 lg:py-7">
            <div
              style={revealStyle(1)}
              className="reveal-section-child relative isolate order-1 mx-auto flex h-28 w-full max-w-64 items-end justify-center overflow-hidden sm:h-34 lg:order-none lg:h-44 lg:max-w-none lg:justify-start"
            >
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 -z-10 h-36 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(33,78,36,0.11),rgba(243,227,200,0.18)_46%,transparent_72%)] blur-2xl sm:h-44 sm:w-64 lg:left-[38%] lg:h-54 lg:w-76"
              />
              <Image
                src={localImageSrc("/images/contact-us/contact-us-left.png")}
                alt=""
                width={881}
                height={882}
                sizes="(min-width: 1024px) 24vw, (min-width: 640px) 16rem, 70vw"
                className="h-full w-auto object-contain object-bottom"
              />
            </div>

            <div className="order-2 mx-auto max-w-xl text-center">
              <p
                style={revealStyle(2)}
                className="reveal-section-child flex items-center justify-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-foreground/48 uppercase sm:text-[11px]"
              >
                <span className="h-px w-7 bg-foreground/16" />
                Contact Us
                <Leaf className="h-3.5 w-3.5 text-green" aria-hidden="true" />
              </p>
              <h2
                style={revealStyle(3)}
                className="reveal-section-child mt-3 font-serif text-3xl leading-[1.06] font-semibold tracking-normal text-foreground sm:text-4xl"
              >
                We&rsquo;re Here to Help!
              </h2>
              <p
                style={revealStyle(4)}
                className="reveal-section-child mx-auto mt-3 max-w-md text-sm leading-6 font-medium text-muted sm:text-[15px]"
              >
                Have questions, feedback, or need help choosing the right blend?
                Chat with us anytime.
              </p>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                style={revealStyle(5)}
                className="reveal-section-child btn btn-primary mt-5 min-h-11 gap-2 rounded-md px-6 text-xs"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Chat with Us
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>

            <div
              style={revealStyle(6)}
              className="reveal-section-child relative isolate order-3 mx-auto flex h-30 w-full max-w-68 items-end justify-center overflow-hidden sm:h-36 lg:h-48 lg:max-w-none lg:justify-end"
            >
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 -z-10 h-36 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,144,22,0.13),rgba(243,227,200,0.2)_44%,transparent_72%)] blur-2xl sm:h-46 sm:w-68 lg:left-[62%] lg:h-56 lg:w-82"
              />
              <Image
                src={localImageSrc("/images/contact-us/contact-us-right.png")}
                alt=""
                width={970}
                height={914}
                sizes="(min-width: 1024px) 24vw, (min-width: 640px) 17rem, 76vw"
                className="h-full w-auto object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      </Container>
    </RevealOnView>
  );
}
