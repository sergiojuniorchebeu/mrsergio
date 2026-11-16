// resources/js/components/admin/translation-panel.tsx
// Panneau « Version anglaise » des formulaires d'édition : état de la traduction,
// champs relisibles à la main et bouton pour relancer Gemini.

import { router } from '@inertiajs/react';
import { useState } from 'react';
import { AdminPanel, Field, inputCls } from '@/components/admin/shared';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface TranslationState {
    fields: string[];
    source: Record<string, unknown>;
    values: Record<string, unknown>;
    is_stale: boolean;
    is_translated: boolean;
    is_configured: boolean;
}

type ContentType = 'projects' | 'blog' | 'formations';

const FIELD_LABELS: Record<string, string> = {
    title: 'Titre',
    description: 'Description',
    excerpt: 'Extrait',
    content: 'Contenu (Markdown)',
    format: 'Format',
    target_audience: 'Pour qui',
    prerequisites: 'Prérequis',
    outcomes: 'À la fin, vous saurez (une ligne par point)',
    cta_label: 'Texte du bouton',
};

const LONG_FIELDS = new Set([
    'description',
    'excerpt',
    'target_audience',
    'prerequisites',
]);

function toText(value: unknown): string {
    if (Array.isArray(value)) {
        return value.join('\n');
    }

    return typeof value === 'string' ? value : '';
}

function StatusBadge({ state }: { state: TranslationState }) {
    const status = !state.is_translated
        ? {
              label: 'Pas encore traduit',
              className: 'bg-slate-100 text-slate-600',
          }
        : state.is_stale
          ? {
                label: 'Français modifié depuis',
                className: 'bg-amber-50 text-amber-700',
            }
          : { label: 'À jour', className: 'bg-teal-50 text-teal-700' };

    return (
        <span
            className={cn(
                'rounded-full px-2.5 py-0.5 text-[11px] font-medium',
                status.className,
            )}
        >
            {status.label}
        </span>
    );
}

export function TranslationPanel({
    type,
    id,
    state,
}: {
    type: ContentType;
    id: number;
    state: TranslationState;
}) {
    const [values, setValues] = useState<Record<string, string>>(() =>
        Object.fromEntries(
            state.fields.map((field) => [field, toText(state.values[field])]),
        ),
    );
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const fields = state.fields.filter(
        (field) => field in state.source || values[field],
    );

    const resetFromServer = (page: { props: Record<string, unknown> }) => {
        const next = page.props.translation as TranslationState | undefined;

        if (next) {
            setValues(
                Object.fromEntries(
                    next.fields.map((field) => [
                        field,
                        toText(next.values[field]),
                    ]),
                ),
            );
        }
    };

    const save = () => {
        const payload = Object.fromEntries(
            fields.map((field) => [
                field,
                field === 'outcomes'
                    ? values[field]
                          .split('\n')
                          .map((line) => line.trim())
                          .filter(Boolean)
                    : values[field],
            ]),
        );

        setIsSaving(true);
        router.patch(
            `/admin/translations/${type}/${id}`,
            { values: payload },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    setErrors({});
                    resetFromServer(page);
                },
                onError: (formErrors) =>
                    setErrors(formErrors as Record<string, string>),
                onFinish: () => setIsSaving(false),
            },
        );
    };

    const regenerate = () => {
        setIsTranslating(true);
        router.post(
            `/admin/translations/${type}/${id}/regenerate`,
            {},
            {
                preserveScroll: true,
                onSuccess: resetFromServer,
                onFinish: () => setIsTranslating(false),
            },
        );
    };

    return (
        <AdminPanel
            title="Version anglaise"
            className="mt-6"
            actions={<StatusBadge state={state} />}
        >
            <div className="space-y-5 p-5">
                <p className="text-[13px] leading-relaxed text-slate-500">
                    {state.is_configured
                        ? 'Traduite automatiquement par Gemini à chaque modification du texte français. Vous pouvez relire et corriger ci-dessous : vos corrections sont conservées jusqu’à la prochaine modification du français.'
                        : 'Ajoutez GEMINI_API_KEY dans le fichier .env pour traduire automatiquement. En attendant, vous pouvez saisir la version anglaise à la main.'}
                </p>

                {fields.map((field) => {
                    const source = toText(state.source[field]);
                    const isContent = field === 'content';
                    const isMultiline =
                        isContent ||
                        field === 'outcomes' ||
                        LONG_FIELDS.has(field);

                    return (
                        <Field
                            key={field}
                            label={FIELD_LABELS[field] ?? field}
                            error={errors[`values.${field}`]}
                        >
                            {isMultiline ? (
                                <textarea
                                    value={values[field] ?? ''}
                                    onChange={(event) =>
                                        setValues((current) => ({
                                            ...current,
                                            [field]: event.target.value,
                                        }))
                                    }
                                    rows={isContent ? 16 : 4}
                                    placeholder={
                                        source ? 'Pas encore traduit' : ''
                                    }
                                    className={cn(
                                        inputCls,
                                        'resize-y leading-relaxed',
                                        isContent && 'font-mono text-[13px]',
                                    )}
                                />
                            ) : (
                                <input
                                    value={values[field] ?? ''}
                                    onChange={(event) =>
                                        setValues((current) => ({
                                            ...current,
                                            [field]: event.target.value,
                                        }))
                                    }
                                    placeholder={
                                        source ? 'Pas encore traduit' : ''
                                    }
                                    className={inputCls}
                                />
                            )}
                            {source && !isContent && (
                                <p className="line-clamp-2 text-[12px] text-slate-400">
                                    FR : {source}
                                </p>
                            )}
                        </Field>
                    );
                })}

                <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                    <button
                        type="button"
                        onClick={save}
                        disabled={isSaving || isTranslating}
                        className={buttonVariants()}
                    >
                        {isSaving
                            ? 'Enregistrement…'
                            : 'Enregistrer la version anglaise'}
                    </button>
                    <button
                        type="button"
                        onClick={regenerate}
                        disabled={
                            !state.is_configured || isSaving || isTranslating
                        }
                        title={
                            state.is_configured
                                ? undefined
                                : 'GEMINI_API_KEY manquante'
                        }
                        className={buttonVariants({ variant: 'outline' })}
                    >
                        {isTranslating
                            ? 'Traduction en cours…'
                            : 'Retraduire avec Gemini'}
                    </button>
                </div>
            </div>
        </AdminPanel>
    );
}
