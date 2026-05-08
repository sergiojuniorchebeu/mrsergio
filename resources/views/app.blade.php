<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        {{-- Résolution des meta OG depuis les props Inertia (server-side, visible aux crawlers) --}}
        @php
            $props      = $page['props'] ?? [];
            $ogImage    = $props['post']['cover_image_url']
                       ?? $props['project']['image_url']
                       ?? $props['formation']['cover_image_url']
                       ?? asset('images/profile_avatar.jpg');
            $ogTitle    = $props['post']['title']
                       ?? $props['project']['title']
                       ?? $props['formation']['title']
                       ?? 'mrsergio.dev — Sergio Junior Chebeu';
            $ogDesc     = $props['post']['excerpt']
                       ?? $props['project']['description']
                       ?? $props['formation']['excerpt']
                       ?? 'Développeur Full Stack — Laravel, React, Flutter.';
        @endphp

        <title inertia>{{ config('app.name', 'mrsergio.dev') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="description" content="{{ $ogDesc }}">
        <meta property="og:site_name" content="mrsergio.dev">
        <meta property="og:title" content="{{ $ogTitle }}">
        <meta property="og:description" content="{{ $ogDesc }}">
        <meta property="og:image" content="{{ $ogImage }}">
        <meta property="og:type" content="website">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:image" content="{{ $ogImage }}">

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
