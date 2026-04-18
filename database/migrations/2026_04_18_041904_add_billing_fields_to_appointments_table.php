<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->string('additional_services')->nullable()->after('app_reason');
            $table->text('notes')->nullable()->after('additional_services');
            $table->decimal('additional_charge', 10, 2)->default(0)->after('notes');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn([
                'additional_services',
                'notes',
                'additional_charge',
            ]);
        });
    }
};