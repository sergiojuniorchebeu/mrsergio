// resources/js/components/ui/Card.tsx
//
// Cards pro — border fine, hover précis, image grande.
// 3 variantes : ProjectCard · BlogCard · FormationCard
// Toutes partagent la même structure et la même logique de hover.

import { Link }  from '@inertiajs/react'
import { motion } from 'framer-motion'
import { cn }    from '@/lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card"
            className={cn(
                'rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm',
                className,
            )}
            {...props}
        />
    )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-header"
            className={cn('flex flex-col gap-1.5 p-6', className)}
            {...props}
        />
    )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-title"
            className={cn('font-display text-base font-semibold tracking-tight text-slate-900', className)}
            {...props}
        />
    )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-description"
            className={cn('text-sm leading-relaxed text-slate-500', className)}
            {...props}
        />
    )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-content"
            className={cn('p-6 pt-0', className)}
            {...props}
        />
    )
}

// ─── Icônes utilitaires ───────────────────────────────────────────────────────
const ArrowUpRight = ({ className }: { className?: string }) => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className={className}>
        <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)
const ClockIcon = ({ className }: { className?: string }) => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className={className}>
        <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
)
const BookIcon = ({ className }: { className?: string }) => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className={className}>
        <path d="M2 2.5C2 2.5 3.5 2 6 2s4 .5 4 .5V10s-1.5-.5-4-.5S2 10 2 10V2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M6 2v8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
)
const StarIcon = ({ className }: { className?: string }) => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden className={className}>
        <path d="M5 1l1.18 2.39L9 3.82 7 5.77l.47 2.73L5 7.25 2.53 8.5 3 5.77 1 3.82l2.82-.43L5 1z" />
    </svg>
)

// ─── Wrapper d'animation partagé ─────────────────────────────────────────────
function CardWrapper({ children, i }: { children: React.ReactNode; i: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, ease: [0.0, 0.0, 0.2, 1] as [number,number,number,number], delay: i * 0.07 }}
            className="h-full"
        >
            {children}
        </motion.div>
    )
}

// ─── Classe de base card ──────────────────────────────────────────────────────
const cardBase = cn(
    'group relative flex flex-col h-full',
    'bg-white rounded-2xl overflow-hidden',
    'border border-slate-100',
    'transition-all duration-300 ease-out',
    // Hover : élévation subtile + border teal
    'hover:-translate-y-1',
    'hover:border-teal-200/70',
    'hover:shadow-[0_8px_30px_rgba(0,0,0,0.08),0_2px_8px_rgba(29,158,117,0.06)]',
)

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
interface Project {
    slug:         string
    title:        string
    description?: string
    desc?:        string
    image_url?:   string
    image?:       string
    tags?:        string[]
    featured?:    boolean
}

