"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Play, Volume2 } from "lucide-react";

type PlayState = "idle" | "auto" | "manual";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

const buildEmbed = (videoId: string, muted: boolean) =>
  `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playsinline=1&rel=0&playlist=${videoId}`;

const watchUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;

/**
 * 三态 YouTube 播放器：
 * - idle：缩略图海报 + 播放按钮，等待视口进入或点击
 * - auto：进入视口（≥45%）后自动静音循环播放
 * - manual：用户点击后带声播放
 */
export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<PlayState>("idle");
  const [hasThumb, setHasThumb] = useState(true);

  // 视口进入 → 自动静音播放（仅 idle 时挂载观察器）
  useEffect(() => {
    if (state !== "idle") return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      // 不支持 IntersectionObserver 的环境直接进入自动播放
      setState("auto");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            setState("auto");
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: [0.45] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [state]);

  const muted = state !== "manual";

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {/* 无 JS 回退：基础静音自动播放 */}
        <noscript>
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src={buildEmbed(videoId, true)}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </noscript>

        {/* idle：缩略图海报 + 播放按钮 */}
        {state === "idle" && (
          <button
            type="button"
            aria-label={`Play ${title}`}
            onClick={() => setState("manual")}
            className="group absolute inset-0 h-full w-full"
          >
            {hasThumb && (
              <img
                src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                alt={title}
                onError={() => setHasThumb(false)}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/20">
              <span className="flex items-center gap-2 rounded-full bg-[hsl(var(--nav-theme))] px-5 py-3 text-sm font-semibold text-white shadow-lg">
                <Play className="h-5 w-5" />
                Play trailer
              </span>
            </span>
          </button>
        )}

        {/* auto / manual：播放 iframe（key 变化强制重载以切换静音） */}
        {state !== "idle" && (
          <iframe
            key={state}
            className="absolute top-0 left-0 h-full w-full"
            src={buildEmbed(videoId, muted)}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {state === "auto" && (
          <button
            type="button"
            onClick={() => setState("manual")}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/10"
          >
            <Volume2 className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
            Unmute
          </button>
        )}
        <a
          href={watchUrl(videoId)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
