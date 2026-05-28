<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Billing extends Model
{
    protected $primaryKey = 'billing_id';

    protected $fillable = [
        'service_code',
        'service_name',
        'amount',
        'status',
    ];
}