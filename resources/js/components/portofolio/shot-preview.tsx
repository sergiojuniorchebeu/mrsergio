// resources/js/components/portofolio/shot-preview.tsx
// Aperçu de capture façon « page produit », sans cadre d'appareil :
// - fond teinté à la couleur dominante de la capture (identité du projet) ;
// - captures larges, ancrées en haut, dont le bas sort du cadre ;
// - portrait (mobile) → jusqu'à 3 écrans côte à côte ; paysage → une seule capture.

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const MAX_MOBILE_SCREENS = 3;
const MOBILE_GAP_PERCENT = 4;
const SAMPLE_SIZE = 24;
const NEUTRAL_TINT = 'var(--shot-neutral)';

interface ImageInfo {
    ratio: number;
    tint: string;
}

/**
 * Teinte douce tirée de la couleur moyenne de l'image (couleur neutre si l'image
 * est grise ou si son origine empêche de la lire).
 */
function tintFromImage(image: HTMLImageElement): string {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = SAMPLE_SIZE;
        canvas.height = SAMPLE_SIZE;
        const context = canvas.getContext('2d', { willReadFrequently: true });

        if (!context) {
            return NEUTRAL_TINT;
        }

        context.drawImage(image, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        const { data } = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        let red = 0;
        let green = 0;
        let blue = 0;
        let count = 0;

        for (let index = 0; index < data.length; index += 4) {
            const [r, g, b] = [data[index], data[index + 1], data[index + 2]];
            const isNearWhiteOrBlack =
                (r > 240 && g > 240 && b > 240) || (r < 15 && g < 15 && b < 15);

            if (!isNearWhiteOrBlack) {
                red += r;
                green += g;
                blue += b;
                count++;
            }
        }

        if (count === 0) {
            return NEUTRAL_TINT;
        }

        const [r, g, b] = [
            red / count / 255,
            green / count / 255,
            blue / count / 255,
        ];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const lightness = (max + min) / 2;
        const delta = max - min;
        const saturation =
            delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

        if (saturation < 0.12) {
            return NEUTRAL_TINT;
        }

        let hue = 0;

        if (max === r) {
            hue = ((g - b) / delta) % 6;
        } else if (max === g) {
            hue = (b - r) / delta + 2;
        } else {
            hue = (r - g) / delta + 4;
        }

        return `hsl(${Math.round((hue * 60 + 360) % 360)} ${Math.round(Math.min(saturation, 0.6) * 55)}% var(--shot-tint-l))`;
    } catch {
        return NEUTRAL_TINT;
    }
}

function useImageInfo(src: string): ImageInfo | null {
    const [infos, setInfos] = useState<Record<string, ImageInfo>>({});

    useEffect(() => {
        const image = new Image();
        image.onload = () => {
            if (image.naturalHeight > 0) {
                const info = {
                    ratio: image.naturalWidth / image.naturalHeight,
                    tint: tintFromImage(image),
                };
                setInfos((current) => ({ ...current, [src]: info }));
            }
        };
        image.src = src;

        return () => {
            image.onload = null;
        };
    }, [src]);

    return infos[src] ?? null;
}

function useBoxRatio<T extends HTMLElement>(): [
    React.RefObject<T | null>,
    number,
] {
    const ref = useRef<T>(null);
    const [ratio, setRatio] = useState(16 / 10);

    useLayoutEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;

            if (height > 0) {
                setRatio(width / height);
            }
        });
        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return [ref, ratio];
}

const STAGGER_MAX_COLUMNS = 4;
const STAGGER_SCREEN_HEIGHT = 0.8;
const STAGGER_GAP = 0.05;
const STAGGER_BLEED = 0.17;

/**
 * Écrans mobiles en colonnes alternées, façon fiche App Store / Play Store :
 * un écran sur deux colle au bord du haut (on en voit le bas), l'autre au bord du bas
 * (on en voit le haut). Le nombre de colonnes s'adapte à la largeur disponible.
 */
