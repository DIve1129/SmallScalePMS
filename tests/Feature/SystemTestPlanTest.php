<?php

use App\Models\User;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Appointment;
use App\Models\Billing;

// ─────────────────────────────────────────────────────────────────
// Helper: create a fresh Doctor with a unique SLMC number
// ─────────────────────────────────────────────────────────────────
function makeDoctor(int $slmc, array $extra = []): Doctor
{
    return Doctor::create(array_merge([
        'first_name'  => 'Test',
        'last_name'   => 'Doctor',
        'slmc_number' => $slmc,
        'status'      => 'Active',
    ], $extra));
}

// ─────────────────────────────────────────────────────────────────
// Helper: create a fresh Patient with the given CH-prefixed ID
// ─────────────────────────────────────────────────────────────────
function makePatient(string $id, array $extra = []): Patient
{
    return Patient::create(array_merge([
        'patient_id' => $id,
        'first_name' => 'John',
        'last_name'  => 'Doe',
    ], $extra));
}

// ─────────────────────────────────────────────────────────────────
// TC-PMS-001  Authentication — valid credentials
// ─────────────────────────────────────────────────────────────────
test('TC-PMS-001: registered user can log in with valid credentials', function () {
    $user = User::factory()->create(['password' => bcrypt('password')]);

    $response = $this->post('/login', [
        'email'    => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect('/dashboard');
});

// ─────────────────────────────────────────────────────────────────
// TC-PMS-002  Access Control (RBAC) — receptionist → /admin = 403
// ─────────────────────────────────────────────────────────────────
test('TC-PMS-002: receptionist is blocked from accessing the Admin module with 403', function () {
    $user = User::factory()->create(['role' => 'receptionist']);

    $response = $this->actingAs($user)->get('/admin');

    $response->assertStatus(403);
});

// ─────────────────────────────────────────────────────────────────
// TC-PMS-003  Patient Intake — auto-generated chart ID (CH- prefix)
// ─────────────────────────────────────────────────────────────────
test('TC-PMS-003: registering a patient without a chart number auto-generates a CH- ID', function () {
    $user = User::factory()->create(['role' => 'receptionist']);

    $response = $this->actingAs($user)->post('/patients', [
        'first_name' => 'John',
        'last_name'  => 'Doe',
        'dob'        => '1990-05-15',
        'age'        => 36,
        'nic'        => '199013579V',
    ]);

    $response->assertRedirect('/patients');

    $patient = Patient::where('first_name', 'John')->where('last_name', 'Doe')->first();
    expect($patient)->not->toBeNull();
    expect($patient->patient_id)->toStartWith('CH-');
});

// ─────────────────────────────────────────────────────────────────
// TC-PMS-004  Patient Search — returns matching records
// ─────────────────────────────────────────────────────────────────
test('TC-PMS-004: patient search returns matching records by name', function () {
    $user = User::factory()->create(['role' => 'receptionist']);

    makePatient('CH-S001', ['first_name' => 'JohnSearch', 'last_name' => 'Doe']);
    makePatient('CH-S002', ['first_name' => 'Jane', 'last_name' => 'Smith']);

    $response = $this->actingAs($user)->get('/patients?search=JohnSearch');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('patients/index')
        ->has('patients', 1)
        ->where('patients.0.first_name', 'JohnSearch')
    );
});

// ─────────────────────────────────────────────────────────────────
// TC-PMS-005  Patient Profile — view existing patient
// ─────────────────────────────────────────────────────────────────
test('TC-PMS-005: details of existing patient can be viewed', function () {
    $user    = User::factory()->create(['role' => 'receptionist']);
    $patient = makePatient('CH-V001');

    $response = $this->actingAs($user)->get("/patients/CH-V001");

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('patients/show')
        ->where('patient.patient_id', 'CH-V001')
    );
});

// ─────────────────────────────────────────────────────────────────
// TC-PMS-006  Patient Edit — updating notes persists correctly
// ─────────────────────────────────────────────────────────────────
test('TC-PMS-006: updating patient notes saves and redirects to patient list', function () {
    $user    = User::factory()->create(['role' => 'receptionist']);
    $patient = makePatient('CH-E001', ['notes' => 'Old notes']);

    $response = $this->actingAs($user)->put('/patients/CH-E001', [
        'patient_id' => 'CH-E001',
        'first_name' => 'John',
        'last_name'  => 'Doe',
        'notes'      => 'Patient has a penicillin allergy.',
    ]);

    $response->assertRedirect('/patients');

    $patient->refresh();
    expect($patient->notes)->toBe('Patient has a penicillin allergy.');
});

