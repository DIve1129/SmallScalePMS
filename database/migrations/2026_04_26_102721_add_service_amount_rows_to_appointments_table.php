<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->string('service_2')->nullable()->after('app_reason');
            $table->string('service_3')->nullable()->after('service_2');

            $table->decimal('amount_1', 10, 2)->default(0)->after('additional_charge');
            $table->decimal('amount_2', 10, 2)->default(0)->after('amount_1');
            $table->decimal('amount_3', 10, 2)->default(0)->after('amount_2');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn([
                'service_2',
                'service_3',
                'amount_1',
                'amount_2',
                'amount_3',
            ]);
        });
    }
};