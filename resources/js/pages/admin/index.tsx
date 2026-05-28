import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type ChargeMaster = {
  id: number;
  service_code: string;
  service_name: string;
  amount: number | string | null;
  status: string;
};

export default function AdminIndex({
  users = [],
  chargeMasters = [],
}: {
  users: User[];
  chargeMasters: ChargeMaster[];
}) {
  const [activeTab, setActiveTab] = useState<'users' | 'chargeMaster'>('users');

  const buttonPrimary =
    'inline-flex items-center rounded-md bg-muted px-4 py-2 text-sm text-foreground transition hover:bg-accent';

  const buttonSecondary =
    'rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground transition hover:bg-accent';

  const formatCurrency = (amount: number | string | null | undefined) => {
    return `Rs ${Number(amount ?? 0).toFixed(2)}`;
  };

  return (
    <AppLayout>
      <Head title="Admin" />

      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6 text-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Admin Module
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage users and charge master records.
            </p>
          </div>

          {activeTab === 'users' && (
            <Link href="/admin/create" className={buttonPrimary}>
              Add User
            </Link>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`rounded-md px-4 py-2 text-sm transition ${
              activeTab === 'users'
                ? 'bg-muted text-foreground'
                : 'border border-border text-muted-foreground hover:bg-accent'
            }`}
          >
            User Management
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chargeMaster')}
            className={`rounded-md px-4 py-2 text-sm transition ${
              activeTab === 'chargeMaster'
                ? 'bg-muted text-foreground'
                : 'border border-border text-muted-foreground hover:bg-accent'
            }`}
          >
            Charge Master
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="overflow-hidden rounded-xl border border-border bg-background">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Role
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border transition last:border-b-0 hover:bg-accent"
                    >
                      <td className="px-6 py-4 text-foreground">
                        {user.name}
                      </td>

                      <td className="px-6 py-4 text-muted-foreground">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                            user.role === 'admin'
                              ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                              : user.role === 'receptionist'
                                ? 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/${user.id}/edit`}
                            className={buttonSecondary}
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => {
                              if (confirm(`Delete ${user.name}?`)) {
                                router.delete(`/admin/${user.id}`);
                              }
                            }}
                            className="rounded-md border border-red-500/30 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-500/10 dark:text-red-400"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-sm text-muted-foreground"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'chargeMaster' && (
          <div className="overflow-hidden rounded-xl border border-border bg-background">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Service Code
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Service Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {chargeMasters.length > 0 ? (
                  chargeMasters.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border transition last:border-b-0 hover:bg-accent"
                    >
                      <td className="px-6 py-4 text-foreground">
                        {item.service_code}
                      </td>

                      <td className="px-6 py-4 text-foreground">
                        {item.service_name}
                      </td>

                      <td className="px-6 py-4 text-muted-foreground">
                        {formatCurrency(item.amount)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                            item.status === 'Active'
                              ? 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400'
                              : 'border-gray-500/30 bg-gray-500/10 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-sm text-muted-foreground"
                    >
                      No charge master records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}