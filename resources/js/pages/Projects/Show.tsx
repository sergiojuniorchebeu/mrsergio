// resources/js/Pages/Projects/Show.tsx

import { Head, Link } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMemo, useState, useEffect, useCallback } from 'react'
import MainLayout from '@/layouts/MainLayout'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid'
import { cn, easings } from '@/lib/utils'
import type { ProjectShowProps } from '@/types'

// ─── Couleurs tags / plateformes ───────────────────────────────────────────────
const TAG_COLORS: Record<string, string> = {
  Laravel:    'bg-red-50 text-red-600 border-red-100',
  React:      'bg-sky-50 text-sky-600 border-sky-100',
  Flutter:    'bg-blue-50 text-blue-600 border-blue-100',
  TypeScript: 'bg-blue-50 text-blue-700 border-blue-100',
  MySQL:      'bg-orange-50 text-orange-600 border-orange-100',
  PostgreSQL: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  Firebase:   'bg-amber-50 text-amber-600 border-amber-100',
  Redis:      'bg-rose-50 text-rose-600 border-rose-100',
  Python:     'bg-yellow-50 text-yellow-700 border-yellow-100',
  Dart:       'bg-cyan-50 text-cyan-600 border-cyan-100',
}
const defaultTagColor = 'bg-slate-50 text-slate-600 border-slate-100'

const PLATFORM_COLORS: Record<string, string> = {
  Web:     'bg-slate-50 text-slate-700 border-slate-200',
  Android: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  iOS:     'bg-sky-50 text-sky-700 border-sky-100',
  Desktop: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  API:     'bg-amber-50 text-amber-700 border-amber-100',
}
const defaultPlatformColor = 'bg-slate-50 text-slate-700 border-slate-200'

