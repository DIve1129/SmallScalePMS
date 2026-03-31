<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            // change slmc_number to string
            $table->string('slmc_number', 50)->change();
        });
    }

    public function down(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            // optional: revert back (not recommended)
            $table->unsignedInteger('slmc_number')->change();
        });
    }
};
