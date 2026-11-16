<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormationEnrollment extends Model
{
    protected static function booted(): void
    {
        static::saved(fn () => FormationSession::forgetLiveEvent());
        static::deleted(fn () => FormationSession::forgetLiveEvent());
    }

    protected $fillable = [
        'formation_id',
        'formation_session_id',
        'name',
        'email',
        'phone',
        'message',
        'status',
        'confirmation_sent_at',
        'reminder_sent_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'confirmation_sent_at' => 'datetime',
            'reminder_sent_at' => 'datetime',
        ];
    }

    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class);
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(FormationSession::class, 'formation_session_id');
    }
}
