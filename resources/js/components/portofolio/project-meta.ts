// resources/js/components/portofolio/project-meta.ts
// Petites fonctions partagées sur les projets (carte d'accueil, page détail).

import type { Project } from '@/types';

export type ProjectLink = { href: string; label: string };

/**
 * « MrMarket — App de gestion de marché » → nom + accroche.
 */
export function splitTitle(title: string): {
    name: string;
    tagline: string | null;
} {
    const [name, ...rest] = title.split(/\s+[—–-]\s+/);

    return {
        name: name.trim(),
        tagline: rest.length > 0 ? rest.join(' — ').trim() : null,
    };
}

export function primaryLinks(project: Project): ProjectLink[] {
    const links = project.store_links ?? {};
    const candidates: (ProjectLink | null)[] = [
        project.demo_url
            ? {
                  href: project.demo_url,
                  label:
                      project.project_type === 'web'
                          ? 'Voir le site'
                          : 'Voir la démo',
              }
            : null,
        links.play_store
            ? { href: links.play_store, label: 'Google Play' }
            : null,
        links.app_store ? { href: links.app_store, label: 'App Store' } : null,
        links.windows ? { href: links.windows, label: 'Windows' } : null,
        links.macos ? { href: links.macos, label: 'macOS' } : null,
        links.linux ? { href: links.linux, label: 'Linux' } : null,
        links.docs ? { href: links.docs, label: 'Documentation' } : null,
    ];

    return candidates.filter((link): link is ProjectLink => link !== null);
}
