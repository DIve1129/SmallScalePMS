import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';

type ClinicalRecord = {
  appointment_id: number;
  patient_id: number | string;
  patient_name: string;
  doctor_name: string;
  appointment_date: string;
  appointment_reason: string;
  
  // Saved Strategy A Data Columns
  blood_pressure: string | null;
  pulse_rate: number | string | null;
  temperature_c: number | string | null;
  weight_kg: number | string | null;
  clinical_examination: string | null;
  diagnosis: string | null;
  prescribed_medication: string | null;
  plan_of_management: string | null;
};

export default function ViewClinicalData({ record }: { record: ClinicalRecord }) {
  const labelClass = 'mb-1 block text-xs font-medium text-muted-foreground uppercase tracking-wider';
  const dataBoxClass = 'w-full rounded-md border border-border bg-muted/20 px-3 py-2.5 text-sm text-foreground min-h-[40px] whitespace-pre-wrap';

  return (
    <AppSidebarLayout
      breadcrumbs={[
        { title: 'Patients', href: '/patients' },
        { title: `Patient #${record.patient_id}`, href: `/patients/${record.patient_id}` },
        { title: 'Billing History', href: `/patients/${record.patient_id}/billing` },
        { title: 'View Clinical Record', href: '#' },
      ]}
    >
      <Head title="View Clinical Record" />

      <div className="p-6 text-foreground max-w-5xl mx-auto space-y-6">
        
        {/* Header Summary row */}
      <div className="flex items-center gap-3">
        {/* The New Download Button */}
        <a
            href={`/billing/${record.appointment_id}/downloadclinicaldata`}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground transition hover:bg-accent"
        >
            Download PDF
        </a>

        <Link
            href={`/patients/${record.patient_id}/billing`}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground transition hover:bg-accent"
        >
            Back to Billing History
        </Link>
        </div>

        {/* Master Context Meta Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/40 p-4 rounded-lg border border-border text-sm">
          <div>
            <span className="block text-muted-foreground font-medium text-xs">Patient Name</span>
            <span className="font-semibold text-foreground">{record.patient_name} (ID: {record.patient_id})</span>
          </div>
          <div>
            <span className="block text-muted-foreground font-medium text-xs">Attending Consultant</span>
            <span className="font-semibold text-foreground">{record.doctor_name}</span>
          </div>
          <div>
            <span className="block text-muted-foreground font-medium text-xs">Initial Context</span>
            <span className="font-semibold text-foreground">{record.appointment_reason}</span>
          </div>
          <div>
            <span className="block text-muted-foreground font-medium text-xs">Date of Service</span>
            <span className="font-semibold text-foreground">{record.appointment_date}</span>
          </div>
        </div>

        {/* Section 1: Saved Vital Signs */}
        <div className="rounded-lg border border-border bg-background p-6 space-y-4">
          <h2 className="text-lg font-medium text-foreground border-b border-border pb-2">
            1. Patient Vitals & Triage Metrics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className={labelClass}>Blood Pressure</span>
              <div className={dataBoxClass}>{record.blood_pressure || '-'}</div>
            </div>
            <div>
              <span className={labelClass}>Pulse Rate (bpm)</span>
              <div className={dataBoxClass}>{record.pulse_rate ? `${record.pulse_rate} bpm` : '-'}</div>
            </div>
            <div>
              <span className={labelClass}>Temperature (°C)</span>
              <div className={dataBoxClass}>{record.temperature_c ? `${record.temperature_c} °C` : '-'}</div>
            </div>
            <div>
              <span className={labelClass}>Body Weight (kg)</span>
              <div className={dataBoxClass}>{record.weight_kg ? `${record.weight_kg} kg` : '-'}</div>
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Examination Logs */}
        <div className="rounded-lg border border-border bg-background p-6 space-y-4">
          <h2 className="text-lg font-medium text-foreground border-b border-border pb-2">
            2. Presentation & Clinical Assessment
          </h2>
          
          <div className="space-y-4">
            <div>
              <span className={labelClass}>Chief Complaint / History of Present Illness</span>
              <div className={dataBoxClass}>{record.appointment_reason || '-'}</div>
            </div>

            <div>
              <span className={labelClass}>Physical / Clinical Examination Notes</span>
              <div className={dataBoxClass}>{record.clinical_examination || 'No clinical examination details logged.'}</div>
            </div>

            <div>
              <span className={labelClass}>Working or Final Diagnosis</span>
              <div className={dataBoxClass}><span className="font-medium text-emerald-500 dark:text-emerald-400">{record.diagnosis || 'No structural diagnosis mapped.'}</span></div>
            </div>
          </div>
        </div>

        {/* Section 3: Directives and Prescriptions */}
        <div className="rounded-lg border border-border bg-background p-6 space-y-4">
          <h2 className="text-lg font-medium text-foreground border-b border-border pb-2">
            3. Management Plan & Treatment Directives
          </h2>
          
          <div className="space-y-4">
            <div>
              <span className={labelClass}>Prescribed Medications & Dosage Protocols</span>
              <div className={dataBoxClass}>{record.prescribed_medication || 'No medications issued.'}</div>
            </div>

            <div>
              <span className={labelClass}>Plan of Management / Care Directives</span>
              <div className={dataBoxClass}>{record.plan_of_management || 'No secondary follow-up orders specified.'}</div>
            </div>
          </div>
        </div>

      </div>
    </AppSidebarLayout>
  );
}