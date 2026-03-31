import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CreateInsurance() {

  const { data, setData, post, processing, errors } = useForm({
    insurance_name: '',
    insurance_address: '',
    phone: ''
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post('/insurance');
  }

  return (
    <AppSidebarLayout breadcrumbs={[
      { title: 'Insurances', href: '/insurance' },
      { title: 'Create Insurance', href: '/insurance/create' }
    ]}>
      <Head title="Create Insurance" />

      <div className="p-6 space-y-6">

        <div>
          <h1 className="text-2xl font-semibold">Create Insurance</h1>
          <p className="text-sm text-white/60">
            Add a new insurance provider.
          </p>
        </div>

        <form onSubmit={submit} className="max-w-3xl space-y-6">

          <div>
            <label className="text-sm text-white/70">Insurance Name</label>
            <input
              type="text"
              value={data.insurance_name}
              onChange={e => setData('insurance_name', e.target.value)}
              className="mt-2 w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-sm"
            />
            {errors.insurance_name && <p className="text-red-400 text-sm mt-1">{errors.insurance_name}</p>}
          </div>

          <div>
            <label className="text-sm text-white/70">Address</label>
            <input
              type="text"
              value={data.insurance_address}
              onChange={e => setData('insurance_address', e.target.value)}
              className="mt-2 w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Phone</label>
            <input
              type="text"
              value={data.phone}
              onChange={e => setData('phone', e.target.value)}
              className="mt-2 w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-sm"
            />
            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div className="flex gap-3">

            <button
              type="submit"
              disabled={processing}
              className="rounded-md bg-white/10 px-5 py-3 text-sm hover:bg-white/20"
            >
              {processing ? 'Saving...' : 'Create Insurance'}
            </button>

            <Link
              href="/insurance"
              className="rounded-md border border-white/10 px-5 py-3 text-sm hover:bg-white/5"
            >
              Cancel
            </Link>

          </div>

        </form>

      </div>
    </AppSidebarLayout>
  );
}