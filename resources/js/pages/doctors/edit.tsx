import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Doctor = {
  doctor_id: number;
  doctor_code?: string | null;
  first_name: string;
  last_name: string;
  speciality?: string | null;
  slmc_number?: string | null;
  phone?: string | null;
  email?: string | null;
  status?: string | null;
};

export default function Edit({ doctor }: { doctor: Doctor }) {
  const { data, setData, put, processing, errors } = useForm({
    doctor_code: doctor.doctor_code ?? '',
    first_name: doctor.first_name ?? '',
    last_name: doctor.last_name ?? '',
    speciality: doctor.speciality ?? '',
    slmc_number: doctor.slmc_number ?? '',
    phone: doctor.phone ?? '',
    email: doctor.email ?? '',
    status: doctor.status ?? 'Active',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    put(`/doctors/${doctor.doctor_id}`);
  };

  return (
    <AppSidebarLayout breadcrumbs={[{ title: 'Doctors', href: '/doctors' }]}>
      <Head title="Edit Doctor" />

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">Edit Doctor</h1>

          <div className="flex gap-2">
            <Link
              href={`/doctors/${doctor.doctor_id}`}
              className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Cancel
            </Link>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-white">Doctor Code</label>
            <input
              type="text"
              value={data.doctor_code}
              onChange={(e) => setData('doctor_code', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-white outline-none"
            />
            {errors.doctor_code && <p className="mt-1 text-sm text-red-400">{errors.doctor_code}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">First Name</label>
            <input
              type="text"
              value={data.first_name}
              onChange={(e) => setData('first_name', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-white outline-none"
            />
            {errors.first_name && <p className="mt-1 text-sm text-red-400">{errors.first_name}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Last Name</label>
            <input
              type="text"
              value={data.last_name}
              onChange={(e) => setData('last_name', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-white outline-none"
            />
            {errors.last_name && <p className="mt-1 text-sm text-red-400">{errors.last_name}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Speciality</label>
            <input
              type="text"
              value={data.speciality}
              onChange={(e) => setData('speciality', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-white outline-none"
            />
            {errors.speciality && <p className="mt-1 text-sm text-red-400">{errors.speciality}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">SLMC Number</label>
            <input
              type="text"
              value={data.slmc_number}
              onChange={(e) => setData('slmc_number', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-white outline-none"
            />
            {errors.slmc_number && <p className="mt-1 text-sm text-red-400">{errors.slmc_number}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Phone</label>
            <input
              type="text"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-white outline-none"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-white outline-none"
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Status</label>
            <select
              value={data.status}
              onChange={(e) => setData('status', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-white outline-none"
            >
              <option value="Active" className="bg-black">Active</option>
              <option value="Inactive" className="bg-black">Inactive</option>
            </select>
            {errors.status && <p className="mt-1 text-sm text-red-400">{errors.status}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={processing}
              className="rounded-md bg-white/10 px-5 py-3 text-sm text-white hover:bg-white/20 disabled:opacity-50"
            >
              {processing ? 'Updating...' : 'Update Doctor'}
            </button>

            <Link
              href={`/doctors/${doctor.doctor_id}`}
              className="rounded-md border border-white/10 bg-white/5 px-5 py-3 text-sm text-white hover:bg-white/10"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AppSidebarLayout>
  );
}