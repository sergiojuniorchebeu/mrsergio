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
import { FormationCard } from '@/components/ui/FormationCard';
import { SectionBackdrop } from '@/components/ui/section-backdrop';
import MainLayout from '@/layouts/MainLayout';
import type { Formation, FormationsIndexProps } from '@/types';

const LEVEL_ORDER = ['débutant', 'intermédiaire', 'avancé'] as const;

function levelLabel(level: string): string {
    return level.charAt(0).toUpperCase() + level.slice(1);
}

function matches(formation: Formation, category: string | null, level: string | null): boolean {
    return (!category || formation.category === category) && (!level || formation.level === level);
}

export default function FormationsIndex({ formations, categories }: FormationsIndexProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeLevel, setActiveLevel] = useState<string | null>(null);

    const categoryOptions = useMemo(
        () =>
            categories.map((category) => ({
                value: category,
                label: category,
                count: formations.filter((formation) => matches(formation, category, activeLevel)).length,
            })),
        [categories, formations, activeLevel],
    );

    const levelOptions = useMemo(
        () =>
            LEVEL_ORDER.filter((level) => formations.some((formation) => formation.level === level)).map((level) => ({
                value: level,
                label: levelLabel(level),
                count: formations.filter((formation) => matches(formation, activeCategory, level)).length,
            })),
        [formations, activeCategory],
    );

    const visibleFormations = useMemo(
        () => formations.filter((formation) => matches(formation, activeCategory, activeLevel)),
        [formations, activeCategory, activeLevel],
    );

    const hasFilters = Boolean(activeCategory || activeLevel);
    const resetFilters = () => {
        setActiveCategory(null);
        setActiveLevel(null);
    };
    const filterLabel = [activeCategory, activeLevel ? levelLabel(activeLevel) : null].filter(Boolean).join(' · ');

    return (
        <MainLayout>
            <Head title="Formations — Sergio Junior Chebeu" />

            <ListingHero
                eyebrow="Formations"
                title="Apprendre"
                accent="en construisant"
                intro="Des formations pratiques en développement web et mobile, construites à partir de vrais projets."
                count={visibleFormations.length}
                unit={['formation', 'formations']}
                filterLabel={filterLabel || null}
            />

            {formations.length > 0 && (
                <FilterBar onReset={hasFilters ? resetFilters : undefined}>
                    {categoryOptions.length > 1 && (
                        <FilterRow
                            id="formation-category"
                            label="Thème"
                            allLabel="Toutes"
                            allCount={formations.filter((formation) => matches(formation, null, activeLevel)).length}
                            options={categoryOptions}
                            value={activeCategory}
                            onChange={setActiveCategory}
                        />
                    )}
                    {levelOptions.length > 1 && (
                        <FilterRow
                            id="formation-level"
                            label="Niveau"
                            allCount={formations.filter((formation) => matches(formation, activeCategory, null)).length}
                            options={levelOptions}
                            value={activeLevel}
                            onChange={setActiveLevel}
                        />
                    )}
                </FilterBar>
            )}

            <section className="relative isolate overflow-clip bg-white py-16 sm:py-24">
                <SectionBackdrop pattern="grid" />
                <div className="container-main">
                    {formations.length === 0 ? (
                        <EmptyResults message="Les premières formations arrivent bientôt." />
                    ) : visibleFormations.length === 0 ? (
                        <EmptyResults message="Aucune formation ne correspond à ces filtres." onReset={resetFilters} />
                    ) : (
                        <FilterGrid id="formations-grid">
                            {visibleFormations.map((formation, index) => (
                                <FilterGridItem key={formation.id}>
                                    <FormationCard formation={formation} index={index} />
                                </FilterGridItem>
                            ))}
                        </FilterGrid>
                    )}

                    <ListingCta
                        title="Un sujet qui vous manque ?"
                        text="Proposez-le : il fera peut-être l'objet d'une prochaine formation."
                        href="/contact"
                        label="Suggérer un sujet"
                    />
                </div>
            </section>
        </MainLayout>
    );
}
