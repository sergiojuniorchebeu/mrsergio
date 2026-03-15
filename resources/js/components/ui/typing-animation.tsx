// resources/js/components/ui/typing-animation.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, type MotionProps, useInView }   from "motion/react";
import { cn }                                     from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// TYPING ANIMATION — Typewriter effect with multi-word cycling
//
// Upgrades vs original:
// - Cleaner state machine (typing → pause → deleting)
// - Better cursor animation with CSS-only blink
// - Configurable cursor styles
// - Smooth opacity transition on cursor hide
//
// Usage:
//   <TypingAnimation duration={80} delay={600} className="gradient-text font-bold">
//     Chebeu
//   </TypingAnimation>
//
//   <TypingAnimation words={['Laravel', 'React', 'Flutter']} loop className="text-teal-600" />
// ─────────────────────────────────────────────────────────────────────────────

interface TypingAnimationProps extends MotionProps {
    children?: string;
    words?: string[];
    className?: string;
    duration?: number;
    typeSpeed?: number;
    deleteSpeed?: number;
    delay?: number;
    pauseDelay?: number;
    loop?: boolean;
    as?: React.ElementType;
    startOnView?: boolean;
    showCursor?: boolean;
    blinkCursor?: boolean;
    cursorStyle?: "line" | "block" | "underscore";
}

const cursorChars: Record<string, string> = {
    line:       "|",
    block:      "▌",
    underscore: "_",
};

export function TypingAnimation({
    children,
    words,
    className,
    duration = 100,
    typeSpeed,
    deleteSpeed,
    delay = 0,
    pauseDelay = 1000,
    loop = false,
    as: Component = "span",
    startOnView = true,
    showCursor = true,
    blinkCursor = true,
    cursorStyle = "line",
    ...motionProps
}: TypingAnimationProps) {
    const MotionComponent = motion.create(Component, { forwardMotionProps: true });

    const [displayedText, setDisplayedText] = useState("");
    const [wordIndex, setWordIndex]         = useState(0);
    const [charIndex, setCharIndex]         = useState(0);
    const [phase, setPhase]                 = useState<"typing" | "pause" | "deleting">("typing");

    const elementRef = useRef<HTMLElement | null>(null);
    const isInView   = useInView(elementRef as React.RefObject<Element>, {
        amount: 0.3,
        once: true,
    });

    const allWords      = useMemo(() => words || (children ? [children] : []), [words, children]);
    const isMultiWord   = allWords.length > 1;
    const typingSpeed   = typeSpeed || duration;
    const deletingSpeed = deleteSpeed || typingSpeed / 2;
    const shouldStart   = startOnView ? isInView : true;

    useEffect(() => {
        if (!shouldStart || allWords.length === 0) return;

        const currentWord  = allWords[wordIndex] || "";
        const graphemes    = Array.from(currentWord);

        // Determine delay for this tick
        const tickDelay =
            delay > 0 && displayedText === ""
                ? delay
                : phase === "typing"
                    ? typingSpeed
                    : phase === "deleting"
                        ? deletingSpeed
                        : pauseDelay;

        const timer = setTimeout(() => {
            switch (phase) {
                case "typing": {
                    if (charIndex < graphemes.length) {
                        setDisplayedText(graphemes.slice(0, charIndex + 1).join(""));
                        setCharIndex(i => i + 1);
                    } else if (isMultiWord || loop) {
                        const isLast = wordIndex === allWords.length - 1;
                        if (!isLast || loop) setPhase("pause");
                    }
                    break;
                }
                case "pause": {
                    setPhase("deleting");
                    break;
                }
                case "deleting": {
                    if (charIndex > 0) {
                        setDisplayedText(graphemes.slice(0, charIndex - 1).join(""));
                        setCharIndex(i => i - 1);
                    } else {
                        setWordIndex(i => (i + 1) % allWords.length);
                        setPhase("typing");
                    }
                    break;
                }
            }
        }, tickDelay);

        return () => clearTimeout(timer);
    }, [
        shouldStart, phase, charIndex, wordIndex, displayedText,
        allWords, isMultiWord, loop, typingSpeed, deletingSpeed, pauseDelay, delay,
    ]);

    // Determine if cursor should be visible
    const currentGraphemes = Array.from(allWords[wordIndex] || "");
    const isComplete =
        !loop &&
        wordIndex === allWords.length - 1 &&
        charIndex >= currentGraphemes.length &&
        phase !== "deleting";

    const cursorVisible =
        showCursor &&
        !isComplete &&
        (isMultiWord || loop || charIndex < currentGraphemes.length);

    return (
        <MotionComponent
            ref={elementRef}
            className={cn("leading-[5rem] tracking-[-0.02em]", className)}
            {...motionProps}
        >
            {displayedText}
            {cursorVisible && (
                <span
                    className={cn(
                        "inline-block ml-[1px] font-light",
                        blinkCursor && "animate-blink-cursor",
                    )}
                    aria-hidden="true"
                >
                    {cursorChars[cursorStyle]}
                </span>
            )}
        </MotionComponent>
    );
}