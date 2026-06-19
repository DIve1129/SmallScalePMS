import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';

type AppointmentInfo = {
  appointment_id: number;
  patient_id: number;
  patient_name: string;
  doctor_name: string;
  appointment_date: string;
  appointment_reason: string;
};

export default function ClinicalDataCreate({
  appointment,
}: {
  appointment: AppointmentInfo;
}) {
  // Initialize Inertia form state metrics matching medical record fields
  const { data, setData, post, processing, errors } = useForm({
    // Patient Vitals Section
    blood_pressure: '',
    pulse_rate: '',
    temperature_c: '',
    weight_kg: '',
    
    // Clinical Charting Notes Section
    chief_complaint: appointment.appointment_reason || '',
    clinical_examination: '',
    diagnosis: '',
    plan_of_management: '',
    prescribed_medication: '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Submits data back to your billing update process pipeline
    post(`/billing/${appointment.appointment_id}/claim/clinicaldata`);
  }

  // Consistent layout helper styles matching your other system panels
  const inputClass =
    'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring';
  
  const textareaClass =
    'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring min-h-[100px] resize-y';

  const labelClass = 'mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider';

  return (
    <AppSidebarLayout
      breadcrumbs={[
        { title: 'Billing Module', href: '/billing' },
        { title: 'Add Clinical Data', href: `/billing/${appointment.appointment_id}/claim/clinicaldata` },
      ]}
    >
      <Head title="Patient Clinical Record" />

      <div className="p-6 text-foreground max-w-5xl mx-auto space-y-6">
        
        {/* Header Title Section */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Add Clinical Encounter Data</h1>
            <p className="text-sm text-muted-foreground">Log physical observations, patient vitals, and final medical chart assessments</p>
          </div>
          <Link
            href="/billing"
            className="rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground transition hover:bg-accent"
          >
            Back to Queue
          </Link>
        </div>

        {/* Eager-Loaded Static Info Banner Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/40 p-4 rounded-lg border border-border text-sm">
          <div>
            <span className="block text-muted-foreground font-medium text-xs">Patient Name</span>
            <span className="font-semibold text-foreground">{appointment.patient_name} (ID: {appointment.patient_id})</span>
          </div>
          <div>
            <span className="block text-muted-foreground font-medium text-xs">Attending Consultant</span>
            <span className="font-semibold text-foreground">{appointment.doctor_name}</span>
          </div>
          <div>
            <span className="block text-muted-foreground font-medium text-xs">Encounter Context</span>
            <span className="font-semibold text-foreground">{appointment.appointment_reason}</span>
          </div>
          <div>
            <span className="block text-muted-foreground font-medium text-xs">Date of Encounter</span>
            <span className="font-semibold text-foreground">{appointment.appointment_date}</span>
          </div>
        </div>

        {/* Main Electronic Charting Form Block */}
        <form onSubmit={submit} className="space-y-6">
          
          {/* Section 1: Patient Vital Signs */}
          <div className="rounded-lg border border-border bg-background p-6 space-y-4">
            <h2 className="text-lg font-medium text-foreground border-b border-border pb-2">
              1. Patient Vitals & Triage Metrics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>Blood Pressure (mmHg)</label>
                <input
                  type="text"
                  placeholder="e.g., 120/80"
                  className={inputClass}
                  value={data.blood_pressure}
                  onChange={(e) => setData('blood_pressure', e.target.value)}
                />
                {errors.blood_pressure && <div className="mt-1 text-xs text-red-500">{errors.blood_pressure}</div>}
              </div>

              <div>
                <label className={labelClass}>Pulse Rate (bpm)</label>
                <input
                  type="number"
                  placeholder="e.g., 72"
                  className={inputClass}
                  value={data.pulse_rate}
                  onChange={(e) => setData('pulse_rate', e.target.value)}
                />
                {errors.pulse_rate && <div className="mt-1 text-xs text-red-500">{errors.pulse_rate}</div>}
              </div>

              <div>
                <label className={labelClass}>Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 36.8"
                  className={inputClass}
                  value={data.temperature_c}
                  onChange={(e) => setData('temperature_c', e.target.value)}
                />
                {errors.temperature_c && <div className="mt-1 text-xs text-red-500">{errors.temperature_c}</div>}
              </div>

              <div>
                <label className={labelClass}>Body Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 70"
                  className={inputClass}
                  value={data.weight_kg}
                  onChange={(e) => setData('weight_kg', e.target.value)}
                />
                {errors.weight_kg && <div className="mt-1 text-xs text-red-500">{errors.weight_kg}</div>}
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Assessment Form fields */}
          <div className="rounded-lg border border-border bg-background p-6 space-y-4">
            <h2 className="text-lg font-medium text-foreground border-b border-border pb-2">
              2. Presentation & Clinical Assessment
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Chief Complaint / History of Present Illness</label>
                <textarea
                  className={textareaClass}
                  placeholder="Describe reasons drawing the patient to the clinic, symptoms profile, onset timing..."
                  value={data.chief_complaint}
                  onChange={(e) => setData('chief_complaint', e.target.value)}
                />
                {errors.chief_complaint && <div className="mt-1 text-xs text-red-500">{errors.chief_complaint}</div>}
              </div>

              <div>
                <label className={labelClass}>Physical / Clinical Examination Notes</label>
                <textarea
                  className={textareaClass}
                  placeholder="Log physical exam findings, systemic observations, cardiovascular/respiratory review findings..."
                  value={data.clinical_examination}
                  onChange={(e) => setData('clinical_examination', e.target.value)}
                />
                {errors.clinical_examination && <div className="mt-1 text-xs text-red-500">{errors.clinical_examination}</div>}
              </div>

              <div>
                <label className={labelClass}>Working or Final Diagnosis</label>
                <textarea
                  className={textareaClass}
                  placeholder="Primary conditions identified, medical clinical indexing, comorbidities..."
                  value={data.diagnosis}
                  onChange={(e) => setData('diagnosis', e.target.value)}
                />
                {errors.diagnosis && <div className="mt-1 text-xs text-red-500">{errors.diagnosis}</div>}
              </div>
            </div>
          </div>

          {/* Section 3: Directives and Management */}
          <div className="rounded-lg border border-border bg-background p-6 space-y-4">
            <h2 className="text-lg font-medium text-foreground border-b border-border pb-2">
              3. Management Plan & Treatment Directives
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Prescribed Medications & Dosage Protocols</label>
                <textarea
                  className={textareaClass}
                  placeholder="e.g., Amoxicillin 500mg - TDS for 5 Days, Paracetamol 1g - PRN..."
                  value={data.prescribed_medication}
                  onChange={(e) => setData('prescribed_medication', e.target.value)}
                />
                {errors.prescribed_medication && <div className="mt-1 text-xs text-red-500">{errors.prescribed_medication}</div>}
              </div>

              <div>
                <label className={labelClass}>Plan of Management / Care Directives</label>
                <textarea
                  className={textareaClass}
                  placeholder="Detail laboratory tests requested, lifestyle advice, specific specialist referral directions, return timelines..."
                  value={data.plan_of_management}
                  onChange={(e) => setData('plan_of_management', e.target.value)}
                />
                {errors.plan_of_management && <div className="mt-1 text-xs text-red-500">{errors.plan_of_management}</div>}
              </div>
            </div>
          </div>

          {/* Submission and Control Action Elements */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={processing}
              className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
            >
              {processing ? 'Saving Electronic Chart...' : 'Commit Clinical Data'}
            </button>
            <Link
              href="/billing"
              className="rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent"
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </AppSidebarLayout>
  );
}