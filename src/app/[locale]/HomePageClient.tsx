"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  Cpu,
  Gamepad2,
  Gift,
  Keyboard,
  Lightbulb,
  ScrollText,
  Shirt,
  Sparkles,
  Swords,
  Tag,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Tools Grid 锚点 → 各模块 section id（顺序与 tools.cards 一一对应）
const MODULE_SECTION_IDS = [
  "release-date-platforms",
  "characters-tier-list",
  "beginner-guide-controls",
  "combat-system-mechanics",
  "story-mode-doa-quest",
  "costumes-dlc-season-passes",
  "core-fighters-free-version",
  "pc-requirements-online-crossplay",
];

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://deadoralive6lastround.online";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Dead or Alive 6 Wiki",
        description:
          "Complete Dead or Alive 6 Wiki covering characters, tier list, combos, stages, Core Fighters, costumes, and Last Round updates for PS5, Xbox Series X|S, and Steam.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 460,
          height: 215,
          caption: "Dead or Alive 6 Last Round - 3D Fighting Game",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Dead or Alive 6 Wiki",
        alternateName: "Dead or Alive 6",
        url: siteUrl,
        description:
          "Complete Dead or Alive 6 Wiki resource hub for characters, tier list, combos, stages, costumes, Core Fighters, and Last Round guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 460,
          height: 215,
          caption: "Dead or Alive 6 Wiki - 3D Fighting Game",
        },
        sameAs: [
          "https://teamninja-studio.com/doa6/lastround/us/",
          "https://store.steampowered.com/app/4144680/DEAD_OR_ALIVE_6_Last_Round/",
          "https://discord.com/invite/ktfamily",
          "https://www.reddit.com/r/DeadOrAlive/",
          "https://www.youtube.com/user/TecmoKoeiAmerica",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Dead or Alive 6",
        gamePlatform: ["PlayStation 5", "Xbox Series X|S", "PC"],
        applicationCategory: "Game",
        genre: ["Fighting", "Action", "3D Fighting"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 2,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/4144680/DEAD_OR_ALIVE_6_Last_Round/",
        },
      },
      {
        "@type": "VideoObject",
        name: "DEAD OR ALIVE 6 Last Round Announcement Trailer",
        description:
          "Official Dead or Alive 6 Last Round announcement trailer showcasing the new-generation fighting game.",
        uploadDate: "2026-06-25",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/HDjAfazoqGI",
        url: "https://www.youtube.com/watch?v=HDjAfazoqGI",
      },
    ],
  };

  // 模块 4 战斗机制手风琴状态
  const [mechanicsExpanded, setMechanicsExpanded] = useState<number | null>(0);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("characters-tier-list")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/4144680/DEAD_OR_ALIVE_6_Last_Round/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section（紧跟 Hero，max-w-5xl） */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="HDjAfazoqGI"
              title="DEAD OR ALIVE 6 Last Round Announcement Trailer"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 模块导航卡（紧随视频，max-w-5xl） */}
      <section id="tools" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => (
              <button
                key={index}
                onClick={() => scrollToSection(MODULE_SECTION_IDS[index])}
                className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                           bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                           transition-all duration-300 cursor-pointer text-left
                           hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                bg-[hsl(var(--nav-theme)/0.1)]
                                flex items-center justify-center
                                group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                transition-colors"
                >
                  <DynamicIcon
                    name={card.icon}
                    className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                  />
                </div>
                <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {card.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Release Date and Platforms（info-cards，禁止 source links） */}
      <section id="release-date-platforms" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Calendar className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wide">
                {t.modules.doa6ReleaseDatePlatforms.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t.modules.doa6ReleaseDatePlatforms.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.doa6ReleaseDatePlatforms.subtitle}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.doa6ReleaseDatePlatforms.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-1.5">
                  {item.label}
                </p>
                <p className="text-base font-bold mb-1.5">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 3: 第一模块之后 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Characters and Tier List（tier-grid） */}
      <section id="characters-tier-list" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Users className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wide">
                {t.modules.doa6CharactersTierList.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t.modules.doa6CharactersTierList.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.doa6CharactersTierList.subtitle}
            </p>
          </div>

          <div className="scroll-reveal space-y-8">
            {t.modules.doa6CharactersTierList.tiers.map((tier: any, ti: number) => (
              <div key={ti} className="p-5 md:p-6 bg-white/5 border border-border rounded-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {tier.tier}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{tier.label}</h3>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tier.fighters.map((f: any, fi: number) => (
                    <div
                      key={fi}
                      className="p-4 bg-white/5 border border-border rounded-xl"
                    >
                      <p className="font-bold text-[hsl(var(--nav-theme-light))]">{f.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{f.style}</p>
                      <p className="text-sm mt-1.5">{f.role}</p>
                      <p className="flex items-start gap-1.5 text-xs text-muted-foreground mt-2">
                        <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        {f.unlock}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Beginner Guide and Controls（step-by-step） */}
      <section id="beginner-guide-controls" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <BookOpen className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wide">
                {t.modules.doa6BeginnerGuideControls.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t.modules.doa6BeginnerGuideControls.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.doa6BeginnerGuideControls.subtitle}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8">
            {t.modules.doa6BeginnerGuideControls.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-1.5">{step.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Control Layouts */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Keyboard className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Default Control Layouts</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {t.modules.doa6BeginnerGuideControls.controls.map((c: any, ci: number) => (
                <div key={ci} className="p-4 bg-white/5 border border-border rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    {c.platform === "Steam Keyboard" ? (
                      <Keyboard className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                    ) : (
                      <Gamepad2 className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                    )}
                    <h4 className="font-semibold text-sm">{c.platform}</h4>
                  </div>
                  <dl className="grid grid-cols-1 gap-1.5 text-sm">
                    <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Punch</dt><dd className="font-medium">{c.punch}</dd></div>
                    <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Kick</dt><dd className="font-medium">{c.kick}</dd></div>
                    <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Hold</dt><dd className="font-medium">{c.hold}</dd></div>
                    <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Throw</dt><dd className="font-medium">{c.throw}</dd></div>
                    <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Special</dt><dd className="font-medium">{c.special}</dd></div>
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Module 4: Combat System and Mechanics（accordion） */}
      <section id="combat-system-mechanics" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Swords className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wide">
                {t.modules.doa6CombatSystemMechanics.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t.modules.doa6CombatSystemMechanics.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.doa6CombatSystemMechanics.subtitle}
            </p>
          </div>

          <div className="scroll-reveal space-y-2">
            {t.modules.doa6CombatSystemMechanics.mechanics.map((m: any, index: number) => (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden bg-white/5"
              >
                <button
                  onClick={() => setMechanicsExpanded(mechanicsExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <div>
                    <h3 className="font-bold text-base md:text-lg">{m.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{m.summary}</p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${mechanicsExpanded === index ? "rotate-180" : ""}`}
                  />
                </button>
                {mechanicsExpanded === index && (
                  <div className="px-5 pb-5">
                    <ul className="space-y-1.5 mb-3">
                      {m.details.map((d: string, di: number) => (
                        <li key={di} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <p className="flex items-start gap-2 text-sm p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.2)]">
                      <Lightbulb className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span><span className="font-medium">Example: </span>{m.example}</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 4: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 5: Story Mode and DOA Quest（mission-grid） */}
      <section id="story-mode-doa-quest" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <ScrollText className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wide">
                {t.modules.doa6StoryModeDoaQuest.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t.modules.doa6StoryModeDoaQuest.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.doa6StoryModeDoaQuest.subtitle}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.doa6StoryModeDoaQuest.modes.map((mode: any, mi: number) => (
              <div
                key={mi}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">{mode.mode}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {mode.category}
                  </span>
                </div>
                <p className="text-sm mb-3"><span className="font-medium">Best for: </span>{mode.bestFor}</p>
                <p className="text-sm text-muted-foreground mb-3">{mode.access}</p>
                {mode.coreFightersAccess && (
                  <p className="flex items-start gap-1.5 text-xs text-muted-foreground mb-2 p-2.5 rounded-lg bg-[hsl(var(--nav-theme)/0.06)] border border-[hsl(var(--nav-theme)/0.2)]">
                    <Lightbulb className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">Core Fighters: </span>{mode.coreFightersAccess}</span>
                  </p>
                )}
                {mode.lastRoundCoreFightersAccess && (
                  <p className="flex items-start gap-1.5 text-xs text-muted-foreground mb-2 p-2.5 rounded-lg bg-[hsl(var(--nav-theme)/0.06)] border border-[hsl(var(--nav-theme)/0.2)]">
                    <Lightbulb className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">Last Round Core Fighters: </span>{mode.lastRoundCoreFightersAccess}</span>
                  </p>
                )}
                {mode.missionStructure && (
                  <p className="flex items-start gap-1.5 text-xs text-muted-foreground mb-2 p-2.5 rounded-lg bg-[hsl(var(--nav-theme)/0.06)] border border-[hsl(var(--nav-theme)/0.2)]">
                    <ScrollText className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">Structure: </span>{mode.missionStructure}</span>
                  </p>
                )}
                {mode.missionUse && (
                  <p className="flex items-start gap-1.5 text-xs text-muted-foreground mb-2 p-2.5 rounded-lg bg-[hsl(var(--nav-theme)/0.06)] border border-[hsl(var(--nav-theme)/0.2)]">
                    <Lightbulb className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">Mission use: </span>{mode.missionUse}</span>
                  </p>
                )}
                {mode.characterRule && (
                  <p className="flex items-start gap-1.5 text-xs text-muted-foreground mb-2 p-2.5 rounded-lg bg-[hsl(var(--nav-theme)/0.06)] border border-[hsl(var(--nav-theme)/0.2)]">
                    <Users className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">Characters: </span>{mode.characterRule}</span>
                  </p>
                )}
                {mode.rewardUse && (
                  <p className="flex items-start gap-1.5 text-xs text-muted-foreground mb-2 p-2.5 rounded-lg bg-[hsl(var(--nav-theme)/0.06)] border border-[hsl(var(--nav-theme)/0.2)]">
                    <Gift className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">Reward use: </span>{mode.rewardUse}</span>
                  </p>
                )}
                {mode.features?.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Features</p>
                    <div className="flex flex-wrap gap-1.5">
                      {mode.features.map((f: string, fi: number) => (
                        <span key={fi} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-border text-xs text-muted-foreground">
                          <Tag className="w-3 h-3" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {mode.route?.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Recommended route</p>
                    <ol className="space-y-1.5">
                      {mode.route.map((r: string, ri: number) => (
                        <li key={ri} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] text-xs font-bold text-[hsl(var(--nav-theme-light))]">{ri + 1}</span>
                          {r}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {mode.rewards?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {mode.rewards.map((r: string, ri: number) => (
                      <span
                        key={ri}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs"
                      >
                        <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Costumes DLC and Season Passes（card-list） */}
      <section id="costumes-dlc-season-passes" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Shirt className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wide">
                {t.modules.doa6CostumesDlcSeasonPasses.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t.modules.doa6CostumesDlcSeasonPasses.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.doa6CostumesDlcSeasonPasses.subtitle}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.doa6CostumesDlcSeasonPasses.packs.map((pack: any, pi: number) => (
              <div
                key={pi}
                className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-bold text-base text-[hsl(var(--nav-theme-light))]">{pack.name}</h3>
                  {pack.releaseDate && (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                      <Calendar className="w-3 h-3" />
                      {pack.releaseDate}
                    </span>
                  )}
                </div>
                {pack.use && <p className="text-sm mb-3">{pack.use}</p>}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {pack.platforms?.map((p: string, pi2: number) => (
                    <span
                      key={pi2}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-border text-xs text-muted-foreground"
                    >
                      <Tag className="w-3 h-3" />
                      {p}
                    </span>
                  ))}
                </div>
                {pack.mainContents?.length > 0 && (
                  <div className="mb-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Main contents</p>
                    <ul className="space-y-1">
                      {pack.mainContents.map((c: string, ci: number) => (
                        <li key={ci} className="flex items-start gap-1.5 text-sm">
                          <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pack.costumeSets?.length > 0 && (
                  <div className="mb-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Costume sets</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pack.costumeSets.map((c: string, ci: number) => (
                        <span key={ci} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-border text-xs text-muted-foreground">
                          <Shirt className="w-3 h-3" />
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {pack.extraContent?.length > 0 && (
                  <div className="mb-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Extra content</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pack.extraContent.map((c: string, ci: number) => (
                        <span key={ci} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-border text-xs text-muted-foreground">
                          <Sparkles className="w-3 h-3" />
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {pack.bonusContent?.length > 0 && (
                  <div className="mb-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Bonus content</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pack.bonusContent.map((c: string, ci: number) => (
                        <span key={ci} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-border text-xs text-muted-foreground">
                          <Gift className="w-3 h-3" />
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {pack.characters?.length > 0 && (
                  <div className="mb-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Characters</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pack.characters.map((c: string, ci: number) => (
                        <span key={ci} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs">
                          <Users className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {pack.contents?.length > 0 && (
                  <div className="mb-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Contents</p>
                    <ul className="space-y-1">
                      {pack.contents.map((c: string, ci: number) => (
                        <li key={ci} className="flex items-start gap-1.5 text-sm">
                          <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pack.debutCostumes?.length > 0 && (
                  <div className="mb-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Debut costumes</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pack.debutCostumes.map((c: string, ci: number) => (
                        <span key={ci} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-border text-xs text-muted-foreground">
                          <Shirt className="w-3 h-3" />
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {pack.coreFightersUnlocks?.length > 0 && (
                  <div className="mb-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Core Fighters unlocks</p>
                    <ul className="space-y-1">
                      {pack.coreFightersUnlocks.map((c: string, ci: number) => (
                        <li key={ci} className="flex items-start gap-1.5 text-sm">
                          <Gift className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pack.carryOver?.length > 0 && (
                  <div className="mb-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-1.5">Carries over</p>
                    <ul className="space-y-1">
                      {pack.carryOver.map((c: string, ci: number) => (
                        <li key={ci} className="flex items-start gap-1.5 text-sm text-muted-foreground">
                          <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pack.notCarriedOver?.length > 0 && (
                  <div className="mb-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Does not carry over</p>
                    <ul className="space-y-1">
                      {pack.notCarriedOver.map((c: string, ci: number) => (
                        <li key={ci} className="flex items-start gap-1.5 text-sm text-muted-foreground">
                          <X className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pack.limitations?.length > 0 && (
                  <div className="mb-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Limitations</p>
                    <ul className="space-y-1">
                      {pack.limitations.map((c: string, ci: number) => (
                        <li key={ci} className="flex items-start gap-1.5 text-sm text-muted-foreground">
                          <X className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pack.note && (
                  <p className="flex items-start gap-1.5 text-xs text-muted-foreground mt-auto pt-2 border-t border-border">
                    <Lightbulb className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    {pack.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Core Fighters and Free Version（comparison-table） */}
      <section id="core-fighters-free-version" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Gift className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wide">
                {t.modules.doa6CoreFightersFreeVersion.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t.modules.doa6CoreFightersFreeVersion.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.doa6CoreFightersFreeVersion.subtitle}
            </p>
          </div>

          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full border-collapse text-sm min-w-[720px]">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)]">
                  <th className="text-left p-3 md:p-4 font-semibold border-b border-border">Feature</th>
                  {t.modules.doa6CoreFightersFreeVersion.editions.map((e: string, ei: number) => (
                    <th key={ei} className="text-left p-3 md:p-4 font-semibold border-b border-border text-[hsl(var(--nav-theme-light))]">
                      {e}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.modules.doa6CoreFightersFreeVersion.rows.map((row: any, ri: number) => (
                  <tr key={ri} className={ri % 2 === 1 ? "bg-white/[0.02]" : ""}>
                    <td className="p-3 md:p-4 font-medium border-b border-border align-top">{row.feature}</td>
                    <td className="p-3 md:p-4 text-muted-foreground border-b border-border align-top">{row.paid}</td>
                    <td className="p-3 md:p-4 text-muted-foreground border-b border-border align-top">{row.core}</td>
                    <td className="p-3 md:p-4 text-muted-foreground border-b border-border align-top">{row.lrPaid}</td>
                    <td className="p-3 md:p-4 text-muted-foreground border-b border-border align-top">{row.lrCore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Module 8: PC Requirements, Online Modes, and Crossplay（specs-table） */}
      <section id="pc-requirements-online-crossplay" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Cpu className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wide">
                {t.modules.doa6PcRequirementsOnlineCrossplay.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t.modules.doa6PcRequirementsOnlineCrossplay.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.doa6PcRequirementsOnlineCrossplay.subtitle}
            </p>
          </div>

          <div className="scroll-reveal space-y-6">
            {t.modules.doa6PcRequirementsOnlineCrossplay.groups.map((group: any, gi: number) => (
              <div key={gi} className="p-5 bg-white/5 border border-border rounded-xl">
                <h3 className="font-bold text-[hsl(var(--nav-theme-light))] mb-3">{group.group}</h3>
                <div className="space-y-3">
                  {group.rows.map((r: any, ri: number) => (
                    <div key={ri} className="border-l-2 border-[hsl(var(--nav-theme)/0.4)] pl-3">
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 mb-1">
                        <p className="font-semibold text-sm">{r.item}</p>
                        <div className="flex flex-wrap gap-1">
                          {r.platforms?.map((p: string, pi: number) => (
                            <span
                              key={pi}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border border-border text-xs text-muted-foreground"
                            >
                              <Tag className="w-2.5 h-2.5" />
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                      {r.specs?.length > 0 ? (
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-sm">
                          {r.specs.map((s: any, si: number) => (
                            <div key={si} className="flex justify-between gap-2 py-0.5 border-b border-border/50">
                              <dt className="text-muted-foreground whitespace-nowrap">{s.label}</dt>
                              <dd className="font-medium text-right">{s.value}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : (
                        <p className="text-sm text-muted-foreground">{r.details}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* 广告位 5: 页脚前 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/ktfamily"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/DeadOrAlive/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/user/TecmoKoeiAmerica"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/4144680/DEAD_OR_ALIVE_6_Last_Round/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