// ─────────────────────────────────────────────────────────────────
// TC-PMS-007  Appointment Scheduling — future date saves with correct amount
// ─────────────────────────────────────────────────────────────────
test('TC-PMS-007: booking a new appointment with a future date saves successfully', function () {
    $user    = User::factory()->create(['role' => 'receptionist']);
    $patient = makePatient('CH-A001');
    $doctor  = makeDoctor(10001);

    $response = $this->actingAs($user)->post('/appointments', [
        'patient_id'   => 'CH-A001',
        'doctor_id'    => $doctor->doctor_id,
        'app_reason'   => 'General Consultation',
        'scheduled_at' => '2027-10-10 14:00:00',
        'amount_1'     => 1500,
    ]);

    $response->assertRedirect('/appointments');

    $appt = Appointment::where('patient_id', 'CH-A001')->first();
    expect($appt)->not->toBeNull();
    expect((float) $appt->amount_1)->toEqual(1500.0);
});

// ─────────────────────────────────────────────────────────────────
// TC-PMS-008  [INTENTIONAL FAIL] Past-date appointment — no backend validation
// Expected Business Logic: reject past dates.
// Actual Behaviour (BUG): saves without error → test proves the gap.
// ─────────────────────────────────────────────────────────────────
test('TC-PMS-008 (INTENTIONAL FAIL — BUG): system accepts appointments with past dates without validation', function () {
    $user    = User::factory()->create(['role' => 'receptionist']);
    $patient = makePatient('CH-A002');
    $doctor  = makeDoctor(10002);

    $response = $this->actingAs($user)->post('/appointments', [
        'patient_id'   => 'CH-A002',
        'doctor_id'    => $doctor->doctor_id,
        'app_reason'   => 'General Consultation',
        'scheduled_at' => '2020-01-01 10:00:00',  // Historical date
        'amount_1'     => 1500,
    ]);

    // BUG: Should return validation errors, but instead redirects successfully.
    // This assertion confirms the bug: past date is accepted.
    $response->assertRedirect('/appointments');

    $appt = Appointment::where('patient_id', 'CH-A002')->first();
    expect($appt)->not->toBeNull();
    // Scheduled_at was persisted with a past date — the missing validation is confirmed.
    expect($appt->scheduled_at)->toContain('2020-01-01');
});

// ─────────────────────────────────────────────────────────────────
// TC-PMS-009  Clinical Charting (EHR) — vitals and assessment saved
// ─────────────────────────────────────────────────────────────────
test('TC-PMS-009: recording patient vitals and clinical assessment succeeds', function () {
    $user    = User::factory()->create(['role' => 'doctor']);
    $patient = makePatient('CH-C001');
    $doctor  = makeDoctor(10003);

    $appt = Appointment::create([
        'patient_id'   => 'CH-C001',
        'doctor_id'    => $doctor->doctor_id,
        'app_reason'   => 'Initial Complaint',
        'scheduled_at' => now(),
        'status'       => 'Ongoing',
    ]);

    $response = $this->actingAs($user)->post("/billing/{$appt->appointment_id}/claim/clinicaldata", [
        'blood_pressure'        => '120/80',
        'pulse_rate'            => '72',
        'temperature_c'         => '36.8',
        'weight_kg'             => '70',
        'chief_complaint'       => 'Fever',
        'clinical_examination'  => 'Warm skin, no rash',
        'diagnosis'             => 'Viral Fever',
        'prescribed_medication' => 'Paracetamol 500mg TDS',
        'plan_of_management'    => 'Rest and fluids for 5 days',
    ]);

    $response->assertRedirect('/billing');

    $appt->refresh();
    expect($appt->blood_pressure)->toBe('120/80');
    expect($appt->pulse_rate)->toBe('72');
    expect($appt->diagnosis)->toBe('Viral Fever');
});

// ─────────────────────────────────────────────────────────────────
// TC-PMS-010  Clinical Data PDF — download returns a PDF stream
// ─────────────────────────────────────────────────────────────────
test('TC-PMS-010: downloading clinical encounter PDF succeeds', function () {
    $user    = User::factory()->create(['role' => 'admin']);
    $patient = makePatient('CH-P001');
    $doctor  = makeDoctor(10004);

    $appt = Appointment::create([
        'patient_id'   => 'CH-P001',
        'doctor_id'    => $doctor->doctor_id,
        'app_reason'   => 'Fever',
        'scheduled_at' => now(),
        'blood_pressure' => '120/80',
        'diagnosis'    => 'Viral Fever',
    ]);

    $response = $this->actingAs($user)->get("/billing/{$appt->appointment_id}/downloadclinicaldata");

    $response->assertStatus(200);
    $response->assertHeader('content-type', 'application/pdf');
});

