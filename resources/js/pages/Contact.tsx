// resources/js/Pages/Contact.tsx
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion }                 from 'framer-motion';
import { useEffect }              from 'react';
import MainLayout                 from '@/layouts/MainLayout';
import { DottedMap }              from '@/components/ui/dotted-map';
import { cn, easings }            from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MARQUEURS CARTE — villes mondiales + Cameroun (Douala)
// ─────────────────────────────────────────────────────────────────────────────
const markers = [
    { lat: 40.7128,  lng: -74.0060,  size: 0.3 }, // New York
    { lat: 34.0522,  lng: -118.2437, size: 0.3 }, // Los Angeles
    { lat: 51.5074,  lng: -0.1278,   size: 0.3 }, // London
    { lat: -33.8688, lng: 151.2093,  size: 0.3 }, // Sydney
    { lat: 48.8566,  lng: 2.3522,    size: 0.3 }, // Paris
    { lat: 35.6762,  lng: 139.6503,  size: 0.3 }, // Tokyo
    { lat: 55.7558,  lng: 37.6176,   size: 0.3 }, // Moscou
    { lat: 39.9042,  lng: 116.4074,  size: 0.3 }, // Beijing
    { lat: 28.6139,  lng: 77.2090,   size: 0.3 }, // New Delhi
    { lat: -23.5505, lng: -46.6333,  size: 0.3 }, // São Paulo
    { lat: 1.3521,   lng: 103.8198,  size: 0.3 }, // Singapore
    { lat: 25.2048,  lng: 55.2708,   size: 0.3 }, // Dubai
    { lat: 52.5200,  lng: 13.4050,   size: 0.3 }, // Berlin
    { lat: 19.4326,  lng: -99.1332,  size: 0.3 }, // Mexico City
    { lat: -26.2041, lng: 28.0473,   size: 0.3 }, // Johannesburg
    { lat: 4.0511,   lng: 9.7679,    size: 0.5 }, // Douala — ma ville ★
];

