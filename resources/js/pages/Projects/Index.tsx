// resources/js/pages/Projects/Index.tsx
// Liste des projets : hero, filtres type + stack, grille stable au filtrage.

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
import { ProjectCard } from '@/components/ui/ProjectCard';
import { SectionBackdrop } from '@/components/ui/section-backdrop';
import MainLayout from '@/layouts/MainLayout';
import { useTranslation } from '@/lib/i18n';
import type { Project, ProjectsIndexProps, ProjectType } from '@/types';

const TYPE_LABELS: Record<ProjectType, string> = {
    web: 'Web',
    mobile: 'Mobile',
    desktop: 'Desktop',
    api: 'API',
};

function matches(
    project: Project,
    type: string | null,
    tag: string | null,
): boolean {
    return (
        (!type || project.project_type === type) &&
        (!tag || project.tags.includes(tag))
    );
}

export default function Index({ projects }: ProjectsIndexProps) {
    const { l } = useTranslation();
    const [activeType, setActiveType] = useState<string | null>(null);
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const typeOptions = useMemo(() => {
        const types = Array.from(
            new Set(
                projects.map((project) => project.project_type).filter(Boolean),
            ),
        );

        return types.map((type) => ({
            value: type,
            label: TYPE_LABELS[type] ?? type,
            count: projects.filter((project) =>
                matches(project, type, activeTag),
            ).length,
        }));
    }, [projects, activeTag]);

    const tagOptions = useMemo(() => {
        const tags = Array.from(
            new Set(projects.flatMap((project) => project.tags ?? [])),
        ).sort((a, b) => a.localeCompare(b));

        return tags.map((tag) => ({
            value: tag,
            label: tag,
            count: projects.filter((project) =>
                matches(project, activeType, tag),
            ).length,
        }));
    }, [projects, activeType]);

    const visibleProjects = useMemo(
        () =>
            projects.filter((project) =>
                matches(project, activeType, activeTag),
            ),
        [projects, activeType, activeTag],
    );

    const hasFilters = Boolean(activeType || activeTag);
    const resetFilters = () => {
        setActiveType(null);
        setActiveTag(null);
    };
    const filterLabel = [
        activeType ? TYPE_LABELS[activeType as ProjectType] : null,
        activeTag,
    ]
        .filter(Boolean)
        .join(' · ');

    return (
        <MainLayout>
            <Head
                title={l(
                    'Projets — Sergio Junior Chebeu',
                    'Projects — Sergio Junior Chebeu',
                )}
            />

            <ListingHero
                eyebrow={l('Projets', 'Projects')}
                title={l('Mes', 'My')}
                accent={l('projets', 'projects')}
                intro={l(
                    "Applications web, mobiles, desktop et API, conçues avec une attention particulière à l'architecture et à l'expérience utilisateur.",
                    'Web, mobile, desktop and API projects, built with close attention to architecture and user experience.',
                )}
                count={visibleProjects.length}
                unit={[l('projet', 'project'), l('projets', 'projects')]}
                filterLabel={filterLabel || null}
            />

            {projects.length > 0 && (
                <FilterBar onReset={hasFilters ? resetFilters : undefined}>
                    {typeOptions.length > 1 && (
                        <FilterRow
                            id="project-type"
                            label="Type"
                            allCount={
                                projects.filter((project) =>
                                    matches(project, null, activeTag),
                                ).length
                            }
                            options={typeOptions}
                            value={activeType}
                            onChange={setActiveType}
                        />
                    )}
                    {tagOptions.length > 0 && (
                        <FilterRow
                            id="project-stack"
                            label="Stack"
                            allCount={
                                projects.filter((project) =>
                                    matches(project, activeType, null),
                                ).length
                            }
                            options={tagOptions}
                            value={activeTag}
                            onChange={setActiveTag}
                        />
                    )}
                </FilterBar>
            )}

            <section className="relative isolate overflow-clip bg-white py-16 sm:py-24">
                <SectionBackdrop pattern="grid" />
                <div className="container-main">
                    {projects.length === 0 ? (
                        <EmptyResults
                            message={l(
                                "Aucun projet publié pour l'instant.",
                                'No projects published yet.',
                            )}
                        />
                    ) : visibleProjects.length === 0 ? (
                        <EmptyResults
                            message={l(
                                'Aucun projet ne correspond à ces filtres.',
                                'No projects match these filters.',
                            )}
                            onReset={resetFilters}
                        />
                    ) : (
                        <FilterGrid
                            id="projects-grid"
                            className="lg:grid-cols-2"
                        >
                            {visibleProjects.map((project, index) => (
                                <FilterGridItem
                                    key={project.id}
                                    className={
                                        index === 0
                                            ? 'sm:col-span-2'
                                            : undefined
                                    }
                                >
                                    <ProjectCard
                                        project={project}
                                        index={index}
                                        isWide={index === 0}
                                    />
                                </FilterGridItem>
                            ))}
                        </FilterGrid>
                    )}

                    <ListingCta
                        title={l(
                            'Un projet similaire en tête ?',
                            'Have a similar project in mind?',
                        )}
                        text={l(
                            "Parlons de votre besoin, de vos délais et de ce qu'il faut construire.",
                            "Let's talk about your needs, your timeline and what needs to be built.",
                        )}
                        href="/contact"
                        label={l('Discutons-en', "Let's talk")}
                    />
                </div>
            </section>
        </MainLayout>
    );
}
