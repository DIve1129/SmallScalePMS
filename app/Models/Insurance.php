<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Insurance extends Model
{
        protected $table = 'insurances';
        protected $primaryKey = 'insurance_code';

    protected $fillable = [
        'insurance_name',
        'insurance_address',
        'phone',
];

}
