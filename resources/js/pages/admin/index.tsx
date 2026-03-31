import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

export default function AdminIndex({ users }: { users: User[] }) {
    return (
        <AppLayout>
            <Head title="Admin" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-white">User Management</h1>
                        <p className="text-sm text-neutral-400 mt-1">
                            Manage system users and assign roles.
                        </p>
                    </div>

                    <Link
                        href="/admin/create"
                        className="inline-flex items-center rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 transition"
                    >
                        Add User
                    </Link>
                </div>

                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-900">
                            <tr className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                                <th className="px-6 py-4 text-left font-semibold text-white">Name</th>
                                <th className="px-6 py-4 text-left font-semibold text-white">Email</th>
                                <th className="px-6 py-4 text-left font-semibold text-white">Role</th>
                                <th className="px-6 py-4 text-right font-semibold text-white">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-sidebar-border/50 dark:border-sidebar-border last:border-b-0"
                                    >
                                        <td className="px-6 py-4 text-white">{user.name}</td>
                                        <td className="px-6 py-4 text-neutral-300">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                                    user.role === 'admin'
                                                        ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                                                        : user.role === 'receptionist'
                                                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                                                        : 'bg-green-500/15 text-green-400 border border-green-500/20'
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/${user.id}/edit`}
                                                    className="rounded-lg border border-sidebar-border px-3 py-1.5 text-sm text-white hover:bg-neutral-800 transition"
                                                >
                                                    Edit
                                                </Link>

                                                <button onClick={() => {
                                                    if (confirm(`Delete ${user.name}?`)) {
                                                    router.delete(`/admin/${user.id}`);
                                                        }
                                                 }}
                                                className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-400 transition hover:bg-red-500/10"
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
                                        className="px-6 py-10 text-center text-sm text-neutral-400"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}