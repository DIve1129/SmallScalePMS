import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';

type BillingRow = {
  appointment_id: number;
  patient_id: number | string;
  dos: string | null;
  service: string | null;
  amount: number | string;
  balance: number | string;
};

function money(value: number | string) {
  return `Rs ${Number(value ?? 0).toFixed(2)}`;
}

export default function PatientBilling({
  patientId,
  billings = [],
}: {
  patientId: number | string;
  billings: BillingRow[];
}) {
  return (
    <AppSidebarLayout
      breadcrumbs={[
        { title: 'Patients', href: '/patients' },
        { title: `Patient #${patientId}`, href: `/patients/${patientId}` },
        { title: 'Billing', href: `/patients/${patientId}/billing` },
      ]}
    >
      <Head title={`Patient ${patientId} Billing`} />

      <div className="p-6 space-y-6 text-foreground">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Patient Billing
            </h1>
            <p className="text-sm text-muted-foreground">
              Showing billing records for Patient ID: {patientId}
            </p>
          </div>

          <Link
            href="/patients"
            className="rounded-md border border-border bg-background px-5 py-3 text-sm text-foreground transition hover:bg-accent"
          >
            Back to Patients
          </Link>
        </div>

        <div className="rounded-lg border border-border overflow-hidden bg-background">
          {/* Rebalanced table header grid allocations (Total sum = 12 columns) */}
          <div className="grid grid-cols-12 bg-muted px-5 py-4 text-sm font-medium text-foreground">
            <div className="col-span-2">DOS</div>
            <div className="col-span-4">Service</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Balance Left</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-border">
            {billings.length ? (
              billings.map((b) => (
                <div
                  key={b.appointment_id}
                  className="grid grid-cols-12 items-center px-5 py-4 text-sm text-foreground transition hover:bg-accent"
                >
                  {/* Row alignment elements matching header spaces perfectly */}
                  <div className="col-span-2">{b.dos ?? '-'}</div>
                  <div className="col-span-4">{b.service ?? '-'}</div>
                  <div className="col-span-2">{money(b.amount)}</div>
                  <div className="col-span-2">{money(b.balance)}</div>

                  {/* Allocated col-span-2 offers complete horizontal space for inline flex gap alignment */}
                  <div className="col-span-2 flex justify-end gap-2 whitespace-nowrap">
                    <Link
                      href={`/billing/${b.appointment_id}/viewclinicaldata`}
                      className="rounded-md border border-border bg-background px-3 py-1 text-xs text-foreground transition hover:bg-accent"
                    >
                      Clinical Data
                    </Link>

                    <Link
                      href={`/billing/${b.appointment_id}/bill`}
                      className="rounded-md border border-border bg-background px-3 py-1 text-xs text-foreground transition hover:bg-accent"
                    >
                      Bill
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-sm text-muted-foreground">
                No billing records found for this patient.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
}