<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\TranslateContent;
use App\Models\BlogPost;
use App\Models\Formation;
use App\Models\Project;
use App\Services\GeminiTranslator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AdminTranslationController extends Controller
{
    /**
     * @var array<string, class-string<Model>>
     */
    public const CONTENT_TYPES = [
        'projects' => Project::class,
        'blog' => BlogPost::class,
        'formations' => Formation::class,
    ];

    /**
     * Enregistre la version anglaise relue ou corrigée à la main.
     */
    public function update(Request $request, string $type, int $id): RedirectResponse
    {
        $model = $this->findContent($type, $id);
        $rules = collect($model->translatableAttributes())
            ->mapWithKeys(fn (string $field): array => [
                "values.{$field}" => $field === 'outcomes'
                    ? ['nullable', 'array']
                    : ['nullable', 'string', 'max:100000'],
            ])
            ->put('values.outcomes.*', ['nullable', 'string', 'max:500'])
            ->all();
        $validated = $request->validate($rules);

        $model->storeTranslation('en', $validated['values'] ?? []);

        return back()->with('success', 'Version anglaise enregistrée.');
    }

    /**
     * Relance la traduction automatique avec Gemini (remplace la version anglaise).
     */
    public function regenerate(GeminiTranslator $translator, string $type, int $id): RedirectResponse
    {
        if (! $translator->isConfigured()) {
            return back()->with('error', 'Ajoutez GEMINI_API_KEY dans le fichier .env pour utiliser la traduction automatique.');
        }

        $model = $this->findContent($type, $id);
        $isTranslated = (new TranslateContent($model, force: true))->handle($translator);

        return $isTranslated
            ? back()->with('success', 'Traduction mise à jour avec Gemini.')
            : back()->with('error', 'Gemini n’a pas pu traduire ce contenu (quota atteint ou service indisponible). Réessayez plus tard.');
    }

    /**
     * @return Model&\App\Models\Concerns\HasTranslations
     */
    private function findContent(string $type, int $id): Model
    {
        $modelClass = self::CONTENT_TYPES[$type] ?? abort(404);

        return $modelClass::query()->findOrFail($id);
    }
}
