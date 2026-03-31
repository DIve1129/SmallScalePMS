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
        Schema::create('doctors', function (Blueprint $table) {
            $table->increments('doctor_id');
            $table->string('first_name',100);
            $table->string('last_name',100);
            $table->string('speciality',255);
            $table->unsignedInteger('slmc_number')->unique(); // NOT auto-increment
            $table->string('phone', 30)->nullable();
            $table->string('email', 120)->nullable();
            $table->string('status', 30)->default('Active'); // Active / Inactive
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
