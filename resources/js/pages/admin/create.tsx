import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function CreateUser() {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        email: string;
        password: string;
        role: string;
    }>({
        name: '',
        email: '',
        password: '',
        role: 'receptionist',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin');
    }

    return (
        <AppLayout>
            <Head title="Create User" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <Link href="/admin" className="hover:text-white transition">
                        Admin
                    </Link>
                    <span>&gt;</span>
                    <span className="text-white">Create User</span>
                </div>

                <div className="max-w-4xl">
                    <h1 className="text-3xl font-semibold text-white mb-8">Create User</h1>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">
                                Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-lg border border-sidebar-border bg-transparent px-4 py-3 text-white outline-none transition focus:border-neutral-500"
                                placeholder="Enter full name"
                            />
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-lg border border-sidebar-border bg-transparent px-4 py-3 text-white outline-none transition focus:border-neutral-500"
                                placeholder="Enter email address"
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">
                                Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full rounded-lg border border-sidebar-border bg-transparent px-4 py-3 text-white outline-none transition focus:border-neutral-500"
                                placeholder="Enter password"
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-400">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">
                                Role
                            </label>
                            <select
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className="w-full rounded-lg border border-sidebar-border bg-transparent px-4 py-3 text-white outline-none transition focus:border-neutral-500"
                            >
                                <option value="admin" className="bg-black text-white">
                                    Admin
                                </option>
                                <option value="receptionist" className="bg-black text-white">
                                    Receptionist
                                </option>
                                <option value="billing" className="bg-black text-white">
                                    Billing
                                </option>
                            </select>
                            {errors.role && (
                                <p className="mt-2 text-sm text-red-400">{errors.role}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-neutral-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create User'}
                            </button>

                            <Link
                                href="/admin"
                                className="rounded-lg border border-sidebar-border px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-900"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}