import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';

type AppointmentInfo = {
  appointment_id: number;
  patient_id: number;
  patient_name: string;
  doctor_name: string;
  appointment_date: string;
  appointment_reason: string;
  blood_pressure?: string;
  pulse_rate?: string;
  temperature_c?: string;
  weight_kg?: string;

  clinical_examination?: string;
  diagnosis?: string;
  prescribed_medication?: string;
  plan_of_management?: string;
};

export default function ClinicalDataCreate({
  appointment,
}: {
  appointment: AppointmentInfo;
}) {
  // Initialize Inertia form state metrics matching medical record fields
  const { data, setData, post, processing, errors } = useForm({
    blood_pressure: appointment.blood_pressure ?? '',
    pulse_rate: appointment.pulse_rate ?? '',
    temperature_c: appointment.temperature_c ?? '',
    weight_kg: appointment.weight_kg ?? '',

    chief_complaint: appointment.appointment_reason ?? '',
    clinical_examination: appointment.clinical_examination ?? '',
    diagnosis: appointment.diagnosis ?? '',
    prescribed_medication: appointment.prescribed_medication ?? '',
    plan_of_management: appointment.plan_of_management ?? '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();

    // Submits data back to your billing update process pipeline
    post(`/billing/${appointment.appointment_id}/claim/clinicaldata`);
  }

  // Consistent layout helper styles matching your other system panels
  const inputClass =
    'w-full rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:focus:ring-ring';

  const textareaClass =
    'min-h-[100px] w-full resize-y rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:focus:ring-ring';

  const labelClass =
    'mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-muted-foreground';

  return (
    <AppSidebarLayout
      breadcrumbs={[
        { title: 'Billing Module', href: '/billing' },
        {
          title: 'Add Clinical Data',
          href: `/billing/${appointment.appointment_id}/claim/clinicaldata`,
        },
      ]}
    >
      <Head title="Patient Clinical Record" />

      <div className="mx-auto max-w-5xl space-y-6 bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
        {/* Header Title Section */}
        <div className="flex items-center justify-between border-b border-blue-100 pb-4 dark:border-border">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">
              Add Clinical Encounter Data
            </h1>

            <p className="text-sm text-slate-500 dark:text-muted-foreground">
              Log physical observations, patient vitals, and final medical chart
              assessments
            </p>
          </div>

          <Link
            href="/billing"
            className="rounded-lg border border-blue-100 bg-white px-4 py-2 text-sm text-[#2563EB] transition hover:bg-[#EAF5FF] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent"
          >
            Back to Queue
          </Link>
        </div>

        {/* Eager-Loaded Static Info Banner Grid */}
        <div className="grid grid-cols-1 gap-4 rounded-xl border border-blue-100 bg-[#EAF5FF] p-4 text-sm shadow-sm md:grid-cols-4 dark:border-border dark:bg-muted">
          <div>
            <span className="block text-xs font-medium text-slate-500 dark:text-muted-foreground">
              Patient Name
            </span>

            <span className="font-semibold text-slate-900 dark:text-foreground">
              {appointment.patient_name} (ID: {appointment.patient_id})
            </span>
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-500 dark:text-muted-foreground">
              Attending Consultant
            </span>

            <span className="font-semibold text-slate-900 dark:text-foreground">
              {appointment.doctor_name}
            </span>
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-500 dark:text-muted-foreground">
              Encounter Context
            </span>

            <span className="font-semibold text-slate-900 dark:text-foreground">
              {appointment.appointment_reason}
            </span>
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-500 dark:text-muted-foreground">
              Date of Encounter
            </span>

            <span className="font-semibold text-slate-900 dark:text-foreground">
              {appointment.appointment_date}
            </span>
          </div>
        </div>

        {/* Main Electronic Charting Form Block */}
        <form onSubmit={submit} className="space-y-6">
          {/* Section 1: Patient Vital Signs */}
          <div className="space-y-4 rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card">
            <h2 className="border-b border-blue-100 pb-2 text-lg font-medium text-slate-900 dark:border-border dark:text-foreground">
              1. Patient Vitals & Triage Metrics
            </h2>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label className={labelClass}>
                  Blood Pressure (mmHg)
                </label>

                <input
                  type="text"
                  placeholder="e.g., 120/80"
                  className={inputClass}
                  value={data.blood_pressure}
                  onChange={(e) =>
                    setData('blood_pressure', e.target.value)
                  }
                />

                {errors.blood_pressure && (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.blood_pressure}
                  </div>
                )}
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

                {errors.pulse_rate && (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.pulse_rate}
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Temperature (°C)</label>

                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 36.8"
                  className={inputClass}
                  value={data.temperature_c}
                  onChange={(e) =>
                    setData('temperature_c', e.target.value)
                  }
                />

                {errors.temperature_c && (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.temperature_c}
                  </div>
                )}
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

                {errors.weight_kg && (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.weight_kg}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Assessment Form fields */}
          <div className="space-y-4 rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card">
            <h2 className="border-b border-blue-100 pb-2 text-lg font-medium text-slate-900 dark:border-border dark:text-foreground">
              2. Presentation & Clinical Assessment
            </h2>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  Chief Complaint / History of Present Illness
                </label>

                <textarea
                  className={textareaClass}
                  placeholder="Describe reasons drawing the patient to the clinic, symptoms profile, onset timing..."
                  value={data.chief_complaint}
                  onChange={(e) =>
                    setData('chief_complaint', e.target.value)
                  }
                />

                {errors.chief_complaint && (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.chief_complaint}
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Physical / Clinical Examination Notes
                </label>

                <textarea
                  className={textareaClass}
                  placeholder="Log physical exam findings, systemic observations, cardiovascular/respiratory review findings..."
                  value={data.clinical_examination}
                  onChange={(e) =>
                    setData('clinical_examination', e.target.value)
                  }
                />

                {errors.clinical_examination && (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.clinical_examination}
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Working or Final Diagnosis
                </label>

                <textarea
                  className={textareaClass}
                  placeholder="Primary conditions identified, medical clinical indexing, comorbidities..."
                  value={data.diagnosis}
                  onChange={(e) => setData('diagnosis', e.target.value)}
                />

                {errors.diagnosis && (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.diagnosis}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Directives and Management */}
          <div className="space-y-4 rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card">
            <h2 className="border-b border-blue-100 pb-2 text-lg font-medium text-slate-900 dark:border-border dark:text-foreground">
              3. Management Plan & Treatment Directives
            </h2>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  Prescribed Medications & Dosage Protocols
                </label>

                <textarea
                  className={textareaClass}
                  placeholder="e.g., Amoxicillin 500mg - TDS for 5 Days, Paracetamol 1g - PRN..."
                  value={data.prescribed_medication}
                  onChange={(e) =>
                    setData('prescribed_medication', e.target.value)
                  }
                />

                {errors.prescribed_medication && (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.prescribed_medication}
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Plan of Management / Care Directives
                </label>

                <textarea
                  className={textareaClass}
                  placeholder="Detail laboratory tests requested, lifestyle advice, specific specialist referral directions, return timelines..."
                  value={data.plan_of_management}
                  onChange={(e) =>
                    setData('plan_of_management', e.target.value)
                  }
                />

                {errors.plan_of_management && (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.plan_of_management}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submission and Control Action Elements */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={processing}
              className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary dark:text-primary-foreground"
            >
              {processing
                ? 'Saving Electronic Chart...'
                : 'Commit Clinical Data'}
            </button>

            <Link
              href="/billing"
              className="rounded-lg border border-blue-100 bg-white px-5 py-2.5 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AppSidebarLayout>
  );
}