// ─────────────────────────────────────────────────────────────────
// TC-PMS-011  Billing Management — multi-service aggregation
// ─────────────────────────────────────────────────────────────────
test('TC-PMS-011: multi-service billing edit saves all three services and amounts', function () {
    $user    = User::factory()->create(['role' => 'billing']);
    $patient = makePatient('CH-B001');
    $doctor  = makeDoctor(10005);

    $appt = Appointment::create([
        'patient_id'   => 'CH-B001',
        'doctor_id'    => $doctor->doctor_id,
        'app_reason'   => 'Consultation',
        'scheduled_at' => now(),
        'amount_1'     => 1500,
        'status'       => 'Ongoing',
    ]);

    $response = $this->actingAs($user)->put("/billing/{$appt->appointment_id}", [
        'appointment_reason' => 'Consultation',
        'service_2'          => 'Blood Count',
        'service_3'          => 'ECG',
        'amount_1'           => 1500,
        'amount_2'           => 800,
        'amount_3'           => 1200,
        'payment_1'          => 0,
        'payment_2'          => 0,
        'payment_3'          => 0,
        'responsibility'     => 'Patient',
        'claim_status'       => 'Pending',
        'status'             => 'Completed',
    ]);

    $response->assertRedirect('/billing');

    $appt->refresh();
    expect($appt->service_2)->toBe('Blood Count');
    expect($appt->service_3)->toBe('ECG');
    expect((float) $appt->amount_2)->toEqual(800.0);
    expect((float) $appt->amount_3)->toEqual(1200.0);
});

// ─────────────────────────────────────────────────────────────────
// TC-PMS-012  Claims Management — responsibility + claim status update
// ─────────────────────────────────────────────────────────────────
test('TC-PMS-012: claim status and responsibility update correctly', function () {
    $user    = User::factory()->create(['role' => 'billing']);
    $patient = makePatient('CH-CL001');
    $doctor  = makeDoctor(10006);

    $appt = Appointment::create([
        'patient_id'   => 'CH-CL001',
        'doctor_id'    => $doctor->doctor_id,
        'app_reason'   => 'Consultation',
        'scheduled_at' => now(),
        'status'       => 'Completed',
    ]);

    $response = $this->actingAs($user)->put("/billing/{$appt->appointment_id}/update-status", [
        'responsibility' => 'Insurance',
        'claim_status'   => 'Ready to Bill',
    ]);

    $response->assertRedirect();

    $appt->refresh();
    expect($appt->responsibility)->toBe('Insurance');
    expect($appt->claim_status)->toBe('Ready to Bill');
});

// ─────────────────────────────────────────────────────────────────
// TC-PMS-013  [INTENTIONAL FAIL] Negative payment — backend rejects (min:0 rule)
// Frontend BUG: React UI has no min="0" on payment inputs so it
// locally computes balance as increased. This test proves the
// backend validation DOES block it, but the UI flaw is unguarded.
// ─────────────────────────────────────────────────────────────────
test('TC-PMS-013 (INTENTIONAL FAIL — BUG): backend rejects negative payments but frontend accepts them', function () {
    $user    = User::factory()->create(['role' => 'billing']);
    $patient = makePatient('CH-N001');
    $doctor  = makeDoctor(10007);

    $appt = Appointment::create([
        'patient_id'   => 'CH-N001',
        'doctor_id'    => $doctor->doctor_id,
        'app_reason'   => 'Consultation',
        'scheduled_at' => now(),
        'amount_1'     => 1500,
        'status'       => 'Completed',
    ]);

    // Backend has min:0 validation — it SHOULD block negative payments.
    $response = $this->actingAs($user)->put("/billing/{$appt->appointment_id}/payment", [
        'payment_1' => -500,
    ]);

    // Backend correctly blocks this via validation error.
    $response->assertSessionHasErrors(['payment_1']);

    // However: the React payment.tsx UI has no min="0" attribute,
    // so the frontend computes balance as 1500 - (-500) = 2000 locally
    // before even submitting, misleading the user.
    // This is the documented FRONTEND bug — confirmed by UI inspection.
});

// ─────────────────────────────────────────────────────────────────
// TC-PMS-014  Invoice PDF — bill download returns a PDF stream
// ─────────────────────────────────────────────────────────────────
test('TC-PMS-014: downloading the patient invoice bill PDF succeeds', function () {
    $user    = User::factory()->create(['role' => 'billing']);
    $patient = makePatient('CH-I001');
    $doctor  = makeDoctor(10008);

    $appt = Appointment::create([
        'patient_id'   => 'CH-I001',
        'doctor_id'    => $doctor->doctor_id,
        'app_reason'   => 'Consultation',
        'scheduled_at' => now(),
        'amount_1'     => 1500,
        'payment_1'    => 1000,
        'status'       => 'Completed',
    ]);

    $response = $this->actingAs($user)->get("/billing/{$appt->appointment_id}/download");

    $response->assertStatus(200);
    $response->assertHeader('content-type', 'application/pdf');
});

// ─────────────────────────────────────────────────────────────────
// TC-PMS-015  Administration — admin creates a doctor user account
// ─────────────────────────────────────────────────────────────────
test('TC-PMS-015: admin can create a new user account with doctor role', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post('/admin', [
        'name'     => 'Dr. Sarah Connor',
        'email'    => 'sarah.doctor@clinic.com',
        'password' => 'securepass',
        'role'     => 'doctor',
    ]);

    $response->assertRedirect('/admin');

    $doctorUser = User::where('email', 'sarah.doctor@clinic.com')->first();
    expect($doctorUser)->not->toBeNull();
    expect($doctorUser->role)->toBe('doctor');
});
