// resources/js/types/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// Types TypeScript partagés dans tout le projet
// Flutter équivalent : les classes Dart (models) avec leurs propriétés typées
// ─────────────────────────────────────────────────────────────────────────────

// ── Project ───────────────────────────────────────────────────────────────────
// Correspond exactement aux champs renvoyés par ProjectController
export interface Project {
    id:          number;
    title:       string;
    slug:        string;
    description: string;
    content?:    string;        // optionnel — seulement sur la page Show
    image_url:   string;
    demo_url:    string | null;
    github_url:  string | null;
    tags:        string[];
    featured:    boolean;
    created_at?: string;        // optionnel — seulement sur Show
}

// ── Props Inertia pages ───────────────────────────────────────────────────────
// Flutter équivalent : les arguments passés au constructeur du widget de page

export interface ProjectsIndexProps {
    projects: Project[];
}

export interface ProjectShowProps {
    project: Project;
    related: Omit<Project, 'content' | 'demo_url' | 'github_url' | 'featured' | 'created_at'>[];
}