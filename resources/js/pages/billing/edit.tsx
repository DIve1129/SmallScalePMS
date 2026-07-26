import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

type Appointment = {
  appointment_id: number;
  appointment_reason?: string | null;
  service_2?: string | null;
  service_3?: string | null;
  amount_1?: number | string | null;
  amount_2?: number | string | null;
  amount_3?: number | string | null;
  responsibility?: string | null;
  claim_status?: string | null;
  status?: string | null;
};

type ChargeMaster = {
  billing_id: number;
  service_name: string;
  amount: number | string;
};

export default function BillingEdit({
  appointment,
  chargeMasters,
}: {
  appointment: Appointment;
  chargeMasters: ChargeMaster[];
}) {
  const getAmountForService = (serviceName?: string | null) => {
    const selected = chargeMasters.find(
      (c) => c.service_name === serviceName,
    );

    return selected ? String(selected.amount) : '';
  };

  const { data, setData, put, processing, errors } = useForm({
    appointment_reason: appointment.appointment_reason ?? '',
    service_2: appointment.service_2 ?? '',
    service_3: appointment.service_3 ?? '',

    amount_1:
      Number(appointment.amount_1 ?? 0) > 0
        ? String(appointment.amount_1)
        : getAmountForService(appointment.appointment_reason),

    amount_2:
      Number(appointment.amount_2 ?? 0) > 0
        ? String(appointment.amount_2)
        : getAmountForService(appointment.service_2),

    amount_3:
      Number(appointment.amount_3 ?? 0) > 0
        ? String(appointment.amount_3)
        : getAmountForService(appointment.service_3),

    responsibility: appointment.responsibility ?? 'Patient',
    claim_status: appointment.claim_status ?? 'Pending',
    status: appointment.status ?? 'Ongoing',
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    put(`/billing/${appointment.appointment_id}`);
  }

  function handleServiceChange(
    serviceField: 'appointment_reason' | 'service_2' | 'service_3',
    amountField: 'amount_1' | 'amount_2' | 'amount_3',
    value: string,
  ) {
    const selected = chargeMasters.find(
      (c) => c.service_name === value,
    );

    setData((current) => ({
      ...current,
      [serviceField]: value,
      [amountField]: selected ? String(selected.amount) : '',
    }));
  }

  const totalAmount =
    Number(data.amount_1 || 0) +
    Number(data.amount_2 || 0) +
    Number(data.amount_3 || 0);

  const inputClass =
    'w-full rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:focus:ring-ring';

  const labelClass =
    'mb-2 block text-sm font-medium text-slate-800 dark:text-foreground';

  const selectClass =
    'w-full rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:focus:ring-ring';

  const errorClass = 'mt-1 text-sm text-red-500';

  return (
    <AppSidebarLayout
      breadcrumbs={[
        { title: 'Billing', href: '/billing' },
        { title: 'Edit Visit', href: '#' },
      ]}
    >
      <Head title="Edit Billing Visit" />

      <div className="space-y-6 bg-[#F8FAFC] p-6 dark:bg-background">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">
            Edit Billing Visit
          </h1>

          <p className="text-sm text-slate-500 dark:text-muted-foreground">
            Update selected services and billing amounts.
          </p>
        </div>

        {/* Billing form */}
        <form
          onSubmit={submit}
          className="space-y-8 rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card"
        >
          {/* Services and amounts */}
          <div className="overflow-x-auto rounded-xl border border-blue-100 dark:border-border">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-[#EAF5FF] dark:bg-muted">
                <tr>
                  <th className="border border-blue-100 px-4 py-3 text-left font-semibold text-slate-900 dark:border-border dark:text-foreground">
                    Service
                  </th>

                  <th className="border border-blue-100 px-4 py-3 text-left font-semibold text-slate-900 dark:border-border dark:text-foreground">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="transition hover:bg-blue-50/50 dark:hover:bg-accent">
                  <td className="border border-blue-100 px-4 py-3 dark:border-border">
                    <select
                      value={data.appointment_reason}
                      onChange={(e) =>
                        handleServiceChange(
                          'appointment_reason',
                          'amount_1',
                          e.target.value,
                        )
                      }
                      className={selectClass}
                    >
                      <option value="">Select service...</option>

                      {chargeMasters.map((c) => (
                        <option key={c.billing_id} value={c.service_name}>
                          {c.service_name} - Rs{' '}
                          {Number(c.amount ?? 0).toFixed(2)}
                        </option>
                      ))}
                    </select>

                    {errors.appointment_reason && (
                      <p className={errorClass}>
                        {errors.appointment_reason}
                      </p>
                    )}
                  </td>

                  <td className="border border-blue-100 px-4 py-3 dark:border-border">
                    <input
                      type="number"
                      step="0.01"
                      value={data.amount_1}
                      onChange={(e) =>
                        setData('amount_1', e.target.value)
                      }
                      className={inputClass}
                    />

                    {errors.amount_1 && (
                      <p className={errorClass}>{errors.amount_1}</p>
                    )}
                  </td>
                </tr>

                <tr className="transition hover:bg-blue-50/50 dark:hover:bg-accent">
                  <td className="border border-blue-100 px-4 py-3 dark:border-border">
                    <select
                      value={data.service_2}
                      onChange={(e) =>
                        handleServiceChange(
                          'service_2',
                          'amount_2',
                          e.target.value,
                        )
                      }
                      className={selectClass}
                    >
                      <option value="">
                        Select additional service...
                      </option>

                      {chargeMasters.map((c) => (
                        <option key={c.billing_id} value={c.service_name}>
                          {c.service_name} - Rs{' '}
                          {Number(c.amount ?? 0).toFixed(2)}
                        </option>
                      ))}
                    </select>

                    {errors.service_2 && (
                      <p className={errorClass}>{errors.service_2}</p>
                    )}
                  </td>

                  <td className="border border-blue-100 px-4 py-3 dark:border-border">
                    <input
                      type="number"
                      step="0.01"
                      value={data.amount_2}
                      onChange={(e) =>
                        setData('amount_2', e.target.value)
                      }
                      className={inputClass}
                    />

                    {errors.amount_2 && (
                      <p className={errorClass}>{errors.amount_2}</p>
                    )}
                  </td>
                </tr>

                <tr className="transition hover:bg-blue-50/50 dark:hover:bg-accent">
                  <td className="border border-blue-100 px-4 py-3 dark:border-border">
                    <select
                      value={data.service_3}
                      onChange={(e) =>
                        handleServiceChange(
                          'service_3',
                          'amount_3',
                          e.target.value,
                        )
                      }
                      className={selectClass}
                    >
                      <option value="">
                        Select additional service...
                      </option>

                      {chargeMasters.map((c) => (
                        <option key={c.billing_id} value={c.service_name}>
                          {c.service_name} - Rs{' '}
                          {Number(c.amount ?? 0).toFixed(2)}
                        </option>
                      ))}
                    </select>

                    {errors.service_3 && (
                      <p className={errorClass}>{errors.service_3}</p>
                    )}
                  </td>

                  <td className="border border-blue-100 px-4 py-3 dark:border-border">
                    <input
                      type="number"
                      step="0.01"
                      value={data.amount_3}
                      onChange={(e) =>
                        setData('amount_3', e.target.value)
                      }
                      className={inputClass}
                    />

                    {errors.amount_3 && (
                      <p className={errorClass}>{errors.amount_3}</p>
                    )}
                  </td>
                </tr>
              </tbody>

              <tfoot className="bg-[#EAF5FF] font-semibold text-slate-900 dark:bg-muted dark:text-foreground">
                <tr>
                  <td className="border border-blue-100 px-4 py-3 dark:border-border">
                    Total
                  </td>

                  <td className="border border-blue-100 px-4 py-3 dark:border-border">
                    Rs {totalAmount.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Billing details */}
          <div className="grid gap-6 md:max-w-xl">
            <div>
              <label className={labelClass}>Responsibility</label>

              <select
                value={data.responsibility}
                onChange={(e) =>
                  setData('responsibility', e.target.value)
                }
                className={selectClass}
              >
                <option value="Patient">Patient</option>
                <option value="Insurance">Insurance</option>
              </select>

              {errors.responsibility && (
                <p className={errorClass}>{errors.responsibility}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Claim Status</label>

              <select
                value={data.claim_status}
                onChange={(e) =>
                  setData('claim_status', e.target.value)
                }
                className={selectClass}
              >
                <option value="Pending">Pending</option>
                <option value="Ready to Bill">Ready to Bill</option>
                <option value="Billed">Billed</option>
              </select>

              {errors.claim_status && (
                <p className={errorClass}>{errors.claim_status}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Appointment Status</label>

              <select
                value={data.status}
                onChange={(e) => setData('status', e.target.value)}
                className={selectClass}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="No-show">No-show</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {errors.status && (
                <p className={errorClass}>{errors.status}</p>
              )}
            </div>
          </div>

          {/* Form action */}
          <div>
            <button
              type="submit"
              disabled={processing}
              className="rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary dark:text-primary-foreground"
            >
              {processing ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </AppSidebarLayout>
  );
}