function StaggeredScreens({
    screens,
    ratio,
    tint,
    alt,
    eager,
    className,
}: {
    screens: string[];
    ratio: number;
    tint: string;
    alt: string;
    eager: boolean;
    className?: string;
}) {
    const [boxRef, boxRatio] = useBoxRatio<HTMLDivElement>();
    let screenHeight = STAGGER_SCREEN_HEIGHT;
    let screenWidth = (screenHeight * ratio) / boxRatio;
    const fittingColumns = Math.floor(
        (1 - STAGGER_GAP) / (screenWidth + STAGGER_GAP),
    );
    const columns = Math.max(2, Math.min(STAGGER_MAX_COLUMNS, fittingColumns));

    if (columns * screenWidth + (columns + 1) * STAGGER_GAP > 1) {
        screenWidth = (1 - (columns + 1) * STAGGER_GAP) / columns;
        screenHeight = (screenWidth * boxRatio) / ratio;
    }

    const shown = Array.from(
        { length: columns },
        (_, index) => screens[index % screens.length],
    );
    const totalWidth = columns * screenWidth + (columns - 1) * STAGGER_GAP;
    const startLeft = (1 - totalWidth) / 2;

    return (
        <div
            ref={boxRef}
            className={cn(
                'relative h-full w-full overflow-hidden transition-colors duration-700',
                className,
            )}
            style={{ backgroundColor: tint }}
        >
            {shown.map((screen, index) => {
                const isAnchoredTop = index % 2 === 0;

                return (
                    <div
                        key={`${screen}-${index}`}
                        style={{
                            left: `${(startLeft + index * (screenWidth + STAGGER_GAP)) * 100}%`,
                            width: `${screenWidth * 100}%`,
                            aspectRatio: String(ratio),
                            [isAnchoredTop ? 'top' : 'bottom']:
                                `${-STAGGER_BLEED * 100}%`,
                        }}
                        className={cn(
                            'absolute overflow-hidden rounded-[9%/4.2%] bg-white shadow-[0_0_0_1px_rgba(26,25,22,0.07),0_24px_48px_-20px_rgba(26,25,22,0.45)]',
                            'transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]',
                            isAnchoredTop
                                ? 'group-hover:translate-y-[3%]'
                                : 'group-hover:-translate-y-[3%]',
                        )}
                    >
                        <img
                            src={screen}
                            alt={index === 0 ? alt : ''}
                            loading={eager ? 'eager' : 'lazy'}
                            decoding="async"
                            draggable={false}
                            className="h-full w-full object-cover object-top"
                        />
                    </div>
                );
            })}
        </div>
    );
}

export function ShotPreview({
    src,
    alt,
    moreSrcs = [],
    className,
    eager = false,
    tiltMobile = false,
    fit = false,
}: {
    src: string;
    alt: string;
    /** Autres captures du projet, utilisées pour montrer plusieurs écrans mobiles. */
    moreSrcs?: string[];
    className?: string;
    eager?: boolean;
    /** Captures mobiles : colonnes alternées haut / bas (style fiche App Store / Play Store). */
    tiltMobile?: boolean;
    /** Image entière, centrée, sans débordement (couvertures, illustrations). */
    fit?: boolean;
}) {
    const info = useImageInfo(src);
    const [boxRef, boxRatio] = useBoxRatio<HTMLDivElement>();
    const isMobileShot = info !== null && info.ratio < 0.8;
    const screens = isMobileShot
        ? [src, ...moreSrcs.filter((other) => other !== src)].slice(
              0,
              MAX_MOBILE_SCREENS,
          )
        : [src];
    const gapPercent = isMobileShot ? MOBILE_GAP_PERCENT : 0;
    const groupRatio = info
        ? (screens.length * info.ratio) /
          (1 - (gapPercent / 100) * (screens.length - 1))
        : 1;
    /**
     * Ajustée en largeur, la capture doit remplir au moins 75 % de la hauteur disponible ;
     * sinon (panneau presque carré) elle s'ajuste en hauteur et déborde aussi à droite.
     */
    const widthFitHeightShare = boxRatio / groupRatio;
    const bleedsRight =
        !fit && groupRatio >= boxRatio && widthFitHeightShare < 0.75;
    const fitsWidth = groupRatio >= boxRatio && !bleedsRight;
    const screenWidthPercent =
        (100 - gapPercent * (screens.length - 1)) / screens.length;

    if (tiltMobile && info && isMobileShot) {
        return (
            <StaggeredScreens
                screens={[src, ...moreSrcs.filter((other) => other !== src)]}
                ratio={info.ratio}
                tint={info.tint}
                alt={alt}
                eager={eager}
                className={className}
            />
        );
    }

    return (
        <div
            className={cn(
                'relative h-full w-full overflow-hidden transition-colors duration-700',
                className,
            )}
            style={{ backgroundColor: info?.tint ?? NEUTRAL_TINT }}
        >
            {/* Zone d'ancrage : démarre sous le haut du cadre et déborde volontairement en bas. */}
            <div
                ref={boxRef}
                className={cn(
                    'absolute flex',
                    fit
                        ? 'inset-[5%] items-center justify-center'
                        : 'inset-x-[6%] top-[7%] -bottom-[18%] items-start',
                    !fit && (bleedsRight ? 'justify-start' : 'justify-center'),
                )}
            >
                {info === null ? (
                    <div className="h-full w-full animate-pulse rounded-t-[10px] bg-white/60" />
                ) : (
                    <div
                        className="flex items-start justify-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-[3%]"
                        style={{
                            aspectRatio: String(groupRatio),
                            width: fitsWidth ? '100%' : 'auto',
                            height: fitsWidth ? 'auto' : '100%',
                            flexShrink: 0,
                            gap: `${gapPercent}%`,
                        }}
                    >
                        {screens.map((screen, index) => (
                            <div
                                key={screen}
                                style={{
                                    aspectRatio: String(info.ratio),
                                    width: `${screenWidthPercent}%`,
                                }}
                                className="shrink-0 overflow-hidden rounded-[10px] bg-white shadow-[0_0_0_1px_rgba(26,25,22,0.07),0_24px_48px_-20px_rgba(26,25,22,0.4)]"
                            >
                                <img
                                    src={screen}
                                    alt={
                                        index === 0
                                            ? alt
                                            : `${alt} — ${index + 1}`
                                    }
                                    loading={eager ? 'eager' : 'lazy'}
                                    decoding="async"
                                    draggable={false}
                                    className="h-full w-full object-cover object-top"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
