<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('billings', function (Blueprint $table) {
            foreach ([
                'patient_id',
                'insurance_id',
                'insurance_code',
                'insurance_name',
                'doctor_id',
                'appointment_id',
                'date_of_service',
                'service',
                'bill_amount',
                'balance',
                'responsibility',
                'claim_status',
            ] as $column) {
                if (Schema::hasColumn('billings', $column)) {
                    $table->dropColumn($column);
                }
            }

            if (! Schema::hasColumn('billings', 'service_code')) {
                $table->string('service_code', 50)->unique()->nullable();
            }

            if (! Schema::hasColumn('billings', 'service_name')) {
                $table->string('service_name', 150)->nullable();
            }

            if (! Schema::hasColumn('billings', 'amount')) {
                $table->decimal('amount', 10, 2)->default(0);
            }

            if (! Schema::hasColumn('billings', 'status')) {
                $table->string('status', 20)->default('Active');
            }
        });
    }

    public function down(): void
    {
        //
    }
};