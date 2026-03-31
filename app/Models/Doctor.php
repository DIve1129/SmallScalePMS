<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $table = 'doctors';
    protected $primaryKey = 'doctor_id';

    protected $fillable = [
        'doctor_code',
        'first_name',
        'last_name',
        'speciality',
        'slmc_number',
        'phone',
        'email',
        'status',
];

}
