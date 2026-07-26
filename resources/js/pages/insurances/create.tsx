import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CreateInsurance() {
  const { data, setData, post, processing, errors } = useForm({
    insurance_name: '',
    insurance_address: '',
    phone: '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post('/insurance');
  }

  const inputClass =
    'mt-2 w-full rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:focus:ring-ring';

  const labelClass =
    'text-sm font-medium text-slate-700 dark:text-foreground';

  const buttonPrimary =
    'rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary dark:text-primary-foreground';

  const buttonSecondary =
    'rounded-lg border border-blue-100 bg-white px-5 py-3 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent';

  return (
    <AppSidebarLayout
      breadcrumbs={[
        { title: 'Insurances', href: '/insurance' },
        { title: 'Create Insurance', href: '/insurance/create' },
      ]}
    >
      <Head title="Create Insurance" />

      <div className="min-h-full bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">
              Create Insurance
            </h1>

            <p className="text-sm text-slate-500 dark:text-muted-foreground">
              Add a new insurance provider.
            </p>
          </div>

          <form
            onSubmit={submit}
            className="space-y-6 rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card"
          >
            <div>
              <label className={labelClass}>Insurance Name</label>

              <input
                type="text"
                value={data.insurance_name}
                onChange={(e) => setData('insurance_name', e.target.value)}
                className={inputClass}
              />

              {errors.insurance_name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.insurance_name}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Address</label>

              <input
                type="text"
                value={data.insurance_address}
                onChange={(e) => setData('insurance_address', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Phone</label>

              <input
                type="text"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                className={inputClass}
              />

              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={processing}
                className={buttonPrimary}
              >
                {processing ? 'Saving...' : 'Create Insurance'}
              </button>

              <Link href="/insurance" className={buttonSecondary}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AppSidebarLayout>
  );
}