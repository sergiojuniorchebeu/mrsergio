<?php
// database/seeders/AdminSeeder.php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@mrsergio.dev'],
            [
                'name'     => 'Sergio Junior Chebeu',
                'email'    => 'contact@mrsergio.dev',
                'password' => Hash::make('@Jean@1972'),
                'is_admin' => true,
            ]
        );

        $this->command->info('✅ Admin créé : contact@mrsergio.dev / @Jean@1972');
    }
}