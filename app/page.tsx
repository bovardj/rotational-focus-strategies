"use client";

import { ArrowRightIcon, ArrowsPointingOutIcon, ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import RFSLogo from "@/app/ui/rfs-logo";

const screenshots = [
  { src: "/images/landing/rfs-dashboard-start.jpeg", alt: "RFS dashboard home screen" },
  { src: "/images/landing/rfs-dashboard-daily-1of4.jpeg", alt: "Dashboard during day 1 of the focus strategy phase" },
  { src: "/images/landing/rfs-survey-daily.jpeg", alt: "Daily survey form" },
];

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

export default function Page() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; panX: number; panY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const clampPan = (px: number, py: number, currentZoom: number) => {
    if (!containerRef.current) return { x: px, y: py };
    const { width: elW, height: elH } = containerRef.current.getBoundingClientRect();
    // Default to full container size; narrow to actual image content if natural dims are available
    let contentW = elW;
    let contentH = elH;
    const img = imgRef.current;
    if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
      const scale = Math.min(elW / img.naturalWidth, elH / img.naturalHeight);
      contentW = img.naturalWidth * scale;
      contentH = img.naturalHeight * scale;
    }
    const maxX = contentW * (currentZoom - 1) / (2 * currentZoom);
    const maxY = contentH * (currentZoom - 1) / (2 * currentZoom);
    return { x: Math.max(-maxX, Math.min(maxX, px)), y: Math.max(-maxY, Math.min(maxY, py)) };
  };

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  useEffect(() => {
    if (activeIndex !== null) {
      closeButtonRef.current?.focus();
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setZoom(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
    return () => { document.documentElement.style.overflow = ""; };
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") setActiveIndex(i => i !== null ? (i + 1) % screenshots.length : null);
      if (e.key === "ArrowLeft") setActiveIndex(i => i !== null ? (i - 1 + screenshots.length) % screenshots.length : null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex]);

  const handleZoomIn = () => setZoom(z => Math.min(z + ZOOM_STEP, MAX_ZOOM));
  const handleZoomOut = () => setZoom(z => {
    const next = Math.max(z - ZOOM_STEP, MIN_ZOOM);
    if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
    else setPan(prev => clampPan(prev.x, prev.y, next));
    return next;
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= MIN_ZOOM) return;
    setIsDragging(true);
    dragStartRef.current = { mouseX: e.clientX, mouseY: e.clientY, panX: pan.x, panY: pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    setPan(clampPan(dragStartRef.current.panX + dx / zoom, dragStartRef.current.panY + dy / zoom, zoom));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-white focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-10 bg-blue-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="w-28">
            <RFSLogo className="text-white" />
          </div>
          <nav aria-label="Main navigation" className="flex items-center gap-4">
            <a
              href="https://github.com/bovardj/rotational-focus-strategies"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded text-sm font-medium text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
            >
              GitHub<span className="sr-only"> (opens in new tab)</span>
            </a>
            <Link
              href="/sign-in"
              className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="min-h-screen overflow-x-hidden bg-blue-50">
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="relative overflow-clip px-6 py-24 text-center">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/80 blur-3xl" />
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-800">
              Designing Digital Health Systems · Course Project
            </p>
            <h1 id="hero-heading" className={`${lusitana.className} mb-6 text-5xl font-bold text-gray-900`}>
              Rotational Focus<br />Strategies
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-gray-700">
              A full-stack research web app designed to test whether randomly rotating focus strategies
              improves daily productivity and satisfaction for people with ADHD. Preceded by a
              3-day pilot using rapid iterative prototyping to refine the study design.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/sign-up"
                className="flex items-center gap-2 rounded-lg bg-blue-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2"
              >
                Create account <ArrowRightIcon className="w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/sign-in"
                aria-label="Sign in to your account"
                className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section aria-labelledby="overview-heading" className="px-6 pb-16">
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-xl shadow-blue-100/60">
            <h2 id="overview-heading" className={`${lusitana.className} mb-6 text-2xl font-bold text-gray-900`}>
              How the study worked
            </h2>

            {/* Phase timeline */}
            <div className="mb-6 flex flex-col overflow-hidden rounded-xl sm:flex-row">
              <div className="bg-blue-100/50 px-4 py-4 sm:flex-5">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-800">
                  Baseline · 3 days
                </p>
                <p className="text-sm text-gray-600">
                  Daily surveys with no assigned strategy. This established each participant&apos;s baseline.
                </p>
              </div>
              <div className="bg-blue-200/60 px-4 py-4 sm:flex-9">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-800">
                  Daily Focus · 4 days
                </p>
                <p className="text-sm text-gray-700">
                  Use a randomly assigned strategy each day (repeats allowed), then fill out end of day surveys. This tested whether strategy rotation improves outcomes.
                </p>
              </div>
              <div className="bg-blue-900 px-4 py-4 sm:flex-4">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-100">
                  Exit
                </p>
                <p className="text-sm text-blue-200">
                  A reflection survey along with demographic data collection.
                </p>
              </div>
            </div>

            {/* Screenshots */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setActiveIndex(0)}
                className="group relative aspect-video w-full overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2"
                aria-label={`View full screenshot: ${screenshots[0].alt}`}
              >
                <Image src={screenshots[0].src} alt="" fill className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.01]" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/20">
                  <ArrowsPointingOutIcon className="h-8 w-8 text-white opacity-0 drop-shadow transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true" />
                </div>
              </button>
              <div className="grid grid-cols-2 gap-3">
                {screenshots.slice(1).map((s, i) => (
                  <button
                    key={s.src}
                    onClick={() => setActiveIndex(i + 1)}
                    className="group relative aspect-video overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2"
                    aria-label={`View full screenshot: ${s.alt}`}
                  >
                    <Image src={s.src} alt="" fill className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.01]" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/20">
                      <ArrowsPointingOutIcon className="h-6 w-6 text-white opacity-0 drop-shadow transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature highlights */}
        <section aria-labelledby="features-heading" className="px-6 pb-16">
          <h2 id="features-heading" className="sr-only">Key features</h2>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-blue-100/60">
              <div className="mb-3 text-2xl" aria-hidden="true">🔄</div>
              <h3 className="mb-2 text-base font-bold text-gray-900">Rotation algorithm</h3>
              <p className="text-sm text-gray-600">
                Randomly assigns a focus strategy each day &mdash; designed to test whether
                rotating strategies drives changes in productivity and satisfaction.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-blue-100/60">
              <div className="mb-3 text-2xl" aria-hidden="true">🔔</div>
              <h3 className="mb-2 text-base font-bold text-gray-900">Push notifications + PWA</h3>
              <p className="text-sm text-gray-600">
                Service worker, installable on mobile, with scheduled Web Push reminders to
                complete daily surveys.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-blue-100/60">
              <div className="mb-3 text-2xl" aria-hidden="true">🔐</div>
              <h3 className="mb-2 text-base font-bold text-gray-900">Clerk + Supabase RLS</h3>
              <p className="text-sm text-gray-600">
                Clerk JWTs injected as Supabase access tokens &mdash; row-level security enforces
                per-user data isolation without custom middleware.
              </p>
            </div>
          </div>
        </section>

        {/* Stack + CTA */}
        <section aria-labelledby="stack-heading" className="px-6 pb-16">
          <div className="mx-auto max-w-4xl rounded-2xl bg-blue-900 px-8 py-8">
            <p id="stack-heading" className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-200">
              Built with
            </p>
            <div className="mb-6 flex flex-wrap gap-2">
              {[
                "Next.js 16 App Router",
                "Tailwind v4",
                "Clerk Auth",
                "Supabase + RLS",
                "Web Push API",
                "PWA",
                "Vercel",
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-white/10 px-3 py-1 text-xs font-semibold text-white"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-blue-200">Want to explore the app?</p>
              <Link
                href="/sign-up"
                className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-900 transition-colors hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
              >
                Get started <ArrowRightIcon className="w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Screenshot lightbox */}
      {activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Screenshot viewer"
          className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveIndex(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setActiveIndex(i => i !== null ? (i - 1 + screenshots.length) % screenshots.length : null); }}
            className="shrink-0 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Previous screenshot"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>

          <div
            ref={containerRef}
            className="relative mx-4 w-[80vw] animate-scale-in overflow-hidden rounded-xl"
            style={{ cursor: zoom > MIN_ZOOM ? (isDragging ? "grabbing" : "grab") : "default" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={(e) => { if (e.deltaY < 0) handleZoomIn(); else handleZoomOut(); }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              ref={imgRef}
              src={screenshots[activeIndex].src}
              alt={screenshots[activeIndex].alt}
              width={1920}
              height={1080}
              className="h-auto max-h-[85vh] w-full select-none object-contain"
              style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`, transformOrigin: "center", transition: isDragging ? "none" : "transform 0.15s ease-out" }}
              draggable={false}
              sizes="80vw"
            />

            {/* Close */}
            <button
              ref={closeButtonRef}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setActiveIndex(null)}
              className="absolute right-3 top-3 rounded-full bg-black/50 p-1.5 text-white transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close screenshot viewer"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            {/* Bottom bar: zoom controls + counter */}
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
              <div className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-1">
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={handleZoomOut}
                  disabled={zoom <= MIN_ZOOM}
                  className="rounded-full p-1 text-white transition-colors hover:bg-white/20 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                  aria-label="Zoom out"
                >
                  <MagnifyingGlassMinusIcon className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-xs text-white">{Math.round(zoom * 100)}%</span>
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={handleZoomIn}
                  disabled={zoom >= MAX_ZOOM}
                  className="rounded-full p-1 text-white transition-colors hover:bg-white/20 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                  aria-label="Zoom in"
                >
                  <MagnifyingGlassPlusIcon className="h-4 w-4" />
                </button>
              </div>
              <p className="rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                {activeIndex + 1} / {screenshots.length}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setActiveIndex(i => i !== null ? (i + 1) % screenshots.length : null); }}
            className="shrink-0 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Next screenshot"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
