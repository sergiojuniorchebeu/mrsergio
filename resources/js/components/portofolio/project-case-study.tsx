// resources/js/components/portofolio/project-case-study.tsx
// Corps de l'étude de cas : le Markdown est découpé en chapitres (« ## »),
// avec un sommaire collant qui suit la lecture (scroll spy) sur desktop.

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { markdownComponents } from '@/components/portofolio/markdown';
import { MaskedLine, Reveal } from '@/components/ui/reveal';
import { cn, slugify } from '@/lib/utils';

export interface CaseStudySection {
    id: string;
    title: string;
    body: string;
}

/**
 * Découpe le Markdown en chapitres à partir des titres « ## ».
 * Le texte placé avant le premier titre devient un chapitre « Aperçu ».
 */
export function splitIntoSections(markdown: string): CaseStudySection[] {
    const [intro, ...parts] = markdown.split(/^##\s+/m);
    const sections: CaseStudySection[] = [];
    const usedIds = new Set<string>();

    const uniqueId = (title: string): string => {
        const base = slugify(title) || 'section';
        let id = base;
        let suffix = 2;

        while (usedIds.has(id)) {
            id = `${base}-${suffix++}`;
        }

        usedIds.add(id);

        return id;
    };

    if (intro.trim()) {
        sections.push({
            id: uniqueId('Aperçu'),
            title: 'Aperçu',
            body: intro.trim(),
        });
    }

    for (const part of parts) {
        const [titleLine, ...rest] = part.split('\n');
        const title = titleLine.trim();

        sections.push({
            id: uniqueId(title),
            title,
            body: rest.join('\n').trim(),
        });
    }

    return sections;
}

function useActiveSection(ids: string[]): string | null {
    const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((entry) => entry.isIntersecting);

                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            { rootMargin: '-35% 0px -60% 0px' },
        );

        ids.forEach((id) => {
            const element = document.getElementById(id);

            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [ids]);

    return activeId;
}

/**
 * Index du chapitre après lequel insérer la galerie : « Contexte » s'il existe,
 * sinon le premier chapitre.
 */
function contextSectionIndex(sections: CaseStudySection[]): number {
    const index = sections.findIndex((section) =>
        section.id.startsWith('contexte'),
    );

    return index >= 0 ? index : 0;
}

function TableOfContents({
    sections,
    activeId,
    onNavigate,
}: {
    sections: CaseStudySection[];
    activeId: string | null;
    onNavigate: (id: string) => void;
}) {
    const activeIndex = Math.max(
        0,
        sections.findIndex((section) => section.id === activeId),
    );

    return (
        <aside className="hidden lg:block">
            <nav aria-label="Sommaire" className="sticky top-28">
                <p className="mb-5 font-mono text-[11px] text-slate-400">
                    Sommaire
                </p>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 w-px bg-slate-200" />
                    <motion.div
                        initial={false}
                        animate={{
                            scaleY: (activeIndex + 1) / sections.length,
                        }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute inset-y-0 left-0 w-px origin-top bg-teal-500"
                    />
                    <ul className="flex flex-col">
                        {sections.map((section, index) => {
                            const isActive = section.id === activeId;

                            return (
                                <li key={section.id}>
                                    <a
                                        href={`#${section.id}`}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            onNavigate(section.id);
                                        }}
                                        className={cn(
                                            'flex items-baseline gap-3 py-2 pl-5 text-[14px] transition-colors duration-300',
                                            isActive
                                                ? 'text-slate-900'
                                                : 'text-slate-400 hover:text-slate-700',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'font-mono text-[11px] transition-colors',
                                                isActive
                                                    ? 'text-teal-600'
                                                    : 'text-slate-300',
                                            )}
                                        >
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span
                                            className={cn(
                                                isActive && 'font-semibold',
                                            )}
                                        >
                                            {section.title}
                                        </span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
        </aside>
    );
}

function SectionBlock({
    section,
    number,
}: {
    section: CaseStudySection;
    number: number;
}) {
    return (
        <section id={section.id} className="scroll-mt-28">
            <Reveal y={8}>
                <p className="mb-4 font-mono text-[12px] text-teal-600">
                    {String(number).padStart(2, '0')}
                </p>
            </Reveal>
            <h2 className="mb-8 font-display text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-[44px]">
                <MaskedLine onScroll>{section.title}</MaskedLine>
            </h2>
            <Reveal delay={0.1}>
                <div className="max-w-[44rem]">
                    <ReactMarkdown components={markdownComponents}>
                        {section.body}
                    </ReactMarkdown>
                </div>
            </Reveal>
        </section>
    );
}

/**
 * Étude de cas complète. `afterContext` (la galerie) est inséré en pleine largeur
 * juste après le chapitre « Contexte » ; le sommaire reste complet dans chaque bloc.
 */
export function ProjectCaseStudy({
    content,
    afterContext,
}: {
    content: string;
    afterContext?: ReactNode;
}) {
    const prefersReducedMotion = useReducedMotion();
    const sections = useMemo(() => splitIntoSections(content), [content]);
    const ids = useMemo(
        () => sections.map((section) => section.id),
        [sections],
    );
    const activeId = useActiveSection(ids);
    const splitIndex = contextSectionIndex(sections);
    const blocks = [
        sections.slice(0, splitIndex + 1),
        sections.slice(splitIndex + 1),
    ];

    const goTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start',
        });
        window.history.replaceState(null, '', `#${id}`);
    };

    if (sections.length === 0) {
        return <>{afterContext}</>;
    }

    const renderBlock = (
        blockSections: CaseStudySection[],
        numberOffset: number,
        className: string,
    ) =>
        blockSections.length > 0 && (
            <section className={cn('relative bg-white', className)}>
                <div className="container-main grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-20">
                    <TableOfContents
                        sections={sections}
                        activeId={activeId}
                        onNavigate={goTo}
                    />
                    <div className="flex min-w-0 flex-col gap-20 sm:gap-28">
                        {blockSections.map((section, index) => (
                            <SectionBlock
                                key={section.id}
                                section={section}
                                number={numberOffset + index + 1}
                            />
                        ))}
                    </div>
                </div>
            </section>
        );

    return (
        <>
            {renderBlock(blocks[0], 0, 'pt-24 pb-16 sm:pt-32 sm:pb-20')}
            {afterContext}
            {renderBlock(
                blocks[1],
                blocks[0].length,
                'pt-16 pb-24 sm:pt-20 sm:pb-32',
            )}
        </>
    );
}
