"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { useLocaleContext } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

const MdxGalleryContext = createContext(false);

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement>;

/** Горизонтальная лента превью: в ряд помещается ~2–3 карточки в зависимости от ширины колонки. */
export function ArticleGallery({ children }: { children: ReactNode }) {
  return (
    <MdxGalleryContext.Provider value={true}>
      <div
        className={cn(
          "not-prose my-4 flex w-full max-w-full flex-nowrap gap-3 overflow-x-auto overflow-y-hidden py-1 [-webkit-overflow-scrolling:touch]",
          "snap-x snap-mandatory",
          /* MDX кладёт каждую картинку в <p> — делаем их «слайдами» */
          /* ~+25% к прежнему clamp(11rem,42%,20rem) */
          "[&>p]:m-0 [&>p]:shrink-0 [&>p]:snap-start [&>p]:min-w-[clamp(13.75rem,52.5%,25rem)]",
        )}
      >
        {children}
      </div>
    </MdxGalleryContext.Provider>
  );
}

export function MdxImage({ className, alt, src, ...props }: ImgProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { messages: m } = useLocaleContext();
  const labelId = useId();
  const inGallery = useContext(MdxGalleryContext);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  const overlay =
    open && mounted ? (
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        onClick={close}
      >
        <span id={labelId} className="sr-only">
          {alt || m.mdxImageLightboxDialog}
        </span>
        <button
          type="button"
          className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur-sm hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            close();
          }}
        >
          {m.mdxImageLightboxClose}
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element -- fullscreen lightbox */}
        <img
          src={typeof src === "string" ? src : undefined}
          alt={alt ?? ""}
          className="max-h-[min(100dvh,100vh)] max-w-full cursor-zoom-out object-contain"
          onClick={close}
        />
      </div>
    ) : null;

  return (
    <>
      <button
        type="button"
        className={cn(
          "inline-block border-0 bg-transparent p-0 text-left",
          inGallery ? "h-full w-full" : "max-w-full",
        )}
        onClick={() => setOpen(true)}
        aria-label={m.mdxImageLightboxOpen}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- MDX body */}
        <img
          {...props}
          src={src}
          alt={alt ?? ""}
          className={cn(
            inGallery
              ? "my-0 block h-auto max-h-[16.25rem] w-full cursor-zoom-in rounded-lg border border-zinc-200 object-contain dark:border-zinc-800"
              : "my-8 block h-auto max-h-[min(92vh,1200px)] w-auto max-w-full cursor-zoom-in rounded-xl border border-zinc-200 object-contain dark:border-zinc-800",
            className,
          )}
          loading="lazy"
        />
      </button>
      {mounted && overlay ? createPortal(overlay, document.body) : null}
    </>
  );
}
