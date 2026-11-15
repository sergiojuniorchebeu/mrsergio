// resources/js/components/portofolio/markdown.tsx
// Rendu Markdown partagé (articles de blog + études de cas projets).
// Les titres reçoivent un `id` stable pour que le sommaire puisse y mener.

import type { ReactNode } from 'react';
import { Children, isValidElement } from 'react';
import type { Components } from 'react-markdown';
import { slugify } from '@/lib/utils';

export interface MarkdownHeading {
    id: string;
    text: string;
    level: 2 | 3;
}

/**
 * Identifiant d'ancre d'un titre, identique côté sommaire et côté contenu.
 */
export function headingId(text: string): string {
    return slugify(text.replace(/[*_`]/g, '')) || 'section';
}

/**
 * Titres « ## » et « ### » du Markdown, en ignorant les blocs de code.
 */
export function extractHeadings(markdown: string): MarkdownHeading[] {
    const headings: MarkdownHeading[] = [];
    let isInCodeBlock = false;

    for (const line of markdown.split('\n')) {
        if (line.trimStart().startsWith('```')) {
            isInCodeBlock = !isInCodeBlock;
            continue;
        }

        const match = !isInCodeBlock && line.match(/^(#{2,3})\s+(.+?)\s*#*$/);

        if (match) {
            const text = match[2].replace(/[*_`]/g, '');
            headings.push({
                id: headingId(text),
                text,
                level: match[1].length === 3 ? 3 : 2,
            });
        }
    }

    return headings;
}

function nodeText(node: ReactNode): string {
    if (typeof node === 'string' || typeof node === 'number') {
        return String(node);
    }

    if (Array.isArray(node)) {
        return node.map(nodeText).join('');
    }

    if (isValidElement(node)) {
        return nodeText((node.props as { children?: ReactNode }).children);
    }

    return '';
}

function Strong({ children }: { children?: ReactNode }) {
    return <strong className="font-semibold text-slate-900">{children}</strong>;
}

/**
 * Élément de liste : « **Libellé** : valeur » devient une ligne à deux colonnes.
 */
function ListItem({ children }: { children?: ReactNode }) {
    const items = Children.toArray(children);
    const [first, ...rest] = items;

    if (
        isValidElement(first) &&
        (first.type === Strong || first.type === 'strong')
    ) {
        const value = rest.map((child, index) =>
            index === 0 && typeof child === 'string'
                ? child.replace(/^\s*[:—-]\s*/, '')
                : child,
        );

        return (
            <li className="grid gap-1 border-t border-slate-200 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
                <span className="font-mono text-[12px] tracking-wide text-slate-500 uppercase">
                    {(first.props as { children?: ReactNode }).children}
                </span>
                <span className="text-[18px] leading-relaxed text-slate-800">
                    {value}
                </span>
            </li>
        );
    }

    return (
        <li className="relative border-t border-slate-200 py-3.5 pl-7 text-[18px] leading-relaxed text-slate-700">
            <span
                aria-hidden
                className="absolute top-[1.45em] left-0 h-px w-3.5 bg-teal-500"
            />
            {children}
        </li>
    );
}

export const markdownComponents: Components = {
    h2: ({ children }) => (
        <h2
            id={headingId(nodeText(children))}
            className="mt-16 mb-6 scroll-mt-28 font-display text-[28px] leading-tight font-bold tracking-[-0.025em] text-slate-900 first:mt-0 sm:text-[34px]"
        >
            {children}
        </h2>
    ),
    h3: ({ children }) => (
        <h3
            id={headingId(nodeText(children))}
            className="mt-10 mb-3 scroll-mt-28 font-display text-xl font-bold tracking-tight text-slate-900"
        >
            {children}
        </h3>
    ),
    p: ({ children }) => (
        <p className="mb-6 text-[19px] leading-[1.8] text-slate-700 last:mb-0">
            {children}
        </p>
    ),
    ul: ({ children }) => (
        <ul className="mb-8 border-b border-slate-200 last:mb-0">{children}</ul>
    ),
    ol: ({ children }) => (
        <ol className="mb-8 border-b border-slate-200 last:mb-0">{children}</ol>
    ),
    li: ({ children }) => <ListItem>{children}</ListItem>,
    strong: Strong,
    a: ({ href, children }) => (
        <a
            href={href}
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            className="text-teal-700 underline decoration-teal-300 underline-offset-4 transition-colors hover:decoration-teal-600"
        >
            {children}
        </a>
    ),
    code: ({ children }) => (
        <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.84em] text-slate-800">
            {children}
        </code>
    ),
    pre: ({ children }) => (
        <pre className="my-8 overflow-x-auto rounded-xl bg-[#1a1916] p-5 font-mono text-[14px] leading-relaxed text-slate-100 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
            {children}
        </pre>
    ),
    blockquote: ({ children }) => (
        <blockquote className="my-10 border-l-2 border-teal-500 pl-6 font-display text-[22px] leading-snug font-semibold text-slate-900 [&_p]:text-inherit">
            {children}
        </blockquote>
    ),
    img: ({ src, alt }) => (
        <img
            src={typeof src === 'string' ? src : undefined}
            alt={alt ?? ''}
            loading="lazy"
            className="my-10 w-full rounded-2xl border border-slate-200"
        />
    ),
    hr: () => <hr className="my-14 border-slate-200" />,
};
