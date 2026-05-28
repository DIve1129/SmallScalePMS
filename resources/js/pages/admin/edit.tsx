import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function EditUser({ user }: { user: User }) {
  const { data, setData, put, processing, errors } = useForm<{
    name: string;
    email: string;
    password: string;
    role: string;
  }>({
    name: user.name,
    email: user.email,
    password: '',
    role: user.role,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(`/admin/${user.id}`);
  }

  const inputClass =
    'w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring';

  const labelClass = 'mb-2 block text-sm font-medium text-foreground';

  const buttonPrimary =
    'rounded-md bg-muted px-5 py-3 text-sm text-foreground transition hover:bg-accent disabled:opacity-50';

  const buttonSecondary =
    'rounded-md border border-border bg-background px-5 py-3 text-sm text-foreground transition hover:bg-accent';

  return (
    <AppLayout>
      <Head title="Edit User" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6 overflow-x-auto text-foreground">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin" className="hover:text-foreground transition">
            Admin
          </Link>
          <span>&gt;</span>
          <span className="text-foreground">Edit User</span>
        </div>

        <div className="max-w-4xl">
          <h1 className="mb-8 text-2xl font-semibold text-foreground">
            Edit User
          </h1>

          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className={labelClass}>Name</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className={inputClass}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className={inputClass}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className={inputClass}
                placeholder="Leave blank to keep current password"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Role</label>
              <select
                value={data.role}
                onChange={(e) => setData('role', e.target.value)}
                className={inputClass}
              >
                <option value="admin">Admin</option>
                <option value="receptionist">Receptionist</option>
                <option value="billing">Billing</option>
                <option value="doctor">Doctor</option>
              </select>
              {errors.role && (
                <p className="mt-2 text-sm text-red-500">{errors.role}</p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={processing}
                className={buttonPrimary}
              >
                {processing ? 'Updating...' : 'Update User'}
              </button>

              <Link href="/admin" className={buttonSecondary}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}