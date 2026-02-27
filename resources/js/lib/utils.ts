// resources/js/lib/utils.ts
// ─────────────────────────────────────────────────────────────────────────────
// Utilitaires partagés — le "toolkit" de base du projet
// Flutter équivalent : un fichier helpers.dart avec extensions et fonctions
// ─────────────────────────────────────────────────────────────────────────────

import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx }                  from 'clsx';
import type { ClassValue }       from 'clsx';
import { twMerge }               from 'tailwind-merge';

// ── cn() ──────────────────────────────────────────────────────────────────────
// Fusionne des classes Tailwind sans conflits.
// Flutter équivalent : combiner des styles conditionnellement
//
// Usage :
//   cn('px-4 py-2', isActive && 'bg-teal-500', 'rounded-lg')
// ─────────────────────────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

// ── toUrl() ───────────────────────────────────────────────────────────────────
// Normalise un href Inertia (string ou objet) en string.
// Flutter équivalent : Uri.parse(url).toString()
// ─────────────────────────────────────────────────────────────────────────────
export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

// ── easings ───────────────────────────────────────────────────────────────────
// Courbes d'animation réutilisables partout dans le projet.
// Flutter équivalent : Curves.easeOut, Curves.bounceIn, Curves.elasticOut...
//
// ⚠️  POURQUOI "as [number, number, number, number]" ?
//   TypeScript infère [0.23, 1, 0.32, 1] comme `number[]` (longueur inconnue).
//   Framer Motion attend un tuple EXACT de 4 nombres pour cubic-bezier.
//   Sans le cast → erreur TS2322 "number[] is not assignable to Easing".
//   Le cast dit à TS : "fais-moi confiance, c'est exactement 4 nombres."
//
// Usage dans tes composants :
//   import { easings } from '@/lib/utils';
//   transition: { duration: 0.6, ease: easings.smooth }
// ─────────────────────────────────────────────────────────────────────────────
export const easings = {
    // Doux et naturel — usage général, hero animations
    smooth:  [0.23, 1, 0.32, 1]        as [number, number, number, number],

    // Léger rebond — boutons, cartes qui apparaissent
    bounce:  [0.34, 1.56, 0.64, 1]     as [number, number, number, number],

    // Rapide et précis — navigations, transitions UI
    snappy:  [0.4, 0, 0.2, 1]          as [number, number, number, number],

    // Très doux — fadeIn, overlays, textes
    gentle:  [0.25, 0.46, 0.45, 0.94]  as [number, number, number, number],

    // Accélère puis freine brutalement — reveals dramatiques
    expo:    [0.19, 1, 0.22, 1]         as [number, number, number, number],
} as const;

// ── formatDate() ──────────────────────────────────────────────────────────────
// Formate une date en français lisible.
// Flutter équivalent : DateFormat('d MMMM yyyy', 'fr').format(date)
//
// Usage :
//   formatDate('2026-02-15')             → "15 février 2026"
//   formatDate('2026-02-15', 'short')    → "15 févr. 2026"
//   formatDate('2026-02-15', 'relative') → "Il y a 3 h"
// ─────────────────────────────────────────────────────────────────────────────
export function formatDate(
    dateString: string,
    style: 'long' | 'short' | 'relative' = 'long'
): string {
    const date = new Date(dateString);

    if (style === 'relative') {
        const now  = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diff < 60)     return "À l'instant";
        if (diff < 3600)   return `Il y a ${Math.floor(diff / 60)} min`;
        if (diff < 86400)  return `Il y a ${Math.floor(diff / 3600)} h`;
        if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)} j`;
    }

    return date.toLocaleDateString('fr-FR', {
        day:   'numeric',
        month: style === 'short' ? 'short' : 'long',
        year:  'numeric',
    });
}

// ── truncate() ────────────────────────────────────────────────────────────────
// Coupe un texte à une longueur max avec "…"
// Flutter équivalent : overflow: TextOverflow.ellipsis (logique pure)
//
// Usage :
//   truncate('Mon très long titre qui dépasse', 30) → "Mon très long titre qui dép…"
// ─────────────────────────────────────────────────────────────────────────────
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + '…';
}

// ── slugify() ─────────────────────────────────────────────────────────────────
// Convertit un titre en slug URL-friendly
// Usage :
//   slugify('Mon Article de Blog !') → "mon-article-de-blog"
// ─────────────────────────────────────────────────────────────────────────────
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')  // supprime accents
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// ── initials() ────────────────────────────────────────────────────────────────
// Génère les initiales d'un nom complet pour les avatars fallback.
// Flutter équivalent : CircleAvatar(child: Text(initials(name)))
//
// Usage :
//   initials('Sergio Junior Chebeu') → "SC"
//   initials('Sergio')               → "SE"
// ─────────────────────────────────────────────────────────────────────────────
export function initials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ── variants() ────────────────────────────────────────────────────────────────
// Helper de variantes typé — pattern central de tous les composants UI.
// Flutter équivalent : switch(variant) { case 'primary': return primaryStyle; }
//
// Usage :
//   const buttonStyles = variants({
//     base: 'px-4 py-2 rounded-lg font-medium transition-all',
//     variants: {
//       color: {
//         primary: 'bg-teal-500 text-white shadow-lg shadow-teal-500/25',
//         ghost:   'text-teal-600 hover:bg-teal-50',
//       },
//       size: { sm: 'text-sm py-1.5', md: 'text-base', lg: 'text-lg py-3.5' },
//     },
//   });
//
//   <button className={buttonStyles({ color: 'primary', size: 'md' })} />
//   <button className={buttonStyles({ color: 'ghost' }, 'mt-4')} />  // + classes extra
// ─────────────────────────────────────────────────────────────────────────────
type VariantConfig<T extends Record<string, Record<string, string>>> = {
    base?: string;
    variants: T;
};

export function variants<T extends Record<string, Record<string, string>>>(
    config: VariantConfig<T>
) {
    return (selected: { [K in keyof T]?: keyof T[K] }, extra?: ClassValue): string => {
        const variantClasses = Object.entries(selected)
            .map(([key, val]) => val ? config.variants[key]?.[val as string] ?? '' : '')
            .filter(Boolean);

        return cn(config.base ?? '', ...variantClasses, extra);
    };
}