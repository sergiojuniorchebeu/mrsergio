<?php

namespace App\Jobs;

use App\Services\GeminiTranslator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Traduit un projet, un article ou une formation. Lancé après la réponse HTTP
 * (aucun worker de file d'attente requis) ou depuis la commande content:translate.
 */
class TranslateContent
{
    use Dispatchable, Queueable;

    /**
     * Une traduction longue peut dépasser la limite PHP par défaut (30 s) d'une requête web.
     */
    public const TIME_LIMIT_SECONDS = 300;

    public function __construct(public Model $model, public bool $force = false) {}

    public function handle(GeminiTranslator $translator): bool
    {
        set_time_limit(self::TIME_LIMIT_SECONDS);

        /** @var Model&\App\Models\Concerns\HasTranslations $model */
        $model = $this->model->fresh() ?? $this->model;

        if (! $this->force && ! $model->translationIsStale()) {
            return true;
        }

        try {
            foreach ($model::TRANSLATION_LOCALES as $locale) {
                $model->storeTranslation($locale, $translator->translate($model->translationSource(), $locale));
            }

            return true;
        } catch (Throwable $exception) {
            Log::warning('Traduction Gemini impossible', [
                'model' => $model::class,
                'id' => $model->getKey(),
                'error' => $exception->getMessage(),
            ]);

            return false;
        }
    }
}
