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
                background-color: #ffffff;
            }

            html.dark {
                background-color: #131210;
            }
        </style>

        {{-- Résolution des meta OG depuis les props Inertia (server-side, visible aux crawlers) --}}
        @php
            $props = $page['props'] ?? [];
            $seo = $props['seo'] ?? [];
            $siteName = 'mrsergio.dev';
            $defaultTitle = 'Sergio Junior Chebeu | Développement web et Android';
            $defaultDescription = 'Développeur full stack, je conçois des applications web et Android claires, fiables et utiles.';
            $defaultImage = asset('images/profile_avatar.jpg');
            $seoTitle = $seo['title']
                ?? $props['post']['title']
                ?? $props['project']['title']
                ?? $props['formation']['title']
                ?? $defaultTitle;
            $seoDescription = $seo['description']
                ?? $props['post']['excerpt']
                ?? $props['project']['description']
                ?? $props['formation']['excerpt']
                ?? $defaultDescription;
            $seoImage = $seo['image']
                ?? $props['post']['cover_image_url']
                ?? $props['project']['image_url']
                ?? $props['formation']['cover_image_url']
                ?? $defaultImage;
            $seoType = $seo['type'] ?? 'website';
            $canonical = $seo['canonical'] ?? url()->current();
            $publishedTime = $seo['published_time'] ?? null;
            $jsonLd = $seo['json_ld'] ?? null;
        @endphp

        <title inertia>{{ config('app.name', 'Mr Sergio') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="shortcut icon" href="/favicon.ico">
        <link rel="apple-touch-icon" href="/favicon.svg">
        <link rel="canonical" href="{{ $canonical }}">

        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="application-name" content="{{ config('app.name') }}">
        <meta name="apple-mobile-web-app-title" content="{{ config('app.name') }}">
        <meta name="description" content="{{ $seoDescription }}">
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
        <meta property="og:site_name" content="{{ $siteName }}">
        <meta property="og:title" content="{{ $seoTitle }}">
        <meta property="og:description" content="{{ $seoDescription }}">
        <meta property="og:image" content="{{ $seoImage }}">
        <meta property="og:url" content="{{ $canonical }}">
        <meta property="og:type" content="{{ $seoType }}">
        <meta name="twitter:title" content="{{ $seoTitle }}">
        <meta name="twitter:description" content="{{ $seoDescription }}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:image" content="{{ $seoImage }}">
        @if ($publishedTime)
        <meta property="article:published_time" content="{{ $publishedTime }}">
        @endif
        @if ($jsonLd)
        <script type="application/ld+json">{!! json_encode($jsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>
        @endif

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
