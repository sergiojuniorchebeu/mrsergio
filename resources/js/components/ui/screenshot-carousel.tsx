// components/ui/screenshot-carousel.tsx
// Carousel de grandes cards 3D style Aceternity — aucune dépendance externe sauf framer-motion

"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ScreenshotCard {
  src: string
  title: string
  category: string
}

interface ScreenshotCarouselProps {
  cards: ScreenshotCard[]
  className?: string
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const CARD_WIDTH  = 520   // largeur d'une card
const CARD_HEIGHT = 320   // hauteur de l'image dans la card
const CARD_GAP    = 24
const CARD_STEP   = CARD_WIDTH + CARD_GAP

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  cards,
  activeIndex,
  onClose,
  onJump,
}: {
  cards: ScreenshotCard[]
  activeIndex: number
  onClose: () => void
  onJump: (i: number) => void
}) {
  const prev = () => onJump((activeIndex - 1 + cards.length) % cards.length)
  const next = () => onJump((activeIndex + 1) % cards.length)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", onKey)
    }
  })

  const card = cards[activeIndex]

  return (
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        className="relative z-10 w-full max-w-5xl flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{ background: "rgba(12, 18, 28, 0.90)", backdropFilter: "blur(28px)" }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex gap-1.5">
              {[0,1,2].map(i => <div key={i} className="w-3 h-3 rounded-full bg-white/10" />)}
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/10" />
            <span className="text-sm font-semibold text-white/80">{card.title}</span>
            <span className="text-xs text-white/35">— {card.category}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/30 hidden sm:inline">← → naviguer · ESC fermer</span>
            <button type="button" onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Fermer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex items-center justify-center bg-black/20">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={card.src}
              alt={`${card.title} — ${card.category}`}
              className="max-h-[72vh] w-auto max-w-full object-contain select-none"
              draggable={false}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </AnimatePresence>

          {cards.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-white/25 text-white/70 hover:text-white flex items-center justify-center transition-all group"
                aria-label="Précédent"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-white/25 text-white/70 hover:text-white flex items-center justify-center transition-all group"
                aria-label="Suivant"
              >
                <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {cards.length > 1 && (
          <div className="px-5 py-3.5 border-t border-white/[0.08]" style={{ background: "rgba(6,10,18,0.6)" }}>
            <div className="w-full h-px bg-white/10 rounded-full mb-3 overflow-hidden">
              <motion.div
                className="h-full bg-teal-400/70 rounded-full"
                animate={{ width: `${((activeIndex + 1) / cards.length) * 100}%` }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              {cards.map((c, i) => (
                <motion.button key={i} type="button" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
                  onClick={() => onJump(i)}
                  className={cn(
                    "relative flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200",
                    i === activeIndex
                      ? "border-teal-400/80 shadow-lg shadow-teal-500/20"
                      : "border-white/10 hover:border-white/25 opacity-50 hover:opacity-80",
                  )}
                  aria-label={`Capture ${i + 1}`}
                >
                  <img src={c.src} alt="" className="h-12 w-20 object-cover" loading="lazy" />
                  <div className="absolute bottom-1 right-1">
                    <span className="text-[9px] font-bold text-white/70 bg-black/40 px-1.5 py-0.5 rounded tabular-nums">{i + 1}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ─── Card 3D individuelle ─────────────────────────────────────────────────────
function Card3D({
  card,
  index,
  isActive,
  onActivate,
  onOpenLightbox,
}: {
  card: ScreenshotCard
  index: number
  isActive: boolean
  onActivate: () => void
  onOpenLightbox: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const scale   = useMotionValue(isActive ? 1 : 0.9)

  // Met à jour le scale quand isActive change
  useEffect(() => {
    animate(scale, isActive ? 1 : 0.88, { duration: 0.4, ease: [0.22, 1, 0.36, 1] })
  }, [isActive, scale])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    rotateX.set(-dy * 12)
    rotateY.set(dx * 12)
  }

  const onMouseLeave = () => {
    animate(rotateX, 0, { duration: 0.5, ease: [0.22, 1, 0.36, 1] })
    animate(rotateY, 0, { duration: 0.5, ease: [0.22, 1, 0.36, 1] })
  }

  const handleClick = () => {
    if (!isActive) { onActivate(); return }
    onOpenLightbox()
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative flex-shrink-0 cursor-pointer select-none"
      style={{ width: CARD_WIDTH, scale, perspective: 1000 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      whileTap={{ scale: isActive ? 0.98 : 0.92 }}
    >
      <motion.div
        className={cn(
          "relative rounded-2xl overflow-hidden border bg-white",
          "transition-shadow duration-300",
          isActive
            ? "border-teal-200/80 shadow-2xl shadow-teal-500/15"
            : "border-slate-200/60 shadow-lg shadow-slate-200/80",
        )}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* ── Image principale ── */}
        <div
          className="overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50"
          style={{ height: CARD_HEIGHT }}
        >
          <motion.img
            src={card.src}
            alt={`${card.title} — ${card.category}`}
            className="w-full h-full object-cover"
            loading="lazy"
            animate={{ scale: isActive ? 1.03 : 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Overlay dégradé bas */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none"
            animate={{ opacity: isActive ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* ── Footer card ── */}
        <div
          className={cn(
            "px-5 py-4 flex items-center justify-between",
            "border-t",
            isActive ? "border-teal-100 bg-white" : "border-slate-100 bg-slate-50",
          )}
          style={{ transform: "translateZ(0)" }}
        >
          {/* Catégorie + titre */}
          <motion.div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
            <p className={cn("text-[11px] font-semibold uppercase tracking-widest mb-0.5", isActive ? "text-teal-500" : "text-slate-400")}>
              {card.category}
            </p>
            <p className="text-sm font-semibold text-slate-700 truncate max-w-[260px]">
              {card.title}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
            <AnimatePresence>
              {isActive ? (
                <motion.button
                  key="open"
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onOpenLightbox() }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-700 px-4 py-2 rounded-xl transition-colors shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Voir en grand
                </motion.button>
              ) : (
                <motion.span
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-slate-400 font-medium"
                >
                  Cliquer pour voir →
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Composant principal ──────────────────────────────────────────────────────
export function ScreenshotCarousel({ cards, className }: ScreenshotCarouselProps) {
  const trackRef        = useRef<HTMLDivElement>(null)
  const x               = useMotionValue(0)
  const isDragging      = useRef(false)
  const dragStartX      = useRef(0)
  const dragStartMotionX = useRef(0)

  const [activeIndex,   setActiveIndex]   = useState(0)
  const [lightboxOpen,  setLightboxOpen]  = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const maxOffset = -(cards.length - 1) * CARD_STEP

  const snapTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(cards.length - 1, index))
    setActiveIndex(clamped)
    animate(x, -clamped * CARD_STEP, { type: "spring", stiffness: 280, damping: 32 })
  }, [cards.length, x])

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = false
    dragStartX.current = e.clientX
    dragStartMotionX.current = x.get()
    trackRef.current?.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!trackRef.current?.hasPointerCapture(e.pointerId)) return
    const delta = e.clientX - dragStartX.current
    if (Math.abs(delta) > 5) isDragging.current = true
    x.set(Math.max(maxOffset - 50, Math.min(50, dragStartMotionX.current + delta)))
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (!trackRef.current?.hasPointerCapture(e.pointerId)) return
    trackRef.current?.releasePointerCapture(e.pointerId)
    if (!isDragging.current) return
    const delta = e.clientX - dragStartX.current
    const threshold = CARD_STEP * 0.25
    if (delta < -threshold) snapTo(activeIndex + 1)
    else if (delta > threshold) snapTo(activeIndex - 1)
    else snapTo(activeIndex)
  }

  const openLightbox  = useCallback((i: number) => { setLightboxIndex(i); setLightboxOpen(true) }, [])
  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  if (cards.length === 0) return null

  return (
    <div className={cn("w-full", className)}>
      {/* ── Track ── */}
      <div className="relative overflow-hidden">
        {/* Fades latéraux */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div
          ref={trackRef}
          className="flex cursor-grab active:cursor-grabbing py-8 px-12"
          style={{ x, gap: CARD_GAP }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {cards.map((card, i) => (
            <Card3D
              key={`${card.src}-${i}`}
              card={card}
              index={i}
              isActive={i === activeIndex}
              onActivate={() => snapTo(i)}
              onOpenLightbox={() => openLightbox(i)}
            />
          ))}
        </motion.div>
      </div>

      {/* ── Contrôles ── */}
      <div className="flex items-center justify-center gap-4 mt-1 pb-4">
        <button type="button" onClick={() => snapTo(activeIndex - 1)} disabled={activeIndex === 0}
          className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center text-slate-600 shadow-sm hover:shadow transition-all group"
          aria-label="Précédent"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dots pill */}
        <div className="flex items-center gap-1.5">
          {cards.map((_, i) => (
            <button key={i} type="button" onClick={() => snapTo(i)} className="focus-visible:outline-none" aria-label={`Capture ${i + 1}`}>
              <motion.div
                className="rounded-full bg-teal-500"
                animate={{ width: i === activeIndex ? 22 : 6, height: 6, opacity: i === activeIndex ? 1 : 0.28 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </button>
          ))}
        </div>

        <button type="button" onClick={() => snapTo(activeIndex + 1)} disabled={activeIndex === cards.length - 1}
          className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center text-slate-600 shadow-sm hover:shadow transition-all group"
          aria-label="Suivant"
        >
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            cards={cards}
            activeIndex={lightboxIndex}
            onClose={closeLightbox}
            onJump={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </div>
  )
}