<?php

namespace App\Models\Concerns;

use App\Http\Middleware\SetLocale;
use App\Jobs\TranslateContent;
use App\Services\GeminiTranslator;
use Illuminate\Support\Facades\Cache;

/**
 * Contenu rédigé en français, traduit en anglais par Gemini et stocké dans la colonne `translations`.
 *
 * `translation_source_hash` mémorise l'empreinte du texte français traduit :
 * si le français change, la traduction est considérée comme périmée et relancée.
 */
trait HasTranslations
{
    public const TRANSLATION_LOCALES = ['en'];

    /**
     * Champs rédigés en français et à traduire.
     *
     * @return list<string>
     */
    abstract public function translatableAttributes(): array;

    public static function bootHasTranslations(): void
    {
        static::saved(function (self $model): void {
            if ($model->translationIsStale() && app(GeminiTranslator::class)->isConfigured()) {
                TranslateContent::dispatchAfterResponse($model);
            }
        });
    }

    public function initializeHasTranslations(): void
    {
        $this->mergeCasts(['translations' => 'array']);
    }

    /**
     * Valeur du champ dans la langue courante, avec repli sur le français.
     */
    public function translated(string $attribute, ?string $locale = null): mixed
    {
        $locale ??= app()->getLocale();
        $translation = $this->translations[$locale][$attribute] ?? null;

        return filled($translation) ? $translation : $this->getAttribute($attribute);
    }

    /**
     * Textes français à traduire, sans les champs vides.
     *
     * @return array<string, mixed>
     */
    public function translationSource(): array
    {
        return collect($this->translatableAttributes())
            ->mapWithKeys(fn (string $attribute): array => [$attribute => $this->getAttribute($attribute)])
            ->filter(fn (mixed $value): bool => filled($value))
            ->all();
    }

    public function currentTranslationHash(): string
    {
        return hash('sha256', json_encode($this->translationSource(), JSON_UNESCAPED_UNICODE));
    }

    public function translationIsStale(): bool
    {
        return $this->translation_source_hash !== $this->currentTranslationHash();
    }

    /**
     * Enregistre une traduction (Gemini ou saisie manuelle) sans relancer la traduction automatique.
     *
     * @param  array<string, mixed>  $values
     */
    public function storeTranslation(string $locale, array $values): void
    {
        $allowed = array_flip($this->translatableAttributes());
        $translations = $this->translations ?? [];
        $translations[$locale] = array_intersect_key($values, $allowed);

        $this->forceFill([
            'translations' => $translations,
            'translation_source_hash' => $this->currentTranslationHash(),
        ])->saveQuietly();

        $this->flushContentCache();
    }

    /**
     * Données du panneau « Version anglaise » de l'admin.
     *
     * @return array{fields: list<string>, source: array<string, mixed>, values: array<string, mixed>, is_stale: bool, is_translated: bool, is_configured: bool}
     */
    public function translationState(string $locale = 'en'): array
    {
        return [
            'fields' => $this->translatableAttributes(),
            'source' => $this->translationSource(),
            'values' => $this->translations[$locale] ?? [],
            'is_stale' => $this->translationIsStale(),
            'is_translated' => filled($this->translations[$locale] ?? null),
            'is_configured' => app(GeminiTranslator::class)->isConfigured(),
        ];
    }

    /**
     * Vide les caches publics qui contiennent ce contenu.
     */
    abstract public function flushContentCache(): void;

    /**
     * Clé de cache propre à la langue courante (les pages publiques sont mises en cache par langue).
     */
    public static function localizedCacheKey(string $key): string
    {
        return $key.'.'.app()->getLocale();
    }

    /**
     * Oublie une clé de cache dans toutes les langues du site.
     */
    protected static function forgetLocalizedCache(string ...$keys): void
    {
        foreach ($keys as $key) {
            Cache::forget($key);

            foreach (SetLocale::SUPPORTED_LOCALES as $locale) {
                Cache::forget("{$key}.{$locale}");
            }
        }
    }
}
