<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            // Patient Vital Signs Metrics
            $table->string('blood_pressure', 20)->nullable()->after('status');
            $table->integer('pulse_rate')->nullable()->after('blood_pressure');
            $table->decimal('temperature_c', 4, 1)->nullable()->after('pulse_rate');
            $table->decimal('weight_kg', 5, 1)->nullable()->after('temperature_c');
            
            // Medical Presentation & Treatment Notes
            $table->text('clinical_examination')->nullable()->after('weight_kg');
            $table->text('diagnosis')->nullable()->after('clinical_examination');
            $table->text('prescribed_medication')->nullable()->after('diagnosis');
            $table->text('plan_of_management')->nullable()->after('prescribed_medication');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn([
                'blood_pressure',
                'pulse_rate',
                'temperature_c',
                'weight_kg',
                'clinical_examination',
                'diagnosis',
                'prescribed_medication',
                'plan_of_management'
            ]);
        });
    }
};