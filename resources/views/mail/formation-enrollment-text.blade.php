{!! $heading !!}

{!! $greeting !!}

{!! $intro !!}
@if ($sessionDate)

{!! $formationTitle !!}
{!! $sessionDate !!} · {!! $sessionTime !!}
@endif
@if ($primaryAction)

{!! $primaryAction['label'] !!} : {!! $primaryAction['url'] !!}
@endif
@if ($accountHint)

{!! $accountHint !!}
@endif
@if ($joinUrl)

Le jour J, rejoignez la session avec votre lien personnel (votre présence est enregistrée automatiquement) : {!! $joinUrl !!}
@endif

À très vite,
Sergio Junior Chebeu
@if ($cancelUrl)

Vous ne pouvez plus venir ? Libérez votre place : {!! $cancelUrl !!}
@endif
