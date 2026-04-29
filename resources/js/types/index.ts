// resources/js/types/index.ts

export * from './auth';
export * from './navigation';
export * from './ui';

export type ProjectType = 'web' | 'mobile' | 'desktop' | 'api';

export interface ProjectStoreLinks {
    play_store?: string;
    app_store?: string;
    windows?: string;
    macos?: string;
    linux?: string;
    docs?: string;
    postman?: string;
    base_url?: string;
}

// ── Project ───────────────────────────────────────────────────────────────────
export interface Project {
    id: number;
    title: string;
    slug: string;
    project_type: ProjectType;
    project_type_label?: string;

    description: string;
    content?: string;

    image_url: string;
    demo_url: string | null;
    github_url: string | null;

    private_repo: boolean;
    platforms: string[];
    store_links?: ProjectStoreLinks;

    screenshots: string[];
    screenshots_urls?: string[];

    tags: string[];
    featured: boolean;
    created_at?: string;
}

// ── Props pages projets ──────────────────────────────────────────────────────
export interface ProjectsIndexProps {
    projects: Project[];
}

export interface ProjectShowProps {
    project: Project;
    related: Project[];
}

// ── BlogPost ──────────────────────────────────────────────────────────────────
export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content?: string;
    cover_image_url: string;
    tags: string[];
    featured: boolean;
    published_at: string | null;
    reading_time?: string;
}

export interface BlogIndexProps {
    posts: BlogPost[];
}

export interface BlogShowProps {
    post: BlogPost;
    related: Omit<BlogPost, 'content' | 'featured'>[];
}

// ── Formation ─────────────────────────────────────────────────────────────────
export interface Formation {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content?: string;
    cover_image_url: string;
    preview_video_url?: string | null;
    category: string;
    tags: string[];
    level: 'débutant' | 'intermédiaire' | 'avancé';
    level_color: 'green' | 'amber' | 'red' | 'slate';
    language?: string;
    duration_formatted: string;
    lessons_count: number;
    students_count?: number;
    is_free: boolean;
    price_formatted: string;
    featured: boolean;
    published_at?: string;
}

export interface FormationsIndexProps {
    formations: Formation[];
    categories: string[];
}

export interface FormationShowProps {
    formation: Formation;
    related: Omit<
        Formation,
        | 'content'
        | 'preview_video_url'
        | 'language'
        | 'students_count'
        | 'published_at'
    >[];
}
