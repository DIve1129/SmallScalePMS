import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
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

type FlashMessages = {
    success?: string;
    error?: string;
};

type SharedPageProps = {
    flash?: FlashMessages;
};

/* Displays user management and charge master administration tables. */
export default function AdminIndex({
    users = [],
    chargeMasters = [],
}: {
    users: User[];
    chargeMasters: ChargeMaster[];
}) {
    const { flash } = usePage<SharedPageProps>().props;

    const [activeTab, setActiveTab] = useState<'users' | 'chargeMaster'>(
        'users',
    );

    const buttonPrimary =
        'inline-flex items-center rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90';

    const buttonSecondary =
        'rounded-lg border border-blue-100 bg-white px-3 py-1.5 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] hover:text-[#1D4ED8] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground';

    /* Formats charge master amounts for display. */
    const formatCurrency = (
        amount: number | string | null | undefined,
    ) => {
        return `Rs ${Number(amount ?? 0).toFixed(2)}`;
    };

    return (
        <AppLayout>
            <Head title="Admin" />

            <div className="min-h-full flex-1 bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
                <div className="space-y-6">
                    {/* Displays the page heading and current tab action. */}
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">
                                Admin Module
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                                Manage users and charge master records.
                            </p>
                        </div>

                        {activeTab === 'users' && (
                            <Link
                                href="/admin/create"
                                className={buttonPrimary}
                            >
                                Add User
                            </Link>
                        )}

                        {activeTab === 'chargeMaster' && (
                            <Link
                                href="/admin/charge-master/create"
                                className={buttonPrimary}
                            >
                                Add Charge
                            </Link>
                        )}
                    </div>

                    {/* Displays successful operation messages. */}
                    {flash?.success && (
                        <div
                            role="status"
                            className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 shadow-sm dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400"
                        >
                            {flash.success}
                        </div>
                    )}

                    {/* Displays unsuccessful operation messages. */}
                    {flash?.error && (
                        <div
                            role="alert"
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
                        >
                            {flash.error}
                        </div>
                    )}

                    {/* Displays the administration section tabs. */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setActiveTab('users')}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                activeTab === 'users'
                                    ? 'bg-[#CFE8FF] text-[#1D4ED8] dark:bg-primary dark:text-primary-foreground'
                                    : 'border border-blue-100 bg-white text-slate-600 hover:bg-[#EAF5FF] hover:text-[#2563EB] dark:border-border dark:bg-background dark:text-muted-foreground dark:hover:bg-accent dark:hover:text-accent-foreground'
                            }`}
                        >
                            User Management
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('chargeMaster')}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                activeTab === 'chargeMaster'
                                    ? 'bg-[#CFE8FF] text-[#1D4ED8] dark:bg-primary dark:text-primary-foreground'
                                    : 'border border-blue-100 bg-white text-slate-600 hover:bg-[#EAF5FF] hover:text-[#2563EB] dark:border-border dark:bg-background dark:text-muted-foreground dark:hover:bg-accent dark:hover:text-accent-foreground'
                            }`}
                        >
                            Charge Master
                        </button>
                    </div>

                    {/* Displays the user management table. */}
                    {activeTab === 'users' && (
                        <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-border dark:bg-card">
                            <table className="w-full text-sm">
                                <thead className="bg-blue-50/70 dark:bg-muted">
                                    <tr className="border-b border-blue-100 dark:border-border">
                                        <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-foreground">
                                            Name
                                        </th>

                                        <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-foreground">
                                            Email
                                        </th>

                                        <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-foreground">
                                            Role
                                        </th>

                                        <th className="px-6 py-4 text-right font-semibold text-slate-700 dark:text-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-blue-50 dark:divide-border">
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="transition hover:bg-blue-50/40 dark:hover:bg-accent/50"
                                            >
                                                <td className="px-6 py-4 font-medium text-slate-800 dark:text-foreground">
                                                    {user.name}
                                                </td>

                                                <td className="px-6 py-4 text-slate-500 dark:text-muted-foreground">
                                                    {user.email}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                                                            user.role ===
                                                            'admin'
                                                                ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                                                                : user.role ===
                                                                    'receptionist'
                                                                  ? 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                                  : user.role ===
                                                                      'doctor'
                                                                    ? 'border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400'
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
                                                            className={
                                                                buttonSecondary
                                                            }
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (
                                                                    window.confirm(
                                                                        `Delete ${user.name}?`,
                                                                    )
                                                                ) {
                                                                    router.delete(
                                                                        `/admin/${user.id}`,
                                                                        {
                                                                            preserveScroll:
                                                                                true,
                                                                        },
                                                                    );
                                                                }
                                                            }}
                                                            className="rounded-lg border border-red-500/30 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-500/10 dark:bg-background dark:text-red-400"
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
                                                className="px-6 py-10 text-center text-sm text-slate-500 dark:text-muted-foreground"
                                            >
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Displays the charge master table. */}
                    {activeTab === 'chargeMaster' && (
                        <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-border dark:bg-card">
                            <table className="w-full text-sm">
                                <thead className="bg-blue-50/70 dark:bg-muted">
                                    <tr className="border-b border-blue-100 dark:border-border">
                                        <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-foreground">
                                            Service Code
                                        </th>

                                        <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-foreground">
                                            Service Name
                                        </th>

                                        <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-foreground">
                                            Amount
                                        </th>

                                        <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-foreground">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-right font-semibold text-slate-700 dark:text-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-blue-50 dark:divide-border">
                                    {chargeMasters.length > 0 ? (
                                        chargeMasters.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="transition hover:bg-blue-50/40 dark:hover:bg-accent/50"
                                            >
                                                <td className="px-6 py-4 font-medium text-slate-800 dark:text-foreground">
                                                    {item.service_code}
                                                </td>

                                                <td className="px-6 py-4 text-slate-800 dark:text-foreground">
                                                    {item.service_name}
                                                </td>

                                                <td className="px-6 py-4 text-slate-500 dark:text-muted-foreground">
                                                    {formatCurrency(
                                                        item.amount,
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                                                            item.status ===
                                                            'Active'
                                                                ? 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400'
                                                                : 'border-slate-400/30 bg-slate-400/10 text-slate-600 dark:text-slate-400'
                                                        }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end">
                                                        <Link
                                                            href={`/admin/charge-master/${item.id}/edit`}
                                                            className={
                                                                buttonSecondary
                                                            }
                                                        >
                                                            Edit
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-10 text-center text-sm text-slate-500 dark:text-muted-foreground"
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
            </div>
        </AppLayout>
    );
}