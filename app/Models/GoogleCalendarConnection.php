<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GoogleCalendarConnection extends Model
{
    protected $fillable = [
        'email',
        'refresh_token',
        'access_token',
        'access_token_expires_at',
    ];

    protected $hidden = [
        'refresh_token',
        'access_token',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'refresh_token' => 'encrypted',
            'access_token' => 'encrypted',
            'access_token_expires_at' => 'datetime',
        ];
    }

    /**
     * Le compte relié (un seul à la fois).
     */
    public static function current(): ?self
    {
        return static::query()->latest('id')->first();
    }
}
