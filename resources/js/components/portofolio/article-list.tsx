// resources/js/components/portofolio/article-list.tsx
// Articles en cartes qui « tombent » comme des pages posées sur une table :
// bascule 3D depuis le haut, colonne après colonne, et image dévoilée en rideau.

import { Link } from '@inertiajs/react';
import {
    motion,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from 'framer-motion';
import { useRef } from 'react';
import { HoverUnderline } from '@/components/ui/hover-underline';
import { useIsMobile } from '@/hooks/use-mobile';

export interface ArticleListItem {
    slug: string;
    title: string;
    excerpt?: string | null;
    desc?: string | null;
    cover_image_url?: string | null;
    image?: string | null;
    published_at?: string | null;
    date?: string | null;
    reading_time?: string | null;
    tags?: string[];
    tag?: string;
}

const DESKTOP_COLUMNS = 3;

function PageCard({
    article,
    index,
}: {
    article: ArticleListItem;
    index: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const isMobile = useIsMobile();
    const column = isMobile ? 0 : index % DESKTOP_COLUMNS;
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 1', 'start 0.5'],
    });
    const progress = useSpring(scrollYProgress, {
        stiffness: 140,
        damping: 26,
        mass: 0.4,
    });
    const start = column * 0.14;
    const range = [start, Math.min(1, start + 0.75)];
    const isStatic = Boolean(prefersReducedMotion);

    const rotateX = useTransform(
        progress,
        range,
        isStatic ? [0, 0] : [isMobile ? 38 : 62, 0],
    );
    const y = useTransform(progress, range, isStatic ? [0, 0] : [70, 0]);
    const opacity = useTransform(
        progress,
        [start, start + 0.3],
        isStatic ? [1, 1] : [0, 1],
    );
    const imageClip = useTransform(
        progress,
        range,
        isStatic
            ? ['inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)']
            : ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'],
    );
    const imageScale = useTransform(
        progress,
        range,
        isStatic ? [1, 1] : [1.2, 1],
    );

    const image = article.cover_image_url ?? article.image ?? null;
    const tags = article.tags ?? (article.tag ? [article.tag] : []);
    const meta = [
        article.published_at ?? article.date,
        article.reading_time,
    ].filter(Boolean);

    return (
        <div ref={ref} className="[perspective:1200px]">
            <motion.article
                style={{ rotateX, y, opacity, transformOrigin: '50% 0%' }}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-[border-color,box-shadow] duration-300 hover:border-slate-300 active:brightness-95 hover:shadow-[0_16px_40px_-20px_rgba(26,25,22,0.3)]"
            >
                <Link
                    href={`/blog/${article.slug}`}
                    aria-label={article.title}
                    className="absolute inset-0 z-10 rounded-2xl"
                />

                {image && (
                    <motion.div
                        style={{ clipPath: imageClip }}
                        className="aspect-[4/3] overflow-hidden bg-slate-100"
                    >
                        <motion.img
                            src={image}
                            alt={article.title}
                            loading="lazy"
                            style={{ scale: imageScale }}
                            className="h-full w-full object-cover transition-[filter] duration-500 group-hover:brightness-[1.04]"
                        />
                    </motion.div>
                )}

                <div className="flex flex-1 flex-col gap-2.5 p-5">
                    <p className="font-mono text-[11px] tracking-wide text-slate-400">
                        {meta.join(' · ')}
                        {tags[0] && <span> — {tags[0]}</span>}
                    </p>

                    <h3 className="line-clamp-2 font-display text-[19px] leading-snug font-bold tracking-[-0.01em] text-slate-900">
                        <HoverUnderline>
                            {article.title}
                        </HoverUnderline>
                    </h3>

                    {(article.excerpt ?? article.desc) && (
                        <p className="line-clamp-3 text-[15px] leading-relaxed text-slate-600">
                            {article.excerpt ?? article.desc}
                        </p>
                    )}
                </div>
            </motion.article>
        </div>
    );
}

export function ArticleList({ articles }: { articles: ArticleListItem[] }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
                <PageCard key={article.slug} article={article} index={index} />
            ))}
        </div>
    );
}
