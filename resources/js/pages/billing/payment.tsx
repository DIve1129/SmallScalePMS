import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, useForm } from '@inertiajs/react';

type Appointment = {
  appointment_id: number;
  appointment_reason?: string | null;
  service_2?: string | null;
  service_3?: string | null;
  amount_1?: number | string | null;
  amount_2?: number | string | null;
  amount_3?: number | string | null;
  payment_1?: number | string | null;
  payment_2?: number | string | null;
  payment_3?: number | string | null;
};

function money(value: number | string | null | undefined) {
  return Number(value ?? 0).toFixed(2);
}

export default function BillingPayment({ appointment }: { appointment: Appointment }) {
  const { data, setData, put, processing, errors } = useForm({
    payment_1: appointment.payment_1 ?? 0,
    payment_2: appointment.payment_2 ?? 0,
    payment_3: appointment.payment_3 ?? 0,
  });

  const amount1 = Number(appointment.amount_1 ?? 0);
  const amount2 = Number(appointment.amount_2 ?? 0);
  const amount3 = Number(appointment.amount_3 ?? 0);

  const payment1 = Number(data.payment_1 ?? 0);
  const payment2 = Number(data.payment_2 ?? 0);
  const payment3 = Number(data.payment_3 ?? 0);

  const balance1 = Math.max(amount1 - payment1, 0);
  const balance2 = Math.max(amount2 - payment2, 0);
  const balance3 = Math.max(amount3 - payment3, 0);

  const totalAmount = amount1 + amount2 + amount3;
  const totalPayment = payment1 + payment2 + payment3;
  const totalBalance = balance1 + balance2 + balance3;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(`/billing/${appointment.appointment_id}/payment`);
  }

  return (
    <AppSidebarLayout breadcrumbs={[{ title: 'Billing', href: '/billing' }, { title: 'Payment', href: '#' }]}>
      <Head title="Post Payment" />

      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Post Payment</h1>
          <p className="text-sm text-muted-foreground">Post payments per service.</p>
        </div>

        <form onSubmit={submit} className="space-y-6 rounded-lg border border-border bg-background p-6">
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="grid grid-cols-12 bg-muted px-5 py-4 text-sm font-medium text-foreground">
              <div className="col-span-4">Service</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-3">Payment</div>
              <div className="col-span-3">Balance</div>
            </div>

            <div className="divide-y divide-border">
              <div className="grid grid-cols-12 items-center gap-3 px-5 py-4 text-sm">
                <div className="col-span-4">{appointment.appointment_reason || '-'}</div>
                <div className="col-span-2">Rs {money(amount1)}</div>
                <div className="col-span-3">
                  <input
                    type="number"
                    step="0.01"
                    value={data.payment_1}
                    onChange={(e) => setData('payment_1', e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                  />
                  {errors.payment_1 && <p className="mt-1 text-sm text-red-500">{errors.payment_1}</p>}
                </div>
                <div className="col-span-3">Rs {money(balance1)}</div>
              </div>

              <div className="grid grid-cols-12 items-center gap-3 px-5 py-4 text-sm">
                <div className="col-span-4">{appointment.service_2 || '-'}</div>
                <div className="col-span-2">Rs {money(amount2)}</div>
                <div className="col-span-3">
                  <input
                    type="number"
                    step="0.01"
                    value={data.payment_2}
                    onChange={(e) => setData('payment_2', e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                  />
                </div>
                <div className="col-span-3">Rs {money(balance2)}</div>
              </div>

              <div className="grid grid-cols-12 items-center gap-3 px-5 py-4 text-sm">
                <div className="col-span-4">{appointment.service_3 || '-'}</div>
                <div className="col-span-2">Rs {money(amount3)}</div>
                <div className="col-span-3">
                  <input
                    type="number"
                    step="0.01"
                    value={data.payment_3}
                    onChange={(e) => setData('payment_3', e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                  />
                </div>
                <div className="col-span-3">Rs {money(balance3)}</div>
              </div>

              <div className="grid grid-cols-12 items-center gap-3 bg-muted px-5 py-4 text-sm font-semibold">
                <div className="col-span-4">Total</div>
                <div className="col-span-2">Rs {money(totalAmount)}</div>
                <div className="col-span-3">Rs {money(totalPayment)}</div>
                <div className="col-span-3">Rs {money(totalBalance)}</div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="rounded-md border border-border bg-muted px-5 py-3 text-sm text-foreground hover:bg-accent disabled:opacity-50"
          >
            {processing ? 'Posting...' : 'Post Payment'}
          </button>
        </form>
      </div>
    </AppSidebarLayout>
  );
}