import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, useForm, Link } from '@inertiajs/react';


export default function CreateDoctor() {

const { data, setData, post, processing, errors } = useForm({
  doctor_code: '',
  first_name: '',
  last_name: '',
  speciality: '',
  slmc_number: '',
  phone: '',
  email: '',
  status: 'Active',
});


  function submit(e: React.FormEvent) {
    e.preventDefault();

    post('/doctors'); // this route will be handled by DoctorsController@store
  }

  return (
    <AppSidebarLayout
      breadcrumbs={[
        { title: 'Doctors', href: '/doctors' },
        { title: 'Add Doctor', href: '/doctors/create' },
      ]}
    >
      <Head title="Add Doctor" />

      <div className="p-6 max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold">Add New Doctor</h1>

      
        <form onSubmit={submit} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm text-white">Doctor Code</label>
            <input
              type="text"
              value={data.doctor_code}
              onChange={(e) => setData('doctor_code', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-white outline-none"
              placeholder="Enter doctor code"
            />
            {errors.doctor_code && (
              <p className="mt-1 text-sm text-red-400">{errors.doctor_code}</p>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">First Name</label>
            <input
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-2"
              value={data.first_name}
              onChange={(e) => setData('first_name', e.target.value)}
            />
            {errors.first_name && (
              <div className="text-red-500 text-sm">{errors.first_name}</div>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Last Name</label>
            <input
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-2"
              value={data.last_name}
              onChange={(e) => setData('last_name', e.target.value)}
            />
            {errors.last_name && (
              <div className="text-red-500 text-sm">{errors.last_name}</div>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Speciality</label>
            <input
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-2"
              value={data.speciality}
              onChange={(e) => setData('speciality', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">SLMC Number</label>
            <input
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-2"
              value={data.slmc_number}
              onChange={(e) => setData('slmc_number', e.target.value)}
            />
            {errors.slmc_number && (
              <div className="text-red-500 text-sm">{errors.slmc_number}</div>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-2"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-2"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-2"
              value={data.status}
              onChange={(e) => setData('status', e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={processing}
              className="rounded-md bg-white/10 px-6 py-2 hover:bg-white/20"
            >
              {processing ? 'Saving...' : 'Save Doctor'}
            </button>

            <Link
              href="/doctors"
              className="rounded-md border border-white/10 px-6 py-2 hover:bg-white/5"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AppSidebarLayout>
  );
}
