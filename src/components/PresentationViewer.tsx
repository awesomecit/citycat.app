import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Play, Pause, Maximize2, Minimize2, X, Download,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const TOTAL_SLIDES = 15;
const SLIDES = Array.from({ length: TOTAL_SLIDES }, (_, i) => ({
  src: `/slides/slide-${String(i + 1).padStart(2, "0")}.jpg`,
  num: i + 1,
}));

const AUTO_INTERVAL = 5000;

interface PresentationViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PresentationViewer = ({ open, onOpenChange }: PresentationViewerProps) => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % TOTAL_SLIDES);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + TOTAL_SLIDES) % TOTAL_SLIDES);
  }, []);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || !open) return;
    const id = setInterval(next, AUTO_INTERVAL);
    return () => clearInterval(id);
  }, [autoPlay, open, next]);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, next, prev, onOpenChange]);

  // Reset on open
  useEffect(() => {
    if (open) { setCurrent(0); setAutoPlay(false); }
  }, [open]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setFullscreen(false));
    }
  };

  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-w-5xl flex-col gap-0 overflow-hidden p-0 sm:rounded-2xl">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
          <span className="text-sm font-bold text-foreground">
            City Cat OS — {t("presentation.slideOf", { current: current + 1, total: TOTAL_SLIDES })}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-secondary"
              title={autoPlay ? t("presentation.pause") : t("presentation.play")}
            >
              {autoPlay ? <Pause className="h-4 w-4 text-foreground" /> : <Play className="h-4 w-4 text-foreground" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-secondary"
              title={t("presentation.fullscreen")}
            >
              {fullscreen ? <Minimize2 className="h-4 w-4 text-foreground" /> : <Maximize2 className="h-4 w-4 text-foreground" />}
            </button>
            <a
              href="/docs/City_Cat_OS.pdf"
              download
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-secondary"
              title={t("presentation.downloadPdf")}
            >
              <Download className="h-4 w-4 text-foreground" />
            </a>
            <button
              onClick={() => onOpenChange(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-secondary"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Slide area */}
        <div className="relative flex flex-1 items-center justify-center bg-muted/30 overflow-hidden">
          {/* Prev */}
          <button
            onClick={prev}
            className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 shadow-md backdrop-blur-sm transition-colors hover:bg-card"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>

          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={SLIDES[current].src}
              alt={`Slide ${current + 1}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="max-h-full max-w-full object-contain"
              draggable={false}
            />
          </AnimatePresence>

          {/* Next */}
          <button
            onClick={next}
            className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 shadow-md backdrop-blur-sm transition-colors hover:bg-card"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Thumbnails strip */}
        <div className="flex gap-1.5 overflow-x-auto border-t border-border bg-card px-3 py-2">
          {SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                i === current ? "border-primary shadow-md" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={s.src}
                alt={`Thumb ${i + 1}`}
                className="h-12 w-20 object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1 bg-card pb-3 pt-1">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PresentationViewer;
