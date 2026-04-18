<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PatientsController;
use App\Http\Controllers\AppointmentsController;
use App\Http\Controllers\DoctorsController;
use App\Http\Controllers\InsuranceController;
use App\Http\Controllers\BillingController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

Route::middleware(['role:admin,receptionist,billing'])->group(function () {
    Route::get('/patients', [PatientsController::class, 'index'])->name('patients.index');
    Route::get('/patients/create', [PatientsController::class, 'create'])->name('patients.create');
    Route::post('/patients',[PatientsController::class,'store'])->name('patients.store');
    Route::put('/patients/{id}',[PatientsController::class,'update'])->name('patients.update');
    Route::delete('/patients/{id}',[PatientsController::class,'destroy'])->name('patients.destroy');
    Route::get('/patients/{id}', [PatientsController::class, 'show'])->name('patients.show');
    Route::get('/patients/{id}/appointments', [PatientsController::class, 'appointments'])->name('patients.appointments');
    Route::get('/patients/{id}/billing', [PatientsController::class, 'billing'])->name('patients.billing');
});

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/doctors', [DoctorsController::class, 'index'])->name('doctors.index');
    Route::get('/doctors/create', [DoctorsController::class, 'create'])->name('doctors.create');
    Route::post('/doctors', [DoctorsController::class, 'store'])->name('doctors.store');
    Route::get('/doctors/{doctor}', [DoctorsController::class, 'show'])->name('doctors.show');
    Route::get('/doctors/{doctor}/edit', [DoctorsController::class, 'edit'])->name('doctors.edit');
    Route::put('/doctors/{doctor}', [DoctorsController::class, 'update'])->name('doctors.update');
    Route::get('/doctors/{doctor}/edit', [DoctorsController::class, 'edit'])->name('doctors.edit');
    Route::put('/doctors/{doctor}', [DoctorsController::class, 'update'])->name('doctors.update');

});


Route::middleware(['auth', 'verified', 'role:admin,receptionist'])->group(function () {
    Route::get('/appointments', [AppointmentsController::class, 'index'])->name('appointments.index');
    Route::get('/appointments/create', [AppointmentsController::class, 'create'])->name('appointments.create');
    Route::post('/appointments', [AppointmentsController::class, 'store'])->name('appointments.store');
    Route::get('/patients/{id}/appointments', [PatientsController::class, 'appointments'])->name('patients.appointments');
    Route::get('/appointments/{appointment}/edit', [AppointmentsController::class, 'edit'])->name('appointments.edit');
Route::put('/appointments/{appointment}', [AppointmentsController::class, 'update'])->name('appointments.update');
});

Route::middleware(['auth','role:admin'])->group(function(){
    Route::get('/admin',[AdminController::class,'index'])->name('admin.index');
    Route::get('/admin/create',[AdminController::class,'create'])->name('admin.create');
    Route::post('/admin',[AdminController::class,'store'])->name('admin.store');
    Route::get('/admin/{user}/edit', [AdminController::class, 'edit'])->name('admin.edit');
    Route::put('/admin/{user}', [AdminController::class, 'update'])->name('admin.update');
    Route::delete('/admin/{user}', [AdminController::class, 'destroy'])->name('admin.destroy');

});
Route::middleware(['auth','verified','role:admin'])->group(function () {
    Route::get('/insurance', [InsuranceController::class,'index'])->name('insurance.index');
    Route::get('/insurance/create', [InsuranceController::class,'create'])->name('insurance.create');
    Route::post('/insurance', [InsuranceController::class,'store'])->name('insurance.store');
});

Route::middleware(['auth', 'verified', 'role:admin,billing'])->group(function () {
    Route::get('/billing', [BillingController::class, 'index'])->name('billing.index');
    Route::get('/billing/{appointment}/edit', [BillingController::class, 'edit'])->name('billing.edit');
    Route::put('/billing/{appointment}', [BillingController::class, 'update'])->name('billing.update');
    Route::put('/billing/{appointment}/update-status', [BillingController::class, 'updateStatus'])
        ->name('billing.updateStatus');
});

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
