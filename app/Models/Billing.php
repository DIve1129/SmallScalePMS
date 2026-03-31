<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('billings', function (Blueprint $table) {
            $table->unsignedBigInteger('appointment_id')->nullable()->after('billing_id');
            $table->date('date_of_service')->nullable()->after('doctor_id');
            $table->string('service')->nullable()->after('date_of_service');
            $table->decimal('bill_amount', 10, 2)->default(0)->after('service');
            $table->decimal('balance', 10, 2)->default(0)->after('bill_amount');
            $table->enum('responsibility', ['Patient', 'Insurance'])->default('Patient')->after('balance');
            $table->enum('claim_status', ['Pending', 'Billed', 'Closed'])->default('Pending')->after('responsibility');
        });
    }

    public function down(): void
    {
        Schema::table('billings', function (Blueprint $table) {
            $table->dropColumn([
                'appointment_id',
                'date_of_service',
                'service',
                'bill_amount',
                'balance',
                'responsibility',
                'claim_status',
            ]);
        });
    }
};