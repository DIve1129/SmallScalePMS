import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

/* Displays the user creation form and submits a new account. */
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

    /* Submits the new user information to the server. */
    function submit(event: React.FormEvent) {
        event.preventDefault();
        post('/admin');
    }

    const inputClass =
        'w-full rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:focus:border-ring dark:focus:ring-ring/30';

    const labelClass =
        'mb-2 block text-sm font-medium text-slate-700 dark:text-foreground';

    const buttonPrimary =
        'rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90';

    const buttonSecondary =
        'rounded-lg border border-blue-100 bg-white px-5 py-3 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] hover:text-[#1D4ED8] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground';

    return (
        <AppLayout>
            <Head title="Create User" />

            <div className="min-h-full flex-1 bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
                <div className="mx-auto w-full max-w-3xl space-y-6">
                    {/* Displays the page breadcrumb. */}
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-muted-foreground">
                        <Link
                            href="/admin"
                            className="transition hover:text-[#2563EB] dark:hover:text-foreground"
                        >
                            Admin
                        </Link>

                        <span>&gt;</span>

                        <span className="text-slate-800 dark:text-foreground">
                            Create User
                        </span>
                    </div>

                    {/* Displays the page heading. */}
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">
                            Create User
                        </h1>

                        <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                            Enter the account details and assign a user role.
                        </p>
                    </div>

                    {/* Displays the new user form. */}
                    <form
                        onSubmit={submit}
                        className="space-y-6 rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card"
                    >
                        <div>
                            <label className={labelClass}>Name</label>

                            <input
                                type="text"
                                value={data.name}
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                                className={inputClass}
                                placeholder="Enter full name"
                            />

                            {errors.name && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>Email</label>

                            <input
                                type="email"
                                value={data.email}
                                onChange={(event) =>
                                    setData('email', event.target.value)
                                }
                                className={inputClass}
                                placeholder="Enter email address"
                            />

                            {errors.email && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>Password</label>

                            <input
                                type="password"
                                value={data.password}
                                onChange={(event) =>
                                    setData('password', event.target.value)
                                }
                                className={inputClass}
                                placeholder="Enter password"
                            />

                            {errors.password && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>Role</label>

                            <select
                                value={data.role}
                                onChange={(event) =>
                                    setData('role', event.target.value)
                                }
                                className={inputClass}
                            >
                                <option value="admin">Admin</option>
                                <option value="receptionist">Receptionist</option>
                                <option value="billing">Billing</option>
                                <option value="doctor">Doctor</option>
                            </select>

                            {errors.role && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.role}
                                </p>
                            )}
                        </div>

                        {/* Displays the form actions. */}
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className={buttonPrimary}
                            >
                                {processing
                                    ? 'Creating...'
                                    : 'Create User'}
                            </button>

                            <Link
                                href="/admin"
                                className={buttonSecondary}
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