// resources/js/pages/formations/FormationsIndex.tsx
// Liste des formations : hero, filtres catégorie + niveau, grille stable au filtrage.

import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    EmptyResults,
    FilterBar,
    FilterGrid,
    FilterGridItem,
    FilterRow,
    ListingCta,
    ListingHero,
} from '@/components/portofolio/listing';
import { SessionRow } from '@/components/portofolio/session-list';
import { FormationCard } from '@/components/ui/FormationCard';
import { MaskedLine, Reveal } from '@/components/ui/reveal';
import { SectionBackdrop } from '@/components/ui/section-backdrop';
import MainLayout from '@/layouts/MainLayout';
import { levelLabel, useTranslation } from '@/lib/i18n';
import type { Formation, FormationsIndexProps } from '@/types';

const LEVEL_ORDER = ['débutant', 'intermédiaire', 'avancé'] as const;

function matches(
    formation: Formation,
    category: string | null,
    level: string | null,
): boolean {
    return (
        (!category || formation.category === category) &&
        (!level || formation.level === level)
    );
}

export default function FormationsIndex({
    formations,
    categories,
    upcoming_sessions,
}: FormationsIndexProps) {
    const { t, l, language } = useTranslation();
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeLevel, setActiveLevel] = useState<string | null>(null);

    const categoryOptions = useMemo(
        () =>
            categories.map((category) => ({
                value: category,
                label: category,
                count: formations.filter((formation) =>
                    matches(formation, category, activeLevel),
                ).length,
            })),
        [categories, formations, activeLevel],
    );

    const levelOptions = useMemo(
        () =>
            LEVEL_ORDER.filter((level) =>
                formations.some((formation) => formation.level === level),
            ).map((level) => ({
                value: level,
                label: levelLabel(level, language),
                count: formations.filter((formation) =>
                    matches(formation, activeCategory, level),
                ).length,
            })),
        [formations, activeCategory, language],
    );

    const visibleFormations = useMemo(
        () =>
            formations.filter((formation) =>
                matches(formation, activeCategory, activeLevel),
            ),
        [formations, activeCategory, activeLevel],
    );

    const hasFilters = Boolean(activeCategory || activeLevel);
    const resetFilters = () => {
        setActiveCategory(null);
        setActiveLevel(null);
    };
    const filterLabel = [
        activeCategory,
        activeLevel ? levelLabel(activeLevel, language) : null,
    ]
        .filter(Boolean)
        .join(' · ');

    return (
        <MainLayout>
            <Head
                title={l(
                    'Formations — Sergio Junior Chebeu',
                    'Training — Sergio Junior Chebeu',
                )}
            />

            <ListingHero
                eyebrow={l('Formations', 'Training')}
                title={l('Apprendre', 'Learn by')}
                accent={l('en construisant', 'building')}
                intro={l(
                    'Des formations pratiques en développement web et mobile, construites à partir de vrais projets.',
                    'Hands-on web and mobile development training, built from real projects.',
                )}
                count={visibleFormations.length}
                unit={[l('formation', 'course'), l('formations', 'courses')]}
                filterLabel={filterLabel || null}
            />

            {formations.length > 0 && (
                <FilterBar onReset={hasFilters ? resetFilters : undefined}>
                    {categoryOptions.length > 1 && (
                        <FilterRow
                            id="formation-category"
                            label={l('Thème', 'Topic')}
                            allLabel={l('Toutes', 'All')}
                            allCount={
                                formations.filter((formation) =>
                                    matches(formation, null, activeLevel),
                                ).length
                            }
                            options={categoryOptions}
                            value={activeCategory}
                            onChange={setActiveCategory}
                        />
                    )}
                    {levelOptions.length > 1 && (
                        <FilterRow
                            id="formation-level"
                            label={l('Niveau', 'Level')}
                            allCount={
                                formations.filter((formation) =>
                                    matches(formation, activeCategory, null),
                                ).length
                            }
                            options={levelOptions}
                            value={activeLevel}
                            onChange={setActiveLevel}
                        />
                    )}
                </FilterBar>
            )}

            {upcoming_sessions.length > 0 && (
                <section className="relative isolate overflow-clip border-t border-slate-200/80 bg-white py-16 sm:py-24">
                    <SectionBackdrop pattern="lines" />
                    <div className="container-main grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
                        <div className="lg:sticky lg:top-28 lg:self-start">
                            <Reveal y={8}>
                                <p className="mb-4 flex items-center gap-2 font-mono text-[12px] text-slate-500">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-60" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
                                    </span>
                                    {t('training.live_sessions')}
                                </p>
                            </Reveal>
                            <h2 className="font-display text-4xl leading-[1.05] font-bold tracking-[-0.03em] text-slate-900 sm:text-5xl">
                                <MaskedLine onScroll>
                                    {t('training.next_sessions')}
                                </MaskedLine>
                            </h2>
                            <Reveal delay={0.15}>
                                <p className="mt-5 max-w-sm text-[18px] leading-relaxed text-slate-600">
                                    {t('training.live_intro')}
                                </p>
                            </Reveal>
                        </div>
                        <ul className="rounded-2xl border border-slate-200 bg-white px-5 sm:px-7">
                            {upcoming_sessions.map((session, index) => (
                                <SessionRow
                                    key={session.id}
                                    session={session}
                                    index={index}
                                />
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            <section className="relative isolate overflow-clip bg-white py-16 sm:py-24">
                <SectionBackdrop pattern="grid" />
                <div className="container-main">
                    {formations.length === 0 ? (
                        <EmptyResults
                            message={l(
                                'Les premières formations arrivent bientôt.',
                                'The first training courses are coming soon.',
                            )}
                        />
                    ) : visibleFormations.length === 0 ? (
                        <EmptyResults
                            message={l(
                                'Aucune formation ne correspond à ces filtres.',
                                'No training matches these filters.',
                            )}
                            onReset={resetFilters}
                        />
                    ) : (
                        <FilterGrid id="formations-grid">
                            {visibleFormations.map((formation, index) => (
                                <FilterGridItem key={formation.id}>
                                    <FormationCard
                                        formation={formation}
                                        index={index}
                                    />
                                </FilterGridItem>
                            ))}
                        </FilterGrid>
                    )}

                    <ListingCta
                        title={l(
                            'Un sujet qui vous manque ?',
                            'Missing a topic?',
                        )}
                        text={l(
                            "Proposez-le : il fera peut-être l'objet d'une prochaine formation.",
                            'Suggest it: it might become the next course.',
                        )}
                        href="/contact"
                        label={l('Suggérer un sujet', 'Suggest a topic')}
                    />
                </div>
            </section>
        </MainLayout>
    );
}
