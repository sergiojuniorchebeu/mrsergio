// resources/js/components/portofolio/project-gallery.tsx
// Vitrine des captures en « coverflow » 3D.
// Chaque capture reçoit un cadre adapté à son format (téléphone, navigateur, carte),
// défilement piloté par le scroll (desktop, section épinglée) ou au doigt (mobile),
// visionneuse plein écran au clic (clavier + swipe).

import {
    animate,
    AnimatePresence,
    motion,
    useMotionValue,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from 'framer-motion';
import type { MotionValue, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Lock, X } from 'lucide-react';
import type { ReactNode } from 'react';
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';
import { buttonVariants } from '@/components/ui/button';
import { MaskedLine } from '@/components/ui/reveal';
import { SectionBackdrop } from '@/components/ui/section-backdrop';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from '@/lib/i18n';
import { cn, easings } from '@/lib/utils';

const SWIPE_THRESHOLD_PX = 60;
const ITEM_GAP_PX = 40;
const BROWSER_BAR_PX = 40;
/** MacBook : part de la largeur occupée par l'écran, bordures, et hauteur de la base. */
const LAPTOP_SCREEN_SHARE = 0.86;
const LAPTOP_BEZEL_PX = 10;
const LAPTOP_BEZEL_TOP_PX = 18;
const LAPTOP_BASE_SHARE = 0.032;
const PHONE_BEZEL_PX = 9;
const SCROLL_VH_PER_SHOT = 45;
const DEFAULT_RATIO = 1179 / 2556;

type ShotKind = 'phone' | 'browser' | 'laptop' | 'card';

function subscribeNever(): () => void {
    return () => {};
}

function useIsClient(): boolean {
    return useSyncExternalStore(
        subscribeNever,
        () => true,
        () => false,
    );
}

/**
 * Cadre selon le format : portrait → téléphone ; paysage → MacBook pour un logiciel
 * desktop, fenêtre Safari sinon ; carré → simple carte.
 */
function shotKind(ratio: number, projectType: string): ShotKind {
    if (ratio < 0.8) {
        return 'phone';
    }

    if (ratio > 1.2) {
        return projectType === 'desktop' ? 'laptop' : 'browser';
    }

    return 'card';
}

interface ShotLayout {
    kind: ShotKind;
    width: number;
    height: number;
    center: number;
}

/** Hauteur totale d'un MacBook pour une largeur donnée (écran + bordures + base). */
function laptopHeight(width: number, ratio: number): number {
    const screenInnerWidth = width * LAPTOP_SCREEN_SHARE - LAPTOP_BEZEL_PX * 2;

    return (
        screenInnerWidth / ratio +
        LAPTOP_BEZEL_TOP_PX +
        LAPTOP_BEZEL_PX +
        width * LAPTOP_BASE_SHARE
    );
}

/** Largeur d'un MacBook qui tient dans une hauteur donnée (inverse de laptopHeight). */
function laptopWidth(height: number, ratio: number): number {
    return (
        (height -
            LAPTOP_BEZEL_TOP_PX -
            LAPTOP_BEZEL_PX +
            (LAPTOP_BEZEL_PX * 2) / ratio) /
        (LAPTOP_SCREEN_SHARE / ratio + LAPTOP_BASE_SHARE)
    );
}

/**
 * Place chaque capture : hauteur de la scène, mais largeur plafonnée
 * (les captures web/desktop, très larges, sont réduites au lieu de déborder).
 */
function computeLayout(
    ratios: number[],
    stageHeight: number,
    stageWidth: number,
    projectType: string,
): ShotLayout[] {
    const isNarrow = stageWidth < 768;
    let cursor = 0;

    return ratios.map((ratio) => {
        const kind = shotKind(ratio, projectType);
        const maxWidth =
            stageWidth * (isNarrow ? 0.86 : kind === 'laptop' ? 0.66 : 0.6);
        let width: number;
        let height: number;

        if (kind === 'laptop') {
            width = Math.min(laptopWidth(stageHeight, ratio), maxWidth);
            height = laptopHeight(width, ratio);
        } else {
            const verticalChrome =
                kind === 'browser'
                    ? BROWSER_BAR_PX
                    : kind === 'phone'
                      ? PHONE_BEZEL_PX * 2
                      : 0;
            const horizontalChrome = kind === 'phone' ? PHONE_BEZEL_PX * 2 : 0;
            height = stageHeight;
            width = (height - verticalChrome) * ratio + horizontalChrome;

            if (width > maxWidth) {
                width = maxWidth;
                height = (width - horizontalChrome) / ratio + verticalChrome;
            }
        }

        const center = cursor + width / 2;
        cursor += width + ITEM_GAP_PX;

        return { kind, width, height, center };
    });
}

function centerAt(layout: ShotLayout[], position: number): number {
    if (layout.length === 0) {
        return 0;
    }

    const clamped = Math.min(Math.max(position, 0), layout.length - 1);
    const lower = Math.floor(clamped);
    const upper = Math.min(lower + 1, layout.length - 1);
    const fraction = clamped - lower;

    return (
        layout[lower].center +
        (layout[upper].center - layout[lower].center) * fraction
    );
}

// ─── Cadres ──────────────────────────────────────────────────────────────────
function TrafficLights() {
    return (
        <span className="flex shrink-0 gap-[7px]">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-black/10 ring-inset" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e] ring-1 ring-black/10 ring-inset" />
            <span className="h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-black/10 ring-inset" />
        </span>
    );
}

function SafariWindow({
    image,
    host,
}: {
    image: ReactNode;
    host: string | null;
}) {
    return (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-[12px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_30px_60px_-30px_rgba(26,25,22,0.5)]">
            <div
                className="grid shrink-0 grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-black/[0.08] bg-[#f6f6f6] px-3.5"
                style={{ height: BROWSER_BAR_PX }}
            >
                <span className="flex items-center gap-3">
                    <TrafficLights />
                    <span className="hidden items-center gap-1 text-[#b4b4b4] sm:flex">
                        <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
                        <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                </span>
                <span className="mx-auto flex h-[24px] w-full max-w-[60%] min-w-0 items-center justify-center gap-1.5 rounded-md bg-[#e9e9eb] px-3 text-[11px] text-[#5f5f5f]">
                    <Lock className="h-2.5 w-2.5 shrink-0" strokeWidth={2.5} />
                    <span className="truncate">{host ?? 'localhost'}</span>
                </span>
                <span className="w-[52px] sm:w-[92px]" />
            </div>
            <div className="min-h-0 flex-1">{image}</div>
        </div>
    );
}

function MacBook({ image }: { image: ReactNode }) {
    return (
        <div className="flex h-full w-full flex-col items-center">
            <div
                className="relative flex min-h-0 flex-1 flex-col rounded-t-[16px] rounded-b-[4px] bg-[#0c0c0d] shadow-[0_0_0_1px_#2a2a2c,0_30px_60px_-30px_rgba(26,25,22,0.55)]"
                style={{
                    width: `${LAPTOP_SCREEN_SHARE * 100}%`,
                    padding: `${LAPTOP_BEZEL_TOP_PX}px ${LAPTOP_BEZEL_PX}px ${LAPTOP_BEZEL_PX}px`,
                }}
            >
                <span className="absolute top-[6px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#2b2b30] ring-1 ring-[#3a3a40]" />
                <div className="min-h-0 flex-1 overflow-hidden rounded-[3px] bg-black">
                    {image}
                </div>
            </div>
            <div
                className="relative w-full"
                style={{ aspectRatio: `${1 / LAPTOP_BASE_SHARE}` }}
            >
                <div className="absolute inset-0 rounded-t-[3px] rounded-b-[14px] border-b-2 border-[#a9a9ae] bg-[#d6d6db] shadow-[0_18px_30px_-18px_rgba(26,25,22,0.6)]" />
                <span className="absolute top-0 left-1/2 h-[45%] w-[15%] -translate-x-1/2 rounded-b-[6px] bg-[#bdbdc3]" />
            </div>
        </div>
    );
}

function Frame({
    kind,
    src,
    alt,
    host,
    isEager,
    onRatio,
}: {
    kind: ShotKind;
    src: string;
    alt: string;
    host: string | null;
    isEager: boolean;
    onRatio: (ratio: number) => void;
}) {
    const image = (
        <img
            src={src}
            alt={alt}
            draggable={false}
            loading={isEager ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={(event) => {
                const { naturalWidth, naturalHeight } = event.currentTarget;

                if (naturalHeight > 0) {
                    onRatio(naturalWidth / naturalHeight);
                }
            }}
            className="h-full w-full bg-slate-100 object-cover object-top select-none"
        />
    );

    if (kind === 'phone') {
        return (
            <div
                className="relative h-full w-full rounded-[2.4rem] bg-[#1a1916] shadow-[0_30px_60px_-30px_rgba(26,25,22,0.55)]"
                style={{ padding: PHONE_BEZEL_PX }}
            >
                <div className="relative h-full w-full overflow-hidden rounded-[1.9rem] bg-black">
                    {image}
                </div>
            </div>
        );
    }

    if (kind === 'laptop') {
        return <MacBook image={image} />;
    }

    if (kind === 'browser') {
        return <SafariWindow image={image} host={host} />;
    }

    return (
        <div className="h-full w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_30px_60px_-30px_rgba(26,25,22,0.4)]">
            {image}
        </div>
    );
}

// ─── Élément du coverflow ────────────────────────────────────────────────────
function CoverflowItem({
    index,
    layout,
    allLayouts,
    position,
    stageHeight,
    isLight,
    children,
    onSelect,
}: {
    index: number;
    layout: ShotLayout;
    allLayouts: ShotLayout[];
    position: MotionValue<number>;
    stageHeight: number;
    isLight: boolean;
    children: ReactNode;
    onSelect: (index: number) => void;
}) {
    const { l } = useTranslation();
    const maxRotation = isLight ? 30 : 50;
    const x = useTransform(
        position,
        (p) => layout.center - centerAt(allLayouts, p) - layout.width / 2,
    );
    const rotateY = useTransform(position, (p) =>
        Math.max(
            -maxRotation,
            Math.min(maxRotation, (p - index) * (isLight ? 26 : 38)),
        ),
    );
    const scale = useTransform(
        position,
        (p) => 1 - Math.min(Math.abs(p - index), 2.5) * 0.12,
    );
    const opacity = useTransform(position, (p) =>
        Math.max(0, 1 - Math.max(0, Math.abs(p - index) - 1) * 0.45),
    );
    const visibility = useTransform(position, (p) =>
        Math.abs(p - index) > 3.2 ? 'hidden' : 'visible',
    );
    const zIndex = useTransform(
        position,
        (p) => 100 - Math.round(Math.abs(p - index) * 10),
    );
    const filter = useTransform(position, (p) =>
        isLight
            ? 'none'
            : `brightness(${1 - Math.min(Math.abs(p - index), 1) * 0.12})`,
    );

    return (
        <motion.button
            type="button"
            onClick={() => onSelect(index)}
            aria-label={`${l('Capture', 'Screenshot')} ${index + 1}`}
            style={{
                x,
                rotateY,
                scale,
                opacity,
                visibility,
                zIndex,
                filter,
                width: layout.width,
                height: layout.height,
                top: (stageHeight - layout.height) / 2,
            }}
            className="absolute left-1/2 origin-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
            {children}
        </motion.button>
    );
}

// ─── Scène commune ───────────────────────────────────────────────────────────
function Stage({
    images,
    title,
    host,
    projectType,
    position,
    activeIndex,
    onSelect,
    onJump,
    stageClassName,
    header,
    stageProps,
}: {
    images: string[];
    title: string;
    host: string | null;
    projectType: string;
    position: MotionValue<number>;
    activeIndex: number;
    onSelect: (index: number) => void;
    onJump: (index: number) => void;
    stageClassName: string;
    header: ReactNode;
    stageProps?: React.ComponentProps<typeof motion.div>;
}) {
    const { l } = useTranslation();
    const stageRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();
    const [stageSize, setStageSize] = useState({ width: 1200, height: 480 });
    const [ratios, setRatios] = useState<number[]>(() =>
        images.map(() => DEFAULT_RATIO),
    );
    const layout = computeLayout(
        ratios,
        stageSize.height,
        stageSize.width,
        projectType,
    );

    const updateRatio = useCallback((index: number, ratio: number) => {
        setRatios((current) => {
            if (Math.abs(current[index] - ratio) < 0.001) {
                return current;
            }

            const next = [...current];
            next[index] = ratio;

            return next;
        });
    }, []);

    useLayoutEffect(() => {
        const stage = stageRef.current;

        if (!stage) {
            return;
        }

        const observer = new ResizeObserver(([entry]) =>
            setStageSize({
                width: entry.contentRect.width,
                height: entry.contentRect.height,
            }),
        );
        observer.observe(stage);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="flex w-full flex-col gap-8">
            {header}

            <motion.div
                ref={stageRef}
                className={cn(
                    'relative w-full touch-pan-y overflow-hidden [perspective:1600px]',
                    stageClassName,
                )}
                {...stageProps}
            >
                {images.map((src, index) => (
                    <CoverflowItem
                        key={src}
                        index={index}
                        layout={layout[index]}
                        allLayouts={layout}
                        position={position}
                        stageHeight={stageSize.height}
                        isLight={isMobile}
                        onSelect={onSelect}
                    >
                        <Frame
                            kind={layout[index].kind}
                            src={src}
                            alt={`${title} — capture ${index + 1}`}
                            host={host}
                            isEager={index <= 2}
                            onRatio={(ratio) => updateRatio(index, ratio)}
                        />
                    </CoverflowItem>
                ))}
            </motion.div>

            <div className="container-main flex items-center justify-center gap-5">
                <span className="w-14 text-right font-mono text-[12px] text-slate-500 tabular-nums">
                    {String(activeIndex + 1).padStart(2, '0')} /{' '}
                    {String(images.length).padStart(2, '0')}
                </span>
                <div className="flex items-center gap-1.5">
                    {images.map((src, index) => (
                        <button
                            key={src}
                            type="button"
                            onClick={() => onJump(index)}
                            aria-label={`${l('Aller à la capture', 'Go to screenshot')} ${index + 1}`}
                            className="flex h-8 items-center px-0.5"
                        >
                            <span
                                className={cn(
                                    'block h-1.5 rounded-full transition-all duration-300',
                                    index === activeIndex
                                        ? 'w-6 bg-teal-600'
                                        : 'w-1.5 bg-slate-300 hover:bg-slate-400',
                                )}
                            />
                        </button>
                    ))}
                </div>
                <span className="w-14" />
            </div>
        </div>
    );
}

function GalleryHeader({ count }: { count: number }) {
    const { l } = useTranslation();

    return (
        <div className="container-main flex items-end justify-between gap-6">
            <h2 className="font-display text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-[44px]">
                <MaskedLine onScroll>
                    {l('En images', 'In pictures')}
                </MaskedLine>
            </h2>
            <span className="font-mono text-[12px] text-slate-500">
                {count} {l('captures', 'screenshots')}
            </span>
        </div>
    );
}

// ─── Desktop : piloté par le scroll ──────────────────────────────────────────
function ScrollCoverflow({
    images,
    title,
    host,
    projectType,
    onOpen,
}: {
    images: string[];
    title: string;
    host: string | null;
    projectType: string;
    onOpen: (index: number) => void;
}) {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end end'],
    });
    const smooth = useSpring(scrollYProgress, {
        stiffness: 140,
        damping: 28,
        mass: 0.4,
    });
    const position = useTransform(smooth, [0, 1], [0, images.length - 1]);
    const scrollDistanceVh = (images.length - 1) * SCROLL_VH_PER_SHOT;

    useMotionValueEvent(position, 'change', (p) =>
        setActiveIndex(Math.round(p)),
    );

    const jumpTo = (index: number) => {
        const section = sectionRef.current;

        if (!section) {
            return;
        }

        const distance = section.offsetHeight - window.innerHeight;
        const top = section.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
            top: top + (distance * index) / Math.max(1, images.length - 1),
            behavior: 'smooth',
        });
    };

    return (
        <section
            ref={sectionRef}
            className="relative isolate"
            style={{ height: `calc(100svh + ${scrollDistanceVh}vh)` }}
        >
            <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
                <SectionBackdrop pattern="grid" />
                <Stage
                    images={images}
                    title={title}
                    host={host}
                    projectType={projectType}
                    position={position}
                    activeIndex={activeIndex}
                    onSelect={(index) =>
                        index === activeIndex ? onOpen(index) : jumpTo(index)
                    }
                    onJump={jumpTo}
                    stageClassName="h-[min(62svh,640px)]"
                    header={<GalleryHeader count={images.length} />}
                />
            </div>
        </section>
    );
}

