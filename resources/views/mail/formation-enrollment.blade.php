@php
    $font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    $mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    $isWaiting = $kind === 'waitlisted';
    $accent = $isWaiting ? '#475569' : '#0f766e';
    $accentSoft = $isWaiting ? '#f1f5f9' : '#ecfdf8';
    $logo = isset($message) ? $message->embed(public_path('images/email-logo.png')) : asset('images/email-logo.png');
@endphp
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>{{ $subject }}</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; -webkit-text-size-adjust:100%;">
    {{-- Aperçu affiché dans la boîte de réception --}}
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">{{ $intro }}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9;">
        <tr>
            <td align="center" style="padding:32px 16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

                    {{-- Logo --}}
                    <tr>
                        <td style="padding:0 4px 20px;">
                            <a href="{{ $siteUrl }}" style="text-decoration:none;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td style="vertical-align:middle;">
                                            <img src="{{ $logo }}" width="32" height="32" alt="" style="display:block; border:0;">
                                        </td>
                                        <td style="vertical-align:middle; padding-left:10px; font-family:{{ $font }}; font-size:17px; font-weight:700; letter-spacing:-0.2px; color:#0f172a;">
                                            mr<span style="color:#0d9488;">sergio</span>
                                        </td>
                                    </tr>
                                </table>
                            </a>
                        </td>
                    </tr>

                    {{-- Carte --}}
                    <tr>
                        <td style="background-color:#ffffff; border:1px solid #e2e8f0; border-radius:16px; overflow:hidden;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="height:4px; background-color:{{ $accent }}; font-size:0; line-height:0;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:32px 32px 8px; font-family:{{ $font }};">
                                        <p style="margin:0 0 14px; font-family:{{ $mono }}; font-size:11px; font-weight:600; letter-spacing:1.2px; text-transform:uppercase; color:{{ $accent }};">
                                            {{ $eyebrow }}
                                        </p>
                                        <h1 style="margin:0 0 20px; font-size:24px; line-height:1.25; font-weight:700; letter-spacing:-0.4px; color:#0f172a;">
                                            {{ $heading }}
                                        </h1>
                                        <p style="margin:0 0 8px; font-size:15px; line-height:1.6; color:#0f172a;">{{ $greeting }}</p>
                                        <p style="margin:0; font-size:15px; line-height:1.6; color:#334155;">{{ $intro }}</p>
                                    </td>
                                </tr>

                                @if ($sessionDate)
                                    {{-- Détails de la session --}}
                                    <tr>
                                        <td style="padding:24px 32px 0;">
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:{{ $accentSoft }}; border-radius:12px;">
                                                <tr>
                                                    <td style="padding:18px 20px; font-family:{{ $font }};">
                                                        <p style="margin:0 0 4px; font-family:{{ $mono }}; font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#64748b;">Live gratuit en ligne</p>
                                                        <p style="margin:0 0 12px; font-size:16px; line-height:1.4; font-weight:700; color:#0f172a;">{{ $formationTitle }}</p>
                                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                                            <tr>
                                                                <td style="padding:0 24px 0 0; font-family:{{ $font }};">
                                                                    <p style="margin:0; font-size:12px; color:#64748b;">Date</p>
                                                                    <p style="margin:2px 0 0; font-size:14px; font-weight:600; color:#0f172a;">{{ $sessionDate }}</p>
                                                                </td>
                                                                <td style="padding:0; font-family:{{ $font }};">
                                                                    <p style="margin:0; font-size:12px; color:#64748b;">Heure</p>
                                                                    <p style="margin:2px 0 0; font-size:14px; font-weight:600; color:#0f172a;">{{ $sessionTime }}</p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                @endif

                                @if ($primaryAction)
                                    {{-- Action principale --}}
                                    <tr>
                                        <td style="padding:28px 32px 0;">
                                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td style="border-radius:10px; background-color:#0f766e;">
                                                        <a href="{{ $primaryAction['url'] }}" style="display:inline-block; padding:13px 26px; font-family:{{ $font }}; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:10px;">
                                                            {{ $primaryAction['label'] }}
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                @endif

                                @if ($accountHint)
                                    <tr>
                                        <td style="padding:20px 32px 0; font-family:{{ $font }}; font-size:14px; line-height:1.6; color:#334155;">
                                            {{ $accountHint }}
                                        </td>
                                    </tr>
                                @endif

                                @if ($joinUrl)
                                    <tr>
                                        <td style="padding:20px 32px 0; font-family:{{ $font }}; font-size:14px; line-height:1.6; color:#334155;">
                                            Le jour J, rejoignez la session avec
                                            <a href="{{ $joinUrl }}" style="color:#0f766e; font-weight:600;">votre lien personnel</a> :
                                            votre présence est enregistrée automatiquement. Vous recevrez aussi un rappel 30 minutes avant.
                                        </td>
                                    </tr>
                                @endif

                                <tr>
                                    <td style="padding:28px 32px 32px; font-family:{{ $font }}; font-size:15px; line-height:1.6; color:#334155;">
                                        À très vite,<br>
                                        <strong style="color:#0f172a;">Sergio Junior Chebeu</strong>
                                    </td>
                                </tr>

                                @if ($cancelUrl)
                                    <tr>
                                        <td style="padding:16px 32px; border-top:1px solid #e2e8f0; font-family:{{ $font }}; font-size:13px; line-height:1.6; color:#64748b;">
                                            Vous ne pouvez plus venir ?
                                            <a href="{{ $cancelUrl }}" style="color:#64748b; text-decoration:underline;">{{ $isWaiting ? "Quitter la liste d'attente" : 'Libérer ma place' }}</a>
                                            pour la donner à une personne en attente.
                                        </td>
                                    </tr>
                                @endif
                            </table>
                        </td>
                    </tr>

                    {{-- Pied de page --}}
                    <tr>
                        <td align="center" style="padding:24px 16px 0; font-family:{{ $font }}; font-size:12px; line-height:1.6; color:#94a3b8;">
                            Vous recevez cet email suite à votre inscription sur
                            <a href="{{ $siteUrl }}" style="color:#64748b; text-decoration:none;">{{ $siteHost }}</a>.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