// ─────────────────────────────────────────────────────────────────────────────
// ICONES SVG — propres, sans emoji
// ─────────────────────────────────────────────────────────────────────────────
const PhoneIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const MailIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const MapPinIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SendIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const containerVariants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const itemVariants = {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easings.smooth } },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT INPUT FIELD
// ─────────────────────────────────────────────────────────────────────────────
function Field({
    label, error, children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink-secondary">
                {label} <span className="text-teal-600">*</span>
            </label>
            {children}
            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}

const inputClass = cn(
    'w-full px-4 py-3 rounded-xl text-sm text-ink-primary placeholder:text-ink-subtle',
    'bg-surface border border-slate-200 outline-none',
    'focus:border-teal-400 focus:ring-2 focus:ring-teal-400/15',
    'transition-all duration-200',
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Contact() {
    const { props } = usePage<{ flash: { success?: string } }>();
    const flash = props.flash ?? {};

    const { data, setData, post, processing, errors, reset } = useForm({
        name:    '',
        email:   '',
        subject: '',
        message: '',
    });

    // Reset form après succès
    useEffect(() => {
        if (flash.success) reset();
    }, [flash.success]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/contact');
    }

    return (
        <MainLayout>
            <Head title="Contact — Sergio Junior Chebeu" />

            {/* ── HERO HEADER ───────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-surface-card border-b border-slate-200/60">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-400/4 rounded-full blur-2xl pointer-events-none" />

                <div className="container-main py-14 sm:py-20 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: easings.smooth }}
                        className="max-w-2xl"
                    >
                        <p className="text-xs font-medium text-ink-muted uppercase tracking-[0.2em] mb-5">
                            Disponible · Remote & Cameroun
                        </p>
                        <h1 className="text-4xl sm:text-5xl font-display font-bold text-ink-primary tracking-tight leading-tight mb-4">
                            Travaillons{' '}
                            <span className="gradient-text">ensemble</span>
                        </h1>
                        <p className="text-lg text-ink-secondary leading-relaxed">
                            Un projet web, une app mobile, une formation sur mesure ?
                            Décrivez votre besoin — je vous réponds sous 24h.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── CONTENU PRINCIPAL ─────────────────────────────────────── */}
            <section className="container-main py-12 sm:py-16">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid lg:grid-cols-2 gap-6"
                >

                    {/* ════════════════════════════════════════════════════
                        CARD GAUCHE — Infos contact + Carte
                    ════════════════════════════════════════════════════ */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col rounded-2xl overflow-hidden border border-slate-200/70 bg-surface-card shadow-sm"
                    >
                        {/* Carte DottedMap */}
                        <div className="relative h-56 overflow-hidden bg-slate-950 flex-shrink-0">
                            {/* Vignette radiale */}
                            <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(15,15,15,0.85)_100%)]" />
                            <DottedMap markers={markers} />
                        </div>

                        {/* Texte d'accroche */}
                        <div className="p-6 pb-4 border-b border-slate-100">
                            <h2 className="text-xl font-display font-bold text-ink-primary mb-2">
                                Prenons contact
                            </h2>
                            <p className="text-sm text-ink-muted leading-relaxed">
                                Je suis disponible pour des missions freelance, collaborations
                                et formations — en remote ou depuis Yaoundé, Cameroun.
                            </p>
                        </div>

                        {/* Infos contact */}
                        <div className="flex flex-col flex-1 p-6 space-y-4">

                            {/* Téléphone */}
                            <a
                                href="tel:+237600000000"
                                className="group flex items-center gap-4 p-3.5 rounded-xl hover:bg-teal-50 hover:border-teal-200 border border-transparent transition-all duration-200"
                            >
                                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0 text-teal-600 group-hover:bg-teal-100 transition-colors">
                                    <PhoneIcon />
                                </div>
                                <div>
                                    <p className="text-xs text-ink-muted font-medium mb-0.5">Téléphone</p>
                                    <p className="text-sm font-semibold text-ink-primary group-hover:text-teal-600 transition-colors">
                                        +237 698 824 439
                                    </p>
                                </div>
                            </a>

                            {/* Email */}
                            <a
                                href="mailto:contact@mrsergio.dev"
                                className="group flex items-center gap-4 p-3.5 rounded-xl hover:bg-teal-50 hover:border-teal-200 border border-transparent transition-all duration-200"
                            >
                                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0 text-teal-600 group-hover:bg-teal-100 transition-colors">
                                    <MailIcon />
                                </div>
                                <div>
                                    <p className="text-xs text-ink-muted font-medium mb-0.5">Email</p>
                                    <p className="text-sm font-semibold text-ink-primary group-hover:text-teal-600 transition-colors">
                                        contact@mrsergio.dev
                                    </p>
                                </div>
                            </a>

                            {/* Localisation */}
                            <div className="flex items-center gap-4 p-3.5 rounded-xl border border-transparent">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500">
                                    <MapPinIcon />
                                </div>
                                <div>
                                    <p className="text-xs text-ink-muted font-medium mb-0.5">Localisation</p>
                                    <p className="text-sm font-semibold text-ink-primary">
                                        Yaounde, Cameroun · Remote
                                    </p>
                                </div>
                            </div>

                            {/* Disponibilité */}
                            <div className="flex items-center gap-4 p-3.5 rounded-xl border border-transparent">
                                <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                                    <ClockIcon />
                                </div>
                                <div>
                                    <p className="text-xs text-ink-muted font-medium mb-0.5">Disponibilité</p>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <p className="text-sm font-semibold text-green-700">
                                            Disponible — réponse sous 24h
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ════════════════════════════════════════════════════
                        CARD DROITE — Formulaire
                    ════════════════════════════════════════════════════ */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col rounded-2xl border border-slate-200/70 bg-surface-card shadow-sm"
                    >
                        <div className="p-6 pb-4 border-b border-slate-100">
                            <h2 className="text-xl font-display font-bold text-ink-primary mb-1">
                                Envoyez un message
                            </h2>
                            <p className="text-sm text-ink-muted">
                                Tous les champs marqués <span className="text-teal-600 font-semibold">*</span> sont obligatoires.
                            </p>
                        </div>

                        <div className="flex-1 p-6">

                            {/* Message de succès */}
                            {flash.success && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-start gap-3 p-4 rounded-xl bg-teal-50 border border-teal-200 mb-6"
                                >
                                    <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0 text-white">
                                        <CheckIcon />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-teal-800">Message envoyé !</p>
                                        <p className="text-xs text-teal-700 mt-0.5">{flash.success}</p>
                                    </div>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">

                                {/* Nom + Email en ligne */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Field label="Nom complet" error={errors.name}>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="Sergio Junior"
                                            autoComplete="name"
                                            className={cn(inputClass, errors.name && 'border-red-300 focus:border-red-400 focus:ring-red-400/15')}
                                        />
                                    </Field>

                                    <Field label="Adresse email" error={errors.email}>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="vous@exemple.com"
                                            autoComplete="email"
                                            className={cn(inputClass, errors.email && 'border-red-300 focus:border-red-400 focus:ring-red-400/15')}
                                        />
                                    </Field>
                                </div>

                                {/* Sujet */}
                                <Field label="Sujet" error={errors.subject}>
                                    <input
                                        type="text"
                                        value={data.subject}
                                        onChange={e => setData('subject', e.target.value)}
                                        placeholder="Projet web, formation Laravel..."
                                        className={cn(inputClass, errors.subject && 'border-red-300 focus:border-red-400 focus:ring-red-400/15')}
                                    />
                                </Field>

                                {/* Message */}
                                <Field label="Message" error={errors.message}>
                                    <textarea
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        placeholder="Décrivez votre projet, vos besoins, votre budget indicatif..."
                                        rows={6}
                                        className={cn(inputClass, 'resize-none leading-relaxed', errors.message && 'border-red-300 focus:border-red-400 focus:ring-red-400/15')}
                                    />
                                    <p className="text-xs text-ink-subtle text-right mt-1">
                                        {data.message.length} / 2000 caractères
                                    </p>
                                </Field>

                                {/* Submit */}
                                <motion.button
                                    type="submit"
                                    disabled={processing}
                                    whileHover={!processing ? { scale: 1.01 } : {}}
                                    whileTap={!processing ? { scale: 0.98 } : {}}
                                    className={cn(
                                        'w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl',
                                        'bg-teal-600 text-white text-sm font-semibold',
                                        'shadow-sm shadow-teal-500/20',
                                        'transition-all duration-200',
                                        processing
                                            ? 'opacity-70 cursor-not-allowed'
                                            : 'hover:bg-teal-700',
                                    )}
                                >
                                    {processing ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <SendIcon />
                                            Envoyer le message
                                        </>
                                    )}
                                </motion.button>

                            </form>
                        </div>
                    </motion.div>

                </motion.div>
            </section>

        </MainLayout>
    );
}