// ─── Mobile : piloté au doigt ────────────────────────────────────────────────
function SwipeCoverflow({
    images,
    title,
    host,
    projectType,
    onOpen,
}: {
    images: string[];
    title: string;
    host: string | null;
    projectType: string;
    onOpen: (index: number) => void;
}) {
    const position = useMotionValue(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const isPanningRef = useRef(false);
    const lastIndex = images.length - 1;

    useMotionValueEvent(position, 'change', (p) =>
        setActiveIndex(Math.min(lastIndex, Math.max(0, Math.round(p)))),
    );

    const settleOn = (index: number) => {
        animate(position, Math.min(lastIndex, Math.max(0, index)), {
            type: 'spring',
            stiffness: 260,
            damping: 30,
        });
    };

    const handlePan = (_: PointerEvent, info: PanInfo) => {
        position.set(
            Math.min(
                lastIndex + 0.3,
                Math.max(-0.3, position.get() - info.delta.x / 220),
            ),
        );
    };

    const handlePanEnd = (_: PointerEvent, info: PanInfo) => {
        const projected = position.get() - info.velocity.x / 900;
        settleOn(Math.round(projected));
        setTimeout(() => {
            isPanningRef.current = false;
        }, 80);
    };

    const handleSelect = (index: number) => {
        if (isPanningRef.current) {
            return;
        }

        if (index === activeIndex) {
            onOpen(index);
        } else {
            settleOn(index);
        }
    };

    return (
        <section className="relative isolate py-16">
            <Stage
                images={images}
                title={title}
                host={host}
                projectType={projectType}
                position={position}
                activeIndex={activeIndex}
                onSelect={handleSelect}
                onJump={settleOn}
                stageClassName="h-[54svh]"
                header={<GalleryHeader count={images.length} />}
                stageProps={{
                    onPanStart: () => {
                        isPanningRef.current = true;
                    },
                    onPan: handlePan,
                    onPanEnd: handlePanEnd,
                }}
            />
        </section>
    );
}

// ─── Visionneuse plein écran ─────────────────────────────────────────────────
function Lightbox({
    images,
    title,
    index,
    onClose,
    onNavigate,
}: {
    images: string[];
    title: string;
    index: number;
    onClose: () => void;
    onNavigate: (index: number) => void;
}) {
    const { l } = useTranslation();
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const total = images.length;
    const previous = useCallback(
        () => onNavigate((index - 1 + total) % total),
        [index, total, onNavigate],
    );
    const next = useCallback(
        () => onNavigate((index + 1) % total),
        [index, total, onNavigate],
    );

    useEffect(() => {
        closeButtonRef.current?.focus();
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            } else if (event.key === 'ArrowLeft') {
                previous();
            } else if (event.key === 'ArrowRight') {
                next();
            }
        };

        window.addEventListener('keydown', handleKey);

        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose, previous, next]);

    return (
        <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${l('Captures de', 'Screenshots of')} ${title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="theme-lock fixed inset-0 z-[90] flex flex-col bg-[#0f0e0c]/95 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="flex items-center justify-between px-5 py-4 text-white/70"
                onClick={(e) => e.stopPropagation()}
            >
                <span className="font-mono text-[13px] tabular-nums">
                    {String(index + 1).padStart(2, '0')} /{' '}
                    {String(total).padStart(2, '0')}
                </span>
                <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={onClose}
                    aria-label={l('Fermer', 'Close')}
                    className={buttonVariants({
                        variant: 'dark',
                        size: 'icon',
                    })}
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-6 sm:px-20">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.img
                        key={images[index]}
                        src={images[index]}
                        alt={`${title} — capture ${index + 1}`}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.35, ease: easings.smooth }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.6}
                        onDragEnd={(_, info) => {
                            if (info.offset.x < -SWIPE_THRESHOLD_PX) {
                                next();
                            } else if (info.offset.x > SWIPE_THRESHOLD_PX) {
                                previous();
                            }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-full max-w-full cursor-grab rounded-xl object-contain shadow-2xl active:cursor-grabbing"
                    />
                </AnimatePresence>

                {total > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                previous();
                            }}
                            aria-label={l(
                                'Capture précédente',
                                'Previous screenshot',
                            )}
                            className={buttonVariants({
                                variant: 'dark',
                                size: 'icon',
                                className:
                                    'absolute left-4 hidden sm:inline-flex',
                            })}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                next();
                            }}
                            aria-label={l(
                                'Capture suivante',
                                'Next screenshot',
                            )}
                            className={buttonVariants({
                                variant: 'dark',
                                size: 'icon',
                                className:
                                    'absolute right-4 hidden sm:inline-flex',
                            })}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </>
                )}
            </div>
        </motion.div>
    );
}

// ─── Export ──────────────────────────────────────────────────────────────────
export function ProjectGallery({
    images,
    title,
    siteUrl,
    projectType = 'web',
}: {
    images: string[];
    title: string;
    siteUrl?: string | null;
    projectType?: string;
}) {
    const isMobile = useIsMobile();
    const prefersReducedMotion = useReducedMotion();
    const isClient = useIsClient();
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const host = siteUrl
        ? siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
        : null;

    if (images.length === 0) {
        return null;
    }

    const Coverflow =
        isMobile || prefersReducedMotion ? SwipeCoverflow : ScrollCoverflow;

    return (
        <>
            <Coverflow
                images={images}
                title={title}
                host={host}
                projectType={projectType}
                onOpen={setOpenIndex}
            />
            {isClient &&
                createPortal(
                    <AnimatePresence>
                        {openIndex !== null && (
                            <Lightbox
                                images={images}
                                title={title}
                                index={openIndex}
                                onClose={() => setOpenIndex(null)}
                                onNavigate={setOpenIndex}
                            />
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </>
    );
}
