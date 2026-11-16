<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Throwable;

/**
 * Traduit du contenu français avec l'API Gemini, en une seule requête par contenu.
 */
class GeminiTranslator
{
    private const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent';

    private const LANGUAGE_NAMES = ['en' => 'English'];

    public function isConfigured(): bool
    {
        return filled(config('services.gemini.key'));
    }

    /**
     * @param  array<string, mixed>  $fields  Champs français (texte, Markdown ou listes de textes).
     * @return array<string, mixed> Mêmes clés, traduites.
     */
    public function translate(array $fields, string $targetLocale = 'en'): array
    {
        if (! $this->isConfigured()) {
            throw new RuntimeException('La clé GEMINI_API_KEY est absente.');
        }

        if ($fields === []) {
            return [];
        }

        $model = (string) config('services.gemini.model');

        $response = Http::timeout(120)
            ->retry(2, 2000, fn (Throwable $exception): bool => $exception instanceof ConnectionException, throw: false)
            ->withHeaders(['x-goog-api-key' => config('services.gemini.key')])
            ->post(sprintf(self::ENDPOINT, $model), [
                'systemInstruction' => ['parts' => [['text' => $this->instructions($targetLocale)]]],
                'contents' => [[
                    'role' => 'user',
                    'parts' => [['text' => json_encode($fields, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)]],
                ]],
                'generationConfig' => array_filter([
                    'temperature' => 0.2,
                    'responseMimeType' => 'application/json',
                    'thinkingConfig' => $this->thinkingConfig($model),
                ]),
            ]);

        if ($response->failed()) {
            throw new RuntimeException("Gemini a répondu {$response->status()} : ".$response->json('error.message', $response->body()));
        }

        $text = $response->json('candidates.0.content.parts.0.text');
        $translated = is_string($text) ? json_decode($text, true) : null;

        if (! is_array($translated)) {
            throw new RuntimeException('Réponse de Gemini illisible.');
        }

        return array_intersect_key($translated, $fields);
    }

    /**
     * Une traduction n'a pas besoin de « réflexion » : la réduire divise le temps de réponse.
     *
     * @return array<string, int|string>|null
     */
    private function thinkingConfig(string $model): ?array
    {
        if (str_starts_with($model, 'gemini-2.5-flash')) {
            return ['thinkingBudget' => 0];
        }

        if (str_starts_with($model, 'gemini-2.5')) {
            return null;
        }

        return ['thinkingLevel' => 'low'];
    }

    private function instructions(string $targetLocale): string
    {
        $language = self::LANGUAGE_NAMES[$targetLocale] ?? $targetLocale;

        return <<<PROMPT
        You translate the content of a French developer's portfolio (projects, blog articles, training courses) into natural, professional {$language}.
        Input: a JSON object whose values are French text, Markdown, or arrays of strings.
        Output: a JSON object with exactly the same keys and value types, every value translated.
        Rules:
        - Keep Markdown structure intact: headings, lists, links, images, tables, emphasis.
        - Never translate code blocks, inline code, URLs, file paths, product, brand or app names (e.g. MrMarket, Laravel, Flutter).
        - Keep the meaning and tone; do not add, summarise or remove content.
        - Return only the JSON object.
        PROMPT;
    }
}
