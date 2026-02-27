// resources/js/types/index.ts

// ── Project ───────────────────────────────────────────────────────────────────
export interface Project {
    id:          number;
    title:       string;
    slug:        string;
    description: string;
    content?:    string;
    image_url:   string;
    demo_url:    string | null;
    github_url:  string | null;
    tags:        string[];
    featured:    boolean;
    created_at?: string;
}
export interface ProjectsIndexProps { projects: Project[]; }
export interface ProjectShowProps {
    project: Project;
    related: Omit<Project, 'content' | 'demo_url' | 'github_url' | 'featured' | 'created_at'>[];
}

// ── BlogPost ──────────────────────────────────────────────────────────────────
export interface BlogPost {
    id:              number;
    title:           string;
    slug:            string;
    excerpt:         string;
    content?:        string;
    cover_image_url: string;
    tags:            string[];
    featured:        boolean;
    published_at:    string | null;
}
export interface BlogIndexProps { posts: BlogPost[]; }
export interface BlogShowProps {
    post:    BlogPost;
    related: Omit<BlogPost, 'content' | 'featured'>[];
}

// ── Formation ─────────────────────────────────────────────────────────────────
export interface Formation {
    id:                  number;
    title:               string;
    slug:                string;
    excerpt:             string;
    content?:            string;
    cover_image_url:     string;
    preview_video_url?:  string | null;
    category:            string;
    tags:                string[];
    level:               'débutant' | 'intermédiaire' | 'avancé';
    level_color:         'green' | 'amber' | 'red' | 'slate';
    language?:           string;
    duration_formatted:  string;
    lessons_count:       number;
    students_count?:     number;
    is_free:             boolean;
    price_formatted:     string;
    featured:            boolean;
    published_at?:       string;
}

export interface FormationsIndexProps {
    formations: Formation[];
    categories: string[];
}

export interface FormationShowProps {
    formation: Formation;
    related:   Omit<Formation, 'content' | 'preview_video_url' | 'language' | 'students_count' | 'published_at'>[];
}