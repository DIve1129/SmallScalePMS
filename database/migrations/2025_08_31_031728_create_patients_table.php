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
        Schema::create('patients', function (Blueprint $table) {
                $table->string('patient_id', 30)->primary();  // CH-prefixed string primary key
                $table->string('first_name', 100);
                $table->string('last_name', 100);
                $table->string('address', 255)->nullable();

                $table->string('nic', 20)->nullable()->unique();
                $table->string('phone', 20)->nullable()->unique();   // <-- string, NOT auto-increment

                $table->string('insurance_name', 100)->nullable();
                $table->string('insurance_id', 100)->nullable();
                $table->string('insurance_code', 100)->nullable();
                $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
