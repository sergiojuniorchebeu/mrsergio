import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    createContext,
    useContext,
    useEffect,
    useId,
    useMemo,
    useState,
} from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type Language = 'fr' | 'en';

const translations = {
    fr: {
        'language.label': 'Langue',
        'nav.home': 'Accueil',
        'nav.projects': 'Projets',
        'nav.blog': 'Blog',
        'nav.trainings': 'Formations',
        'nav.contact': 'Contact',
        'nav.contact_me': 'Me contacter',
        'footer.explore': 'Explorer',
        'footer.follow': 'Suivre',
        'footer.hosted_by': 'Hébergé par',
        'footer.based_in': 'Basé au Cameroun · Disponible à distance',
        'footer.rights': 'Tous droits réservés',
        'footer.idea': 'Une idée, une application à construire ?',
        'footer.description':
            'Développeur full stack basé au Cameroun. Web, Android et formations.',
        'training.live_sessions': 'Sessions en direct',
        'training.next_sessions': 'Les prochains rendez-vous.',
        'training.live_intro':
            'Des cours gratuits, en petit groupe, avec un vrai temps pour les questions.',
        'training.live_session': 'Session en direct',
        'training.full': 'Complet',
        'training.available': 'Places disponibles',
        'training.place_available': 'place disponible',
        'training.places_available': 'places disponibles',
        'training.book_place': 'Réserver ma place',
        'training.google_calendar': 'Google Agenda',
        'training.choose_session': 'Choisir une session',
        'training.next_dates': 'Je souhaite connaître les prochaines dates',
        'training.waitlist': 'Liste d’attente',
        'training.confirmed': 'Inscrit·e',
        'training.join_meet': 'Rejoindre Google Meet',
        'training.add_calendar': 'Ajouter à Google Agenda',
        'training.request_sent':
            'Votre demande a bien été envoyée. Je reviendrai vers vous rapidement.',
        'training.waiting_list':
            'La session est complète. Votre demande a été ajoutée à la liste d’attente.',
        'training.interested': 'Intéressé par',
        'training.this_training': 'cette formation ?',
        'training.inscription': 'Inscription',
        'training.name': 'Nom complet',
        'training.email': 'Email',
        'training.phone': 'Téléphone',
        'training.message': 'Message',
        'training.optional': 'Facultatif',
        'training.submit': 'Demander cette formation',
        'training.sending': 'Envoi en cours…',
        'training.send_another': 'Envoyer une autre demande',
        'training.start_free': 'Commencer gratuitement',
        'training.access': 'Accéder à la formation',
        'training.form_intro':
            'Laissez vos coordonnées. Je vous recontacte pour répondre à vos questions et préciser les prochaines étapes.',
        'training.message_placeholder':
            'Une question ou un besoin particulier ?',
    },
    en: {
        'language.label': 'Language',
        'nav.home': 'Home',
        'nav.projects': 'Projects',
        'nav.blog': 'Blog',
        'nav.trainings': 'Training',
        'nav.contact': 'Contact',
        'nav.contact_me': 'Get in touch',
        'footer.explore': 'Explore',
        'footer.follow': 'Follow',
        'footer.hosted_by': 'Hosted by',
        'footer.based_in': 'Based in Cameroon · Available remotely',
        'footer.rights': 'All rights reserved',
        'footer.idea': 'An idea, an application to build?',
        'footer.description':
            'Full-stack developer based in Cameroon. Web, Android and training.',
        'training.live_sessions': 'Live sessions',
        'training.next_sessions': 'Upcoming sessions.',
        'training.live_intro':
            'Free small-group classes with real time for questions.',
        'training.live_session': 'Live session',
        'training.full': 'Full',
        'training.available': 'Spots available',
        'training.place_available': 'spot available',
        'training.places_available': 'spots available',
        'training.book_place': 'Reserve my spot',
        'training.google_calendar': 'Google Calendar',
        'training.choose_session': 'Choose a session',
        'training.next_dates': 'I would like to know the next dates',
        'training.waitlist': 'Waiting list',
        'training.confirmed': 'Registered',
        'training.join_meet': 'Join Google Meet',
        'training.add_calendar': 'Add to Google Calendar',
        'training.request_sent':
            'Your request has been sent. I will get back to you shortly.',
        'training.waiting_list':
            'This session is full. Your request has been added to the waiting list.',
        'training.interested': 'Interested in',
        'training.this_training': 'this training?',
        'training.inscription': 'Registration',
        'training.name': 'Full name',
        'training.email': 'Email',
        'training.phone': 'Phone',
        'training.message': 'Message',
        'training.optional': 'Optional',
        'training.submit': 'Request this training',
        'training.sending': 'Sending…',
        'training.send_another': 'Send another request',
        'training.start_free': 'Start for free',
        'training.access': 'Access the training',
        'training.form_intro':
            'Leave your details. I will get back to answer your questions and explain the next steps.',
        'training.message_placeholder': 'A question or a specific need?',
    },
} as const;

