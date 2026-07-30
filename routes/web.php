<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AppointmentsController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DoctorsController;
use App\Http\Controllers\InsuranceController;
use App\Http\Controllers\PatientsController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*

| Public Routes

*/

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

/*

| Dashboard

*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get(
        '/dashboard',
        [DashboardController::class, 'index']
    )->name('dashboard');
});

/*

| Patient Management
| Accessible by administrators, receptionists and billing staff.
*/

Route::middleware(['auth','verified','role:admin,receptionist,billing',])->group(function () {
    Route::get(
        '/patients',
        [PatientsController::class, 'index']
    )->name('patients.index');

    Route::get(
        '/patients/create',
        [PatientsController::class, 'create']
    )->name('patients.create');

    Route::post(
        '/patients',
        [PatientsController::class, 'store']
    )->name('patients.store');

    Route::get(
        '/patients/{id}',
        [PatientsController::class, 'show']
    )->name('patients.show');

    Route::get(
        '/patients/{id}/edit',
        [PatientsController::class, 'edit']
    )->name('patients.edit');

    Route::put(
        '/patients/{id}',
        [PatientsController::class, 'update']
    )->name('patients.update');

    Route::delete(
        '/patients/{id}',
        [PatientsController::class, 'destroy']
    )->name('patients.destroy');

    Route::get(
        '/patients/{id}/appointments',
        [PatientsController::class, 'appointments']
    )->name('patients.appointments');

    Route::get(
        '/patients/{id}/billing',
        [PatientsController::class, 'billing']
    )->name('patients.billing');

    Route::get(
        '/billing/{appointment}/viewclinicaldata',
        [PatientsController::class, 'showClinicalData']
    )->name('billing.view_clinical_data');
});

/*

| Doctor Management
| Doctor record management is restricted to administrators.
*/

Route::middleware(['auth','verified','role:admin',])->group(function () {
    Route::get(
        '/doctors',
        [DoctorsController::class, 'index']
    )->name('doctors.index');

    Route::get(
        '/doctors/create',
        [DoctorsController::class, 'create']
    )->name('doctors.create');

    Route::post(
        '/doctors',
        [DoctorsController::class, 'store']
    )->name('doctors.store');

    Route::get(
        '/doctors/{doctor}',
        [DoctorsController::class, 'show']
    )->name('doctors.show');

    Route::get(
        '/doctors/{doctor}/edit',
        [DoctorsController::class, 'edit']
    )->name('doctors.edit');

    Route::put(
        '/doctors/{doctor}',
        [DoctorsController::class, 'update']
    )->name('doctors.update');
});

/*

| Management Reports
| Accessible by administrators and billing staff.
*/

Route::middleware([
    'auth',
    'verified',
    'role:admin,billing',
])->group(function () {
    Route::get(
        '/reports/revenue',
        [ReportController::class, 'index']
    )->name('reports.revenue');

    Route::get(
        '/reports/outstanding',
        [ReportController::class, 'outstanding']
    )->name('reports.outstanding');

    Route::get(
        '/reports/patientbilling',
        [ReportController::class, 'patientBilling']
    )->name('reports.patientbilling');

    Route::get(
        '/reports/appointments',
        [ReportController::class, 'appointments']
    )->name('reports.appointments');
});

/*

| Appointment Management

|
| Accessible by administrators and receptionists.
|
*/

Route::middleware([
    'auth',
    'verified',
    'role:admin,receptionist',
])->group(function () {
    Route::get(
        '/appointments',
        [AppointmentsController::class, 'index']
    )->name('appointments.index');

    Route::get(
        '/appointments/create',
        [AppointmentsController::class, 'create']
    )->name('appointments.create');

    Route::post(
        '/appointments',
        [AppointmentsController::class, 'store']
    )->name('appointments.store');

    Route::get(
        '/appointments/{appointment}/edit',
        [AppointmentsController::class, 'edit']
    )->name('appointments.edit');

    Route::put(
        '/appointments/{appointment}',
        [AppointmentsController::class, 'update']
    )->name('appointments.update');
});

/*

| Administration

|
| User management and Charge Master management are admin-only.
|
*/

