<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
    $table->decimal('payment_1', 10, 2)->default(0)->after('amount_3');
    $table->decimal('payment_2', 10, 2)->default(0)->after('payment_1');
    $table->decimal('payment_3', 10, 2)->default(0)->after('payment_2');
});Schema::table('appointments', function (Blueprint $table) {
            //
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
    $table->dropColumn(['payment_1', 'payment_2', 'payment_3']);
});
    }
};