type TranslationKey = keyof typeof translations.fr;
interface LanguageContextValue {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: TranslationKey) => string;
    /** Texte en ligne : `l('Projets', 'Projects')`. */
    l: (french: string, english: string) => string;
}
const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'mrsergio-language';
const COOKIE_NAME = 'language';

function readCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));

    return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Le cookie transmet la langue au serveur (messages, dates, erreurs de formulaire).
 */
function writeCookie(language: Language): void {
    document.cookie = `${COOKIE_NAME}=${language};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
}

function readStoredLanguage(): Language {
    if (typeof window === 'undefined') {
        return 'fr';
    }

    try {
        const stored =
            window.localStorage.getItem(STORAGE_KEY) ?? readCookie(COOKIE_NAME);

        return stored === 'en' ? 'en' : 'fr';
    } catch {
        return 'fr';
    }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(readStoredLanguage);

    useEffect(() => {
        const serverLanguage = readCookie(COOKIE_NAME) ?? 'fr';

        try {
            window.localStorage.setItem(STORAGE_KEY, language);
        } catch {
            // Stockage indisponible : le cookie suffit.
        }

        writeCookie(language);
        document.documentElement.lang = language;

        // Les libellés calculés par le serveur (dates, messages) suivent la nouvelle langue.
        if (serverLanguage !== language) {
            router.reload();
        }
    }, [language]);

    const value = useMemo<LanguageContextValue>(
        () => ({
            language,
            setLanguage: setLanguageState,
            t: (key) => translations[language][key] ?? translations.fr[key],
            l: (french, english) => (language === 'en' ? english : french),
        }),
        [language],
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation(): LanguageContextValue {
    const context = useContext(LanguageContext);
    if (!context)
        throw new Error('useTranslation must be used inside LanguageProvider');
    return context;
}

const LEVEL_LABELS: Record<string, [french: string, english: string]> = {
    débutant: ['Débutant', 'Beginner'],
    intermédiaire: ['Intermédiaire', 'Intermediate'],
    avancé: ['Avancé', 'Advanced'],
};

/**
 * Niveau de formation (stocké en français en base) dans la langue active.
 */
export function levelLabel(level: string, language: Language): string {
    const labels = LEVEL_LABELS[level.toLowerCase()];

    if (labels) {
        return language === 'en' ? labels[1] : labels[0];
    }

    return level.charAt(0).toUpperCase() + level.slice(1);
}

/**
 * Durée renvoyée par le serveur (« 12h » ou « À venir ») dans la langue active.
 */
export function durationLabel(
    duration: string | null | undefined,
    language: Language,
): string | null {
    if (!duration) {
        return null;
    }

    if (duration === 'À venir') {
        return language === 'en' ? 'Coming soon' : duration;
    }

    return duration;
}

const LANGUAGE_OPTIONS: { value: Language; short: string; label: string }[] = [
    { value: 'fr', short: 'FR', label: 'Français' },
    { value: 'en', short: 'EN', label: 'English' },
];

/**
 * Bouton rond de la barre de navigation : affiche la langue active, bascule à l'autre.
 */
export function LanguageToggle({ className }: { className?: string }) {
    const { language, setLanguage } = useTranslation();
    const next = language === 'fr' ? LANGUAGE_OPTIONS[1] : LANGUAGE_OPTIONS[0];

    return (
        <button
            type="button"
            onClick={() => setLanguage(next.value)}
            aria-label={`${next.label}`}
            title={next.label}
            className={cn(
                'relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full font-display text-[12px] font-bold tracking-tight text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900',
                className,
            )}
        >
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={language}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                >
                    {language.toUpperCase()}
                </motion.span>
            </AnimatePresence>
        </button>
    );
}

/**
 * Sélecteur à deux positions, pensé pour un fond sombre (menu mobile).
 */
export function LanguageSelect({ className }: { className?: string }) {
    const { language, setLanguage, t } = useTranslation();
    const pillId = useId();

    return (
        <div
            role="radiogroup"
            aria-label={t('language.label')}
            className={cn(
                'flex w-fit gap-1 rounded-full border border-white/10 p-1',
                className,
            )}
        >
            {LANGUAGE_OPTIONS.map((option) => {
                const isActive = language === option.value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => setLanguage(option.value)}
                        className={cn(
                            'relative isolate rounded-full px-3 py-1.5 font-display text-[12px] font-semibold transition-colors duration-200',
                            isActive
                                ? 'text-slate-950'
                                : 'text-white/55 hover:text-white',
                        )}
                    >
                        {isActive && (
                            <motion.span
                                layoutId={`language-pill-${pillId}`}
                                transition={{
                                    type: 'spring',
                                    stiffness: 420,
                                    damping: 34,
                                }}
                                className="absolute inset-0 -z-10 rounded-full bg-white"
                            />
                        )}
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
