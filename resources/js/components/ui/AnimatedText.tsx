// resources/js/Components/ui/AnimatedText.tsx
import { motion } from 'framer-motion';

interface AnimatedTextProps {
    text: string;
    className?: string;
    delay?: number;
}

// Effet : les mots apparaissent un par un (comme Flutter StaggeredAnimation)
export function AnimatedText({ text, className, delay = 0 }: AnimatedTextProps) {
    const words = text.split(' ');

    return (
        <span className={className}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: delay + i * 0.1,  // chaque mot décalé de 100ms
                        ease: [0.23, 1, 0.32, 1],
                    }}
                    className="inline-block mr-[0.25em]"
                >
                    {word}
                </motion.span>
            ))}
        </span>
    );
}

// Effet : texte qui se révèle avec un clip (effet premium)
export function RevealText({ text, className, delay = 0 }: AnimatedTextProps) {
    return (
        <div className="overflow-hidden">
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay, ease: [0.23, 1, 0.32, 1] }}
                className={className}
            >
                {text}
            </motion.div>
        </div>
    );
}