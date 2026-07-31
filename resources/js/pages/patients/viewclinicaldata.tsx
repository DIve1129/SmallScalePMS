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

/* Displays the saved clinical record for a completed appointment. */
export default function ViewClinicalData({ record }: { record: ClinicalRecord }) {
    const labelClass = 'mb-1 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-muted-foreground';

    const dataBoxClass =
        'min-h-[40px] w-full whitespace-pre-wrap rounded-lg border border-blue-100 bg-[#F8FBFF] px-3 py-2.5 text-sm text-slate-800 dark:border-border dark:bg-muted dark:text-foreground';

    const secondaryButtonClass =
        'rounded-lg border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] hover:text-[#1D4ED8] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground';

    return (
        <AppSidebarLayout
            breadcrumbs={[
                { title: 'Patients', href: '/patients' },
                {
                    title: `Patient #${record.patient_id}`,
                    href: `/patients/${record.patient_id}`,
                },
                {
                    title: 'Billing History',
                    href: `/patients/${record.patient_id}/billing`,
                },
                { title: 'View Clinical Record', href: '#' },
            ]}
        >
            <Head title="View Clinical Record" />

            <div className="min-h-full bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
                <div className="mx-auto w-full max-w-5xl space-y-6">
                    {/* Displays the clinical record actions. */}
                    <div className="flex items-center gap-3">
                        <a href={`/billing/${record.appointment_id}/downloadclinicaldata`} className={secondaryButtonClass}>
                            Download PDF
                        </a>

                        <Link href={`/patients/${record.patient_id}/billing`} className={secondaryButtonClass}>
                            Back to Billing History
                        </Link>
                    </div>

                    {/* Displays patient and appointment context. */}
                    <div className="grid grid-cols-1 gap-4 rounded-xl border border-blue-100 bg-white p-4 text-sm shadow-sm md:grid-cols-4 dark:border-border dark:bg-card">
                        <div>
                            <span className="block text-xs font-medium text-slate-500 dark:text-muted-foreground">Patient Name</span>

                            <span className="font-semibold text-slate-900 dark:text-foreground">
                                {record.patient_name} (ID: {record.patient_id})
                            </span>
                        </div>

                        <div>
                            <span className="block text-xs font-medium text-slate-500 dark:text-muted-foreground">Attending Consultant</span>

                            <span className="font-semibold text-slate-900 dark:text-foreground">{record.doctor_name}</span>
                        </div>

                        <div>
                            <span className="block text-xs font-medium text-slate-500 dark:text-muted-foreground">Initial Context</span>

                            <span className="font-semibold text-slate-900 dark:text-foreground">{record.appointment_reason}</span>
                        </div>

                        <div>
                            <span className="block text-xs font-medium text-slate-500 dark:text-muted-foreground">Date of Service</span>

                            <span className="font-semibold text-slate-900 dark:text-foreground">{record.appointment_date}</span>
                        </div>
                    </div>

                    {/* Displays saved patient vital signs. */}
                    <div className="space-y-4 rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card">
                        <h2 className="border-b border-blue-100 pb-2 text-lg font-semibold text-slate-900 dark:border-border dark:text-foreground">
                            1. Patient Vitals & Triage Metrics
                        </h2>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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

                    {/* Displays examination details and diagnosis. */}
                    <div className="space-y-4 rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card">
                        <h2 className="border-b border-blue-100 pb-2 text-lg font-semibold text-slate-900 dark:border-border dark:text-foreground">
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

                                <div className={dataBoxClass}>
                                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                        {record.diagnosis || 'No structural diagnosis mapped.'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Displays medications and management plan. */}
                    <div className="space-y-4 rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card">
                        <h2 className="border-b border-blue-100 pb-2 text-lg font-semibold text-slate-900 dark:border-border dark:text-foreground">
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
            </div>
        </AppSidebarLayout>
    );
}
