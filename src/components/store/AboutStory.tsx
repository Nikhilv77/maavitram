import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RevealOnView } from "@/components/ui/RevealOnView";
import { localImageSrc } from "@/config/images";
import { revealStyle } from "@/lib/revealStyle";

const storyStats = [
  { value: "100%", label: "Natural" },
  { value: "4+", label: "Signature Blends" },
  { value: "1000+", label: "Happy Customers" },
] as const;

export function AboutStory() {
  return (
    <RevealOnView
      id="about"
      className="relative isolate scroll-mt-4 overflow-hidden bg-white"
    >
      <div className="relative lg:min-h-[540px] xl:min-h-[580px]">
        <div
          style={revealStyle(0)}
          className="reveal-section-child relative h-[300px] overflow-hidden bg-[#f4e4ca] sm:h-[390px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[57%] lg:bg-transparent"
        >
          <Image
            src={localImageSrc("/images/about-us/about-us-visual.png")}
            alt="Maavitram brand story with traditional spices, herbs, mortar and chillies"
            fill
            sizes="(min-width: 1280px) 57vw, (min-width: 1024px) 57vw, 100vw"
            className="object-cover object-[58%_50%] lg:object-center"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/50 to-transparent lg:hidden"
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,#fff_0%,#fff_39%,rgba(255,255,255,0.84)_47%,rgba(255,255,255,0.18)_55%,transparent_63%)] lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[48%] bg-[radial-gradient(circle_at_26%_76%,rgba(201,144,22,0.07),transparent_34%)] lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[52%] bg-[radial-gradient(ellipse_at_18%_24%,rgba(243,227,200,0.16),transparent_34%),radial-gradient(ellipse_at_42%_62%,rgba(244,231,210,0.13),transparent_30%)] lg:block"
        />
        <CreamGradientPatches />

        <div className="relative z-10 lg:flex lg:min-h-[540px] lg:items-center xl:min-h-[580px]">
          <Container>
            <div className="max-w-xl pt-8 pb-10 sm:py-12 lg:w-[48%] lg:max-w-[610px] lg:py-16">
              <p
                style={revealStyle(1)}
                className="reveal-section-child flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-foreground/65 uppercase"
              >
                <span className="h-px w-7 bg-foreground/28" />
                Our Story
                <Leaf className="h-3.5 w-3.5 text-green" aria-hidden="true" />
              </p>

              <h2
                style={revealStyle(2)}
                className="reveal-section-child mt-3 font-serif text-[2.55rem] leading-[1.04] font-semibold tracking-normal text-foreground sm:text-5xl lg:text-[3.35rem] xl:text-[3.65rem]"
              >
                <span className="block">From Nature&apos;s Best</span>
                <span className="block">to Your Kitchen</span>
              </h2>

              <div
                style={revealStyle(3)}
                className="reveal-section-child mt-5 grid gap-3 text-sm leading-7 font-medium text-muted sm:text-base"
              >
                <p>
                  At Maavitram, we believe great food begins with ingredients
                  you can trust. Our masalas are crafted from handpicked spices,
                  balanced recipes, and careful hygienic processing.
                </p>
                <p>
                  Every blend is made to carry the warmth of traditional Indian
                  cooking into modern kitchens, giving you purity, aroma, and
                  dependable flavour in every pack.
                </p>
              </div>

              <div
                style={revealStyle(4)}
                className="reveal-section-child mt-6"
              >
                <Link
                  href="/about"
                  className="btn btn-primary min-h-11 gap-2 rounded-md px-6 text-xs"
                >
                  Know More About Us
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <dl className="mt-8 grid max-w-[30rem] grid-cols-3 divide-x divide-foreground/10">
                {storyStats.map((stat, index) => (
                  <div
                    key={stat.label}
                    style={revealStyle(index + 5)}
                    className="reveal-section-child px-4 first:pl-0 last:pr-0"
                  >
                    <dt className="text-2xl leading-none font-semibold text-green">
                      {stat.value}
                    </dt>
                    <dd className="mt-1.5 text-[11px] leading-4 font-medium text-muted sm:text-xs">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </div>
      </div>
    </RevealOnView>
  );
}

function CreamGradientPatches() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 z-[2] hidden w-[55%] overflow-hidden lg:block"
    >
      <span
        className="absolute top-[7%] left-[6%] h-36 w-52 -rotate-12 rounded-full opacity-24 blur-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(117,128,110,0.34) 0%, rgba(243,227,200,0.22) 52%, transparent 100%)",
        }}
      />
      <span
        className="absolute top-[18%] left-[2%] h-20 w-40 rotate-3 rounded-full opacity-18 blur-xl"
        style={{
          background:
            "linear-gradient(120deg, rgba(244,231,210,0.36) 0%, rgba(201,144,22,0.12) 56%, transparent 100%)",
        }}
      />
      <span
        className="absolute top-[25%] left-[35%] h-28 w-64 rotate-6 rounded-full opacity-26 blur-2xl"
        style={{
          background:
            "linear-gradient(115deg, transparent 0%, rgba(201,144,22,0.3) 42%, rgba(244,231,210,0.22) 72%, transparent 100%)",
        }}
      />
      <span
        className="absolute top-[44%] left-[30%] h-24 w-56 -rotate-2 rounded-full opacity-19 blur-xl"
        style={{
          background:
            "linear-gradient(130deg, transparent 0%, rgba(243,227,200,0.34) 34%, rgba(201,144,22,0.12) 72%, transparent 100%)",
        }}
      />
      <span
        className="absolute top-[52%] left-[8%] h-32 w-72 rotate-3 rounded-full opacity-24 blur-2xl"
        style={{
          background:
            "linear-gradient(125deg, rgba(243,227,200,0.46) 0%, rgba(201,144,22,0.18) 52%, transparent 100%)",
        }}
      />
      <span
        className="absolute top-[70%] left-[36%] h-24 w-44 -rotate-6 rounded-full opacity-20 blur-2xl"
        style={{
          background:
            "linear-gradient(135deg, transparent 0%, rgba(201,144,22,0.28) 46%, rgba(243,227,200,0.18) 78%, transparent 100%)",
        }}
      />
      <span
        className="absolute top-[37%] left-[2%] h-20 w-36 -rotate-3 rounded-full opacity-17 blur-xl"
        style={{
          background:
            "linear-gradient(120deg, rgba(33,78,36,0.16) 0%, rgba(243,227,200,0.2) 58%, transparent 100%)",
        }}
      />
    </div>
  );
}
