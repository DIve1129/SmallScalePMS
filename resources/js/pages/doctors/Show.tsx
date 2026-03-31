import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';

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

export default function Show({ doctor }: { doctor: Doctor }) {
  return (
    <AppSidebarLayout breadcrumbs={[{ title: 'Doctors', href: '/doctors' }]}>
      <Head title="Doctor Details" />

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">Doctor Details</h1>

          <div className="flex gap-2">
            <Link
              href="/doctors"
              className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Back
            </Link>

            <a
              href={`/doctors/${doctor.doctor_id}/edit`}
              className="rounded-md bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
            >
              Edit
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-white">Doctor Code</label>
            <div className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-white">
              {doctor.doctor_code ?? '-'}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">First Name</label>
            <div className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-white">
              {doctor.first_name || '-'}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Last Name</label>
            <div className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-white">
              {doctor.last_name || '-'}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Speciality</label>
            <div className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-white">
              {doctor.speciality || '-'}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">SLMC Number</label>
            <div className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-white">
              {doctor.slmc_number || '-'}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Phone</label>
            <div className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-white">
              {doctor.phone || '-'}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Email</label>
            <div className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-white">
              {doctor.email || '-'}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Status</label>
            <div className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-white">
              {doctor.status || 'Active'}
            </div>
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
}