// ─── Icône photo générique ─────────────────────────────────────────────────────
function PhotoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18A2.25 2.25 0 0023.25 18V6A2.25 2.25 0 0021 3.75H3A2.25 2.25 0 00.75 6v12A2.25 2.25 0 003 20.25z" />
    </svg>
  )
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  shots,
  index,
  title,
  onClose,
  onJump,
}: {
  shots: string[]
  index: number
  title: string
  onClose: () => void
  onJump: (i: number) => void
}) {
  const prev = () => onJump((index - 1 + shots.length) % shots.length)
  const next = () => onJump((index + 1) % shots.length)

  useEffect(() => {
    const savedOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = savedOverflow
      window.removeEventListener('keydown', onKey)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  return (
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog" aria-modal="true"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
        onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        className="relative z-10 w-full max-w-5xl flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{ background: 'rgba(12,18,28,0.92)', backdropFilter: 'blur(28px)' }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex gap-1.5">
              {[0,1,2].map(i => <div key={i} className="w-3 h-3 rounded-full bg-white/10" />)}
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/10" />
            <span className="text-sm font-semibold text-white/80">{title}</span>
            <span className="text-xs text-white/35">— capture {index + 1} / {shots.length}</span>
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
              key={index}
              src={shots[index]}
              alt={`${title} — capture ${index + 1}`}
              className="max-h-[72vh] w-auto max-w-full object-contain select-none"
              draggable={false}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </AnimatePresence>

          {shots.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-white/25 text-white/70 hover:text-white flex items-center justify-center transition-all group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-white/25 text-white/70 hover:text-white flex items-center justify-center transition-all group"
              >
                <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {shots.length > 1 && (
          <div className="px-5 py-3.5 border-t border-white/[0.08]" style={{ background: 'rgba(6,10,18,0.6)' }}>
            <div className="w-full h-px bg-white/10 rounded-full mb-3 overflow-hidden">
              <motion.div
                className="h-full bg-teal-400/70 rounded-full"
                animate={{ width: `${((index + 1) / shots.length) * 100}%` }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              {shots.map((src, i) => (
                <motion.button key={i} type="button"
                  whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
                  onClick={() => onJump(i)}
                  className={cn(
                    'relative flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200',
                    i === index
                      ? 'border-teal-400/80 shadow-lg shadow-teal-500/20'
                      : 'border-white/10 hover:border-white/25 opacity-50 hover:opacity-80',
                  )}
                >
                  <img src={src} alt="" className="h-12 w-20 object-cover" loading="lazy" />
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

// ─── Layout bento selon le nombre de captures ─────────────────────────────────
// On assigne des col-span / row-span différents selon la position
function getBentoClass(index: number, total: number): string {
  if (total === 1) return 'col-span-3'
  if (total === 2) return index === 0 ? 'col-span-2' : 'col-span-1'
  if (total === 3) {
    if (index === 0) return 'col-span-2'
    return 'col-span-1'
  }
  if (total === 4) {
    if (index === 0) return 'col-span-2'
    if (index === 1) return 'col-span-1'
    return 'col-span-1'
  }
  // 5+: alternance featured / normal
  const patterns = ['col-span-2', 'col-span-1', 'col-span-1', 'col-span-1', 'col-span-2']
  return patterns[index % patterns.length] ?? 'col-span-1'
}

// ─── Page principale ───────────────────────────────────────────────────────────
export default function Show({ project, related }: ProjectShowProps) {
  const repoDisabled = project.private_repo || !project.github_url
  const shots = useMemo(() => project.screenshots ?? [], [project.screenshots])

  const [lightboxOpen,  setLightboxOpen]  = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox  = useCallback((i: number) => { setLightboxIndex(i); setLightboxOpen(true) }, [])
  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  return (
    <MainLayout>
      <Head title={`${project.title} — Sergio Junior Chebeu`} />

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-surface-card border-b border-slate-200/60">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container-main relative z-10 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: easings.smooth }}
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-teal-600 transition-colors mb-8 group"
            >
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Retour aux projets
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Infos gauche */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easings.smooth, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className={cn('text-xs font-medium px-2.5 py-1 rounded-lg border', TAG_COLORS[tag] ?? defaultTagColor)}>
                    {tag}
                  </span>
                ))}
              </div>

              {project.platforms?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.platforms.map((pl) => (
                    <span key={pl} className={cn('text-xs font-medium px-2.5 py-1 rounded-lg border', PLATFORM_COLORS[pl] ?? defaultPlatformColor)}>
                      {pl}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink-primary tracking-tight leading-tight">
                {project.title}
              </h1>

              <p className="text-lg text-ink-secondary leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {!repoDisabled ? (
                  <a href={project.github_url!} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors duration-200"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    Voir le code
                  </a>
                ) : (
                  <button type="button" disabled
                    title={project.private_repo ? 'Repo privé' : 'Repo non disponible'}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 text-slate-500 text-sm font-semibold cursor-not-allowed border border-slate-300"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    {project.private_repo ? 'Repo privé' : 'Repo indisponible'}
                  </button>
                )}

                {project.demo_url && (
                  <a href={project.demo_url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors duration-200 shadow-sm shadow-teal-500/20"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Voir la démo
                  </a>
                )}
              </div>
            </motion.div>

            {/* Image droite */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: easings.smooth, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 aspect-video shadow-xl shadow-slate-200/60 border border-slate-200/60"
            >
              {project.image_url ? (
                <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-400">Pas d'image disponible</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Contenu Markdown ────────────────────────────────────────── */}
      {project.content && (
        <section className="container-main py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easings.smooth, delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <div className="prose prose-slate prose-headings:font-display prose-headings:text-ink-primary prose-a:text-teal-600 prose-strong:text-ink-primary max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm text-ink-secondary leading-relaxed bg-transparent p-0 border-0">
                {project.content.trim()}
              </pre>
            </div>
          </motion.div>
        </section>
      )}

      {/* ── Captures — Bento Grid ────────────────────────────────────── */}
      {shots.length > 0 && (
        <section className="container-main pb-16 sm:pb-20">
          <div className="max-w-5xl mx-auto">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easings.smooth }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200" />
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-[0.2em]">
                  Captures d'écran
                </p>
                <span className="text-[10px] font-bold text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full tabular-nums">
                  {shots.length}
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200" />
            </motion.div>

            {/* BentoGrid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easings.smooth, delay: 0.15 }}
            >
              <BentoGrid className="auto-rows-[18rem]">
                {shots.map((src, i) => (
                  <BentoCard
                    key={`${src}-${i}`}
                    name={`Capture ${i + 1}`}
                    className={cn(getBentoClass(i, shots.length), 'cursor-pointer')}
                    background={
                      <div className="absolute inset-0 overflow-hidden">
                        <img
                          src={src}
                          alt={`${project.title} — capture ${i + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* gradient pour lisibilité du texte bas */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      </div>
                    }
                    Icon={PhotoIcon}
                    description={project.title}
                    href="#"
                    cta="Voir en grand"
                    onClick={(e) => {
                      e.preventDefault()
                      openLightbox(i)
                    }}
                  />
                ))}
              </BentoGrid>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Projets similaires ───────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-slate-200/60 bg-surface-card">
          <div className="container-main py-12 sm:py-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-slate-200" />
              <p className="text-xs font-medium text-ink-muted uppercase tracking-[0.2em] whitespace-nowrap">
                Autres projets
              </p>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <ProjectCard key={p.id} project={p as any} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Lightbox ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            shots={shots}
            index={lightboxIndex}
            title={project.title}
            onClose={closeLightbox}
            onJump={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </MainLayout>
  )
}