Route::middleware([
    'auth',
    'verified',
    'role:admin',
])->group(function () {
    Route::get(
        '/admin',
        [AdminController::class, 'index']
    )->name('admin.index');

    /*
    
    | Charge Master
    
    |
    | These specific routes must come before /admin/{user} routes.
    |
    */

    Route::get(
        '/admin/charge-master/create',
        [AdminController::class, 'createChargeMaster']
    )->name('admin.charge-master.create');

    Route::post(
        '/admin/charge-master',
        [AdminController::class, 'storeChargeMaster']
    )->name('admin.charge-master.store');

    Route::get(
        '/admin/charge-master/{billing}/edit',
        [AdminController::class, 'editChargeMaster']
    )->name('admin.charge-master.edit');

    Route::put(
        '/admin/charge-master/{billing}',
        [AdminController::class, 'updateChargeMaster']
    )->name('admin.charge-master.update');

    /*
    
    | User Management
    
    */

    Route::get(
        '/admin/create',
        [AdminController::class, 'create']
    )->name('admin.create');

    Route::post(
        '/admin',
        [AdminController::class, 'store']
    )->name('admin.store');

    Route::get(
        '/admin/{user}/edit',
        [AdminController::class, 'edit']
    )->name('admin.edit');

    Route::put(
        '/admin/{user}',
        [AdminController::class, 'update']
    )->name('admin.update');

    Route::delete(
        '/admin/{user}',
        [AdminController::class, 'destroy']
    )->name('admin.destroy');
});

/*

| Insurance Management

*/

Route::middleware([
    'auth',
    'verified',
    'role:admin,receptionist',
])->group(function () {
    Route::get(
        '/insurance',
        [InsuranceController::class, 'index']
    )->name('insurance.index');

    Route::get(
        '/insurance/create',
        [InsuranceController::class, 'create']
    )->name('insurance.create');

        Route::get(
            '/insurance/{insurance}/edit',
            [InsuranceController::class, 'edit']
        )->name('insurance.edit');

        Route::put(
            '/insurance/{insurance}',
            [InsuranceController::class, 'update']
        )->name('insurance.update');

    Route::post(
        '/insurance',
        [InsuranceController::class, 'store']
    )->name('insurance.store');
});

/*

| Billing Management

|
| Billing is accessible by administrators, billing staff and doctors.
|
*/

Route::middleware([
    'auth',
    'verified',
    'role:admin,billing,doctor',
])->group(function () {
    Route::get(
        '/billing',
        [BillingController::class, 'index']
    )->name('billing.index');

    Route::get(
        '/billing/{appointment}/edit',
        [BillingController::class, 'edit']
    )->name('billing.edit');

    Route::put(
        '/billing/{appointment}',
        [BillingController::class, 'update']
    )->name('billing.update');

    Route::put(
        '/billing/{appointment}/update-status',
        [BillingController::class, 'updateStatus']
    )->name('billing.updateStatus');

    /*
    
    | Clinical Data
    
    */

    Route::get(
        '/billing/{appointment}/claim/clinicaldata',
        [BillingController::class, 'createClinicalData']
    )->name('billing.claim.clinicaldata');

    Route::post(
        '/billing/{appointment}/claim/clinicaldata',
        [BillingController::class, 'storeClinicalData']
    )->name('billing.claim.store_clinicaldata');

    Route::get(
        '/billing/{appointment}/downloadclinicaldata',
        [PatientsController::class, 'downloadClinicalData']
    )->name('billing.download_clinical_data');

    /*
    
    | Payments
    
    */

    Route::get(
        '/billing/{appointment}/payment',
        [BillingController::class, 'payment']
    )->name('billing.payment');

    Route::put(
        '/billing/{appointment}/payment',
        [BillingController::class, 'storePayment']
    )->name('billing.storePayment');

    /*
    
    | Bill Generation
    
    */

    Route::get(
        '/billing/{appointment}/bill',
        [BillingController::class, 'bill']
    )->name('billing.bill');

    Route::get(
        '/billing/{appointment_id}/download',
        [BillingController::class, 'downloadBill']
    )->name('billing.download');
});

/*

| Additional Route Files

*/

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';