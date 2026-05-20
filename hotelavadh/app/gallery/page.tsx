"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// ─── DATA ────────────────────────────────────────────────────────────────────

type GalleryItem = {
  id: number;
  src: string;
  alt: string;
  category: "rooms" | "dining" | "banquet" | "exterior";
  span?: "tall" | "wide" | "normal";
};

const items: GalleryItem[] = [
  { id: 1,  src: "/gallery/rooms-1.jpg",    alt: "Deluxe Room",           category: "rooms",    span: "tall" },
  { id: 2,  src: "/gallery/rooms-2.jpg",    alt: "Suite bedroom",         category: "rooms",    span: "normal" },
  { id: 3,  src: "/gallery/rooms-3.jpg",    alt: "Premium Room",          category: "rooms",    span: "normal" },
  { id: 4,  src: "/gallery/rooms-4.jpg",    alt: "Room bathroom",         category: "rooms",    span: "wide" },
  { id: 5,  src: "/gallery/dining-1.jpg",   alt: "Restaurant interior",   category: "dining",   span: "wide" },
  { id: 6,  src: "/gallery/dining-2.jpg",   alt: "Dal Makhani",           category: "dining",   span: "normal" },
  { id: 7,  src: "/gallery/dining-3.jpg",   alt: "Thali spread",          category: "dining",   span: "tall" },
  { id: 8,  src: "/gallery/dining-4.jpg",   alt: "Dessert platter",       category: "dining",   span: "normal" },
  { id: 9,  src: "/gallery/banquet-1.jpg",  alt: "Banquet hall setup",    category: "banquet",  span: "wide" },
  { id: 10, src: "/gallery/banquet-2.jpg",  alt: "Wedding ceremony",      category: "banquet",  span: "tall" },
  { id: 11, src: "/gallery/banquet-3.jpg",  alt: "Stage decoration",      category: "banquet",  span: "normal" },
  { id: 12, src: "/gallery/banquet-4.jpg",  alt: "Corporate event",       category: "banquet",  span: "normal" },
  { id: 13, src: "/gallery/ext-1.jpg",      alt: "Hotel facade",          category: "exterior", span: "wide" },
  { id: 14, src: "/gallery/ext-2.jpg",      alt: "Hotel entrance",        category: "exterior", span: "normal" },
  { id: 15, src: "/gallery/ext-3.jpg",      alt: "Lobby area",            category: "exterior", span: "tall" },
  { id: 16, src: "/gallery/ext-4.jpg",      alt: "Hotel at night",        category: "exterior", span: "normal" },
];

const filters = [
  { id: "all",      label: "All" },
  { id: "rooms",    label: "Rooms" },
  { id: "dining",   label: "Dining" },
  { id: "banquet",  label: "Banquet" },
  { id: "exterior", label: "Exterior" },
] as const;

type FilterId = typeof filters[number]["id"];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function GalleryPage() {
  const [active, setActive] = useState<FilterId>("all");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const visible = active === "all" ? items : items.filter((i) => i.category === active);

  return (
    <div className="space-y-16">

      {/* ── HERO ── */}
      <div className="space-y-5 pt-2">
        <Badge
          variant="outline"
          className="rounded-full px-4 py-1 text-xs tracking-[0.18em] uppercase font-medium border-stone-300 text-stone-600 bg-stone-50"
        >
          Gallery
        </Badge>

        <h1
          className="text-4xl md:text-6xl font-light tracking-tight leading-[1.1]"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Glimpses of
          <br />
          <span className="italic text-muted-foreground">Hotel Avadh</span>
        </h1>

        <p className="text-muted-foreground max-w-xl leading-relaxed text-base md:text-lg">
          From elegantly appointed rooms to grand banquet setups and soulful
          dining — a visual tour of everything we offer.
        </p>
      </div>

      {/* ── FILTERS ── */}
      <div className="space-y-8">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActive(f.id)}
              className={[
                "rounded-full px-4 py-1.5 text-xs font-medium transition border",
                active === f.id
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted-foreground border-border/60 hover:border-foreground/30 hover:text-foreground",
              ].join(" ")}
            >
              {f.label}
              <span className="ml-1.5 opacity-50">
                {f.id === "all" ? items.length : items.filter((i) => i.category === f.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* ── MASONRY GRID ── */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {visible.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightbox(item)}
              className={[
                "group relative w-full break-inside-avoid rounded-2xl overflow-hidden bg-muted border border-border/40 cursor-zoom-in",
                item.span === "tall"   ? "aspect-[3/4]" :
                item.span === "wide"   ? "aspect-[4/3]" :
                                         "aspect-square",
              ].join(" ")}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />

              {/* overlay on hover */}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-all duration-300" />

              {/* caption */}
              <div className="absolute bottom-0 left-0 right-0 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 px-3 pb-3">
                <span className="inline-block rounded-full bg-background/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-foreground">
                  {item.alt}
                </span>
              </div>
            </div>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="py-20 text-center text-muted-foreground text-sm">
            No photos in this category yet.
          </div>
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.src}
              alt={lightbox.alt}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[85vh] object-contain bg-black"
            />
            {/* caption bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-5 py-3 flex items-center justify-between">
              <span className="text-white/80 text-sm">{lightbox.alt}</span>
              <button
                onClick={() => setLightbox(null)}
                className="text-white/60 hover:text-white text-xs uppercase tracking-widest transition"
              >
                Close ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <div className="rounded-3xl bg-foreground text-background px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-background/50 mb-2">
            Like what you see?
          </p>
          <h3
            className="text-2xl md:text-3xl font-light leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Come experience it
            <br />
            <span className="italic">in person.</span>
          </h3>
        </div>
        <a
          href="/contact"
          className="shrink-0 self-start md:self-auto inline-flex items-center gap-2 rounded-full bg-background text-foreground px-8 py-3 text-sm font-medium hover:bg-background/90 transition"
        >
          Get in Touch →
        </a>
      </div>

    </div>
  );
}