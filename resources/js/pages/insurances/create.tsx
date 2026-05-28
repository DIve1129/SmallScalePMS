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
    'mt-2 w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring';

  const labelClass = 'text-sm font-medium text-foreground';

  const buttonPrimary =
    'rounded-md bg-muted px-5 py-3 text-sm text-foreground transition hover:bg-accent disabled:opacity-50';

  const buttonSecondary =
    'rounded-md border border-border bg-background px-5 py-3 text-sm text-foreground transition hover:bg-accent';

  return (
    <AppSidebarLayout
      breadcrumbs={[
        { title: 'Insurances', href: '/insurance' },
        { title: 'Create Insurance', href: '/insurance/create' },
      ]}
    >
      <Head title="Create Insurance" />

      <div className="p-6 space-y-6 text-foreground">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Create Insurance
          </h1>
          <p className="text-sm text-muted-foreground">
            Add a new insurance provider.
          </p>
        </div>

        <form onSubmit={submit} className="max-w-3xl space-y-6">
          <div>
            <label className={labelClass}>Insurance Name</label>
            <input
              type="text"
              value={data.insurance_name}
              onChange={(e) => setData('insurance_name', e.target.value)}
              className={inputClass}
            />
            {errors.insurance_name && (
              <p className="text-red-500 text-sm mt-1">
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
              <p className="text-red-500 text-sm mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="flex gap-3">
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
    </AppSidebarLayout>
  );
}