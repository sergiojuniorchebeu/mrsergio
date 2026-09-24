<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormationEnrollment extends Model
{
    protected $fillable = ['formation_id', 'name', 'email', 'phone', 'message', 'status'];

    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class);
    }
}
