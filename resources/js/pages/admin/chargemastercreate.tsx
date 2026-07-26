import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function CreateChargeMaster() {
  const { data, setData, post, processing, errors } = useForm({
    service_code: '',
    service_name: '',
    amount: '',
    status: 'Active',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    post('/admin/charge-master', {
      preserveScroll: true,
    });
  };

  const inputClass =
    'mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary';

  const labelClass = 'text-sm font-medium text-foreground';

  return (
    <AppLayout>
      <Head title="Add Charge Master" />

      <div className="flex h-full flex-1 flex-col p-6 text-foreground">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">
              Add Charge Master
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Add a new service and its charge amount.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border border-border bg-background p-6"
          >
            <div>
              <label htmlFor="service_code" className={labelClass}>
                Service Code
              </label>

              <input
                id="service_code"
                type="text"
                value={data.service_code}
                onChange={(event) =>
                  setData('service_code', event.target.value)
                }
                className={inputClass}
                required
              />

              {errors.service_code && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.service_code}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="service_name" className={labelClass}>
                Service Name
              </label>

              <input
                id="service_name"
                type="text"
                value={data.service_name}
                onChange={(event) =>
                  setData('service_name', event.target.value)
                }
                className={inputClass}
                required
              />

              {errors.service_name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.service_name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="amount" className={labelClass}>
                Amount
              </label>

              <input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={data.amount}
                onChange={(event) =>
                  setData('amount', event.target.value)
                }
                className={inputClass}
                required
              />

              {errors.amount && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.amount}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="status" className={labelClass}>
                Status
              </label>

              <select
                id="status"
                value={data.status}
                onChange={(event) =>
                  setData('status', event.target.value)
                }
                className={inputClass}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {errors.status && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.status}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-border pt-6">
              <Link
                href="/admin"
                className="rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground transition hover:bg-accent"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={processing}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processing ? 'Saving...' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}