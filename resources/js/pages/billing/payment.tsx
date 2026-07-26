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

export default function BillingPayment({
  appointment,
}: {
  appointment: Appointment;
}) {
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
    <AppSidebarLayout
      breadcrumbs={[
        { title: 'Billing', href: '/billing' },
        { title: 'Payment', href: '#' },
      ]}
    >
      <Head title="Post Payment" />

      <div className="space-y-6 bg-[#F8FAFC] p-6 dark:bg-background">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">
            Post Payment
          </h1>

          <p className="text-sm text-slate-500 dark:text-muted-foreground">
            Post payments per service.
          </p>
        </div>

        {/* Payment form */}
        <form
          onSubmit={submit}
          className="space-y-6 rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card"
        >
          {/* Payment table */}
          <div className="overflow-hidden rounded-xl border border-blue-100 dark:border-border">
            <div className="grid grid-cols-12 bg-[#EAF5FF] px-5 py-4 text-sm font-medium text-slate-900 dark:bg-muted dark:text-foreground">
              <div className="col-span-4">Service</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-3">Payment</div>
              <div className="col-span-3">Balance</div>
            </div>

            <div className="divide-y divide-blue-100 dark:divide-border">
              <div className="grid grid-cols-12 items-center gap-3 px-5 py-4 text-sm text-slate-800 transition hover:bg-[#EAF5FF] dark:text-foreground dark:hover:bg-accent">
                <div className="col-span-4">
                  {appointment.appointment_reason || '-'}
                </div>

                <div className="col-span-2">Rs {money(amount1)}</div>

                <div className="col-span-3">
                  <input
                    type="number"
                    step="0.01"
                    value={data.payment_1}
                    onChange={(e) =>
                      setData('payment_1', e.target.value)
                    }
                    className="w-full rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:focus:ring-ring"
                  />

                  {errors.payment_1 && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.payment_1}
                    </p>
                  )}
                </div>

                <div className="col-span-3">Rs {money(balance1)}</div>
              </div>

              <div className="grid grid-cols-12 items-center gap-3 px-5 py-4 text-sm text-slate-800 transition hover:bg-[#EAF5FF] dark:text-foreground dark:hover:bg-accent">
                <div className="col-span-4">
                  {appointment.service_2 || '-'}
                </div>

                <div className="col-span-2">Rs {money(amount2)}</div>

                <div className="col-span-3">
                  <input
                    type="number"
                    step="0.01"
                    value={data.payment_2}
                    onChange={(e) =>
                      setData('payment_2', e.target.value)
                    }
                    className="w-full rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:focus:ring-ring"
                  />
                </div>

                <div className="col-span-3">Rs {money(balance2)}</div>
              </div>

              <div className="grid grid-cols-12 items-center gap-3 px-5 py-4 text-sm text-slate-800 transition hover:bg-[#EAF5FF] dark:text-foreground dark:hover:bg-accent">
                <div className="col-span-4">
                  {appointment.service_3 || '-'}
                </div>

                <div className="col-span-2">Rs {money(amount3)}</div>

                <div className="col-span-3">
                  <input
                    type="number"
                    step="0.01"
                    value={data.payment_3}
                    onChange={(e) =>
                      setData('payment_3', e.target.value)
                    }
                    className="w-full rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:focus:ring-ring"
                  />
                </div>

                <div className="col-span-3">Rs {money(balance3)}</div>
              </div>

              {/* Payment totals */}
              <div className="grid grid-cols-12 items-center gap-3 bg-[#EAF5FF] px-5 py-4 text-sm font-semibold text-slate-900 dark:bg-muted dark:text-foreground">
                <div className="col-span-4">Total</div>
                <div className="col-span-2">Rs {money(totalAmount)}</div>
                <div className="col-span-3">Rs {money(totalPayment)}</div>
                <div className="col-span-3">Rs {money(totalBalance)}</div>
              </div>
            </div>
          </div>

          {/* Submit action */}
          <button
            type="submit"
            disabled={processing}
            className="rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary dark:text-primary-foreground"
          >
            {processing ? 'Posting...' : 'Post Payment'}
          </button>
        </form>
      </div>
    </AppSidebarLayout>
  );
}