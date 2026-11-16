<?php

namespace App\Console\Commands;

use App\Jobs\TranslateContent;
use App\Models\BlogPost;
use App\Models\Formation;
use App\Models\Project;
use App\Services\GeminiTranslator;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Model;

class TranslateContentCommand extends Command
{
    /**
     * @var string
     */
    protected $signature = 'content:translate
        {--force : Retraduire même les contenus déjà à jour}
        {--limit=0 : Nombre maximum de contenus à traduire (0 = sans limite)}
        {--pause=5 : Secondes d\'attente entre deux appels (quota gratuit de Gemini)}';

    /**
     * @var string
     */
    protected $description = 'Traduit en anglais, avec Gemini, les projets, articles et formations à traduire';

    public function handle(GeminiTranslator $translator): int
    {
        if (! $translator->isConfigured()) {
            $this->error('Ajoutez GEMINI_API_KEY dans le fichier .env.');

            return self::FAILURE;
        }

        $force = (bool) $this->option('force');
        $limit = (int) $this->option('limit');
        $pause = (int) $this->option('pause');
        $pending = collect([Project::class, BlogPost::class, Formation::class])
            ->flatMap(fn (string $modelClass) => $modelClass::query()->get())
            ->filter(fn (Model $model): bool => $force || $model->translationIsStale())
            ->values();

        if ($limit > 0) {
            $pending = $pending->take($limit);
        }

        if ($pending->isEmpty()) {
            $this->info('Tout est déjà traduit.');

            return self::SUCCESS;
        }

        $failures = 0;

        foreach ($pending as $index => $model) {
            $label = class_basename($model).' #'.$model->getKey().' — '.$model->getAttribute('title');
            $isTranslated = (new TranslateContent($model, $force))->handle($translator);

            $isTranslated ? $this->line("<info>✓</info> {$label}") : $this->line("<error>✗</error> {$label}");
            $failures += $isTranslated ? 0 : 1;

            if ($pause > 0 && $index < $pending->count() - 1) {
                sleep($pause);
            }
        }

        $this->newLine();
        $this->info(($pending->count() - $failures).' contenu(s) traduit(s), '.$failures.' échec(s).');

        return $failures === 0 ? self::SUCCESS : self::FAILURE;
    }
}