export function ProjectCard({ p, i }: { p: Project; i: number }) {
    return (
        <CardWrapper i={i}>
            <Link href={`/projects/${p.slug}`} className="block h-full">
                <div className={cardBase}>
                    {/* Image */}
                    <div className="relative overflow-hidden bg-slate-50 aspect-[16/9] flex-shrink-0">
                        <img
                            src={p.image_url ?? p.image}
                            alt={p.title}
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        />
                        {/* Overlay gradient bas */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                        {/* Badge featured */}
                        {p.featured && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                                <StarIcon />
                                Featured
                            </div>
                        )}

                        {/* Tags en bas de l'image */}
                        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                            {p.tags?.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/35 backdrop-blur-sm text-white/90">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Contenu */}
                    <div className="flex flex-col flex-1 p-5">
                        <div className="flex-1 space-y-1.5">
                            <h3 className="text-[14px] font-semibold text-slate-900 group-hover:text-teal-700 transition-colors duration-200 leading-snug">
                                {p.title}
                            </h3>
                            <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2">
                                {p.description ?? p.desc}
                            </p>
                        </div>

                        {/* Footer card */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                            <span className="text-[11px] font-medium text-slate-400">Projet web</span>
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-600 group-hover:gap-1.5 transition-all duration-200">
                                Voir <ArrowUpRight />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </CardWrapper>
    )
}

// ─── BLOG CARD ────────────────────────────────────────────────────────────────
interface Post {
    slug:             string
    title:            string
    excerpt?:         string
    desc?:            string
    cover_image_url?: string
    image?:           string
    tags?:            string[]
    tag?:             string
    reading_time?:    string
    published_at?:    string
    date?:            string
}

export function BlogCard({ p, i }: { p: Post; i: number }) {
    const tags = p.tags ?? (p.tag ? [p.tag] : [])
    return (
        <CardWrapper i={i}>
            <Link href={`/blog/${p.slug}`} className="block h-full">
                <div className={cardBase}>
                    {/* Image */}
                    <div className="relative overflow-hidden bg-slate-50 aspect-[16/9] flex-shrink-0">
                        <img
                            src={p.cover_image_url ?? p.image}
                            alt={p.title}
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                        {/* Reading time */}
                        {p.reading_time && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/30 backdrop-blur-sm text-white/90 px-2 py-0.5 rounded-full text-[10px] font-medium">
                                <ClockIcon />
                                {p.reading_time}
                            </div>
                        )}

                        {/* Tags */}
                        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                            {tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/35 backdrop-blur-sm text-white/90">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Contenu */}
                    <div className="flex flex-col flex-1 p-5">
                        <div className="flex-1 space-y-1.5">
                            <h3 className="text-[14px] font-semibold text-slate-900 group-hover:text-teal-700 transition-colors duration-200 leading-snug">
                                {p.title}
                            </h3>
                            <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2">
                                {p.excerpt ?? p.desc}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                <ClockIcon />
                                <span>{p.published_at ?? p.date ?? '—'}</span>
                            </div>
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-600 group-hover:gap-1.5 transition-all duration-200">
                                Lire <ArrowUpRight />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </CardWrapper>
    )
}

// ─── FORMATION CARD ───────────────────────────────────────────────────────────
interface Formation {
    slug:               string
    title:              string
    excerpt?:           string
    description?:       string
    desc?:              string
    cover_image_url?:   string
    image?:             string
    category?:          string
    cat?:               string
    is_free?:           boolean
    free?:              boolean
    price_formatted?:   string
    price?:             string
    duration_hours?:    number
    duration_formatted?: string
    lessons_count?:     number
}

export function FormationCard({ f, i }: { f: Formation; i: number }) {
    const isFree   = f.is_free ?? f.free ?? false
    const price    = f.price_formatted ?? f.price ?? (isFree ? 'Gratuit' : null)
    const category = f.category ?? f.cat ?? 'Formation'

    return (
        <CardWrapper i={i}>
            <Link href={`/formations/${f.slug}`} className="block h-full">
                <div className={cardBase}>
                    {/* Image */}
                    <div className="relative overflow-hidden bg-slate-50 aspect-[16/9] flex-shrink-0">
                        <img
                            src={f.cover_image_url ?? f.image}
                            alt={f.title}
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                        {/* Badge prix */}
                        <div className={cn(
                            'absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold',
                            isFree
                                ? 'bg-teal-500 text-white'
                                : 'bg-black/30 backdrop-blur-sm text-white/90',
                        )}>
                            {price}
                        </div>

                        {/* Catégorie */}
                        <div className="absolute bottom-3 left-3">
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/35 backdrop-blur-sm text-white/90">
                                {category}
                            </span>
                        </div>
                    </div>

                    {/* Contenu */}
                    <div className="flex flex-col flex-1 p-5">
                        <div className="flex-1 space-y-1.5">
                            <h3 className="text-[14px] font-semibold text-slate-900 group-hover:text-teal-700 transition-colors duration-200 leading-snug">
                                {f.title}
                            </h3>
                            <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2">
                                {f.excerpt ?? f.description ?? f.desc}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-3">
                                {(f.duration_hours || f.duration_formatted) && (
                                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                        <ClockIcon />
                                        <span>{f.duration_formatted ?? `${f.duration_hours}h`}</span>
                                    </div>
                                )}
                                {f.lessons_count && (
                                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                        <BookIcon />
                                        <span>{f.lessons_count} leçons</span>
                                    </div>
                                )}
                            </div>
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-600 group-hover:gap-1.5 transition-all duration-200">
                                Voir <ArrowUpRight />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </CardWrapper>
    )
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle }
