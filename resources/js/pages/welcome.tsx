import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;

  return (
    <>
      <Head title="Welcome" />

      <div className="min-h-screen bg-white text-slate-900">
        <header className="absolute right-8 top-6 z-20">
          <nav className="flex items-center gap-4 text-sm">
            {auth.user ? (
              <Link href={route('dashboard')} className="font-medium">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href={route('login')} className="font-medium">
                  Log in
                </Link>

                <Link
                  href={route('register')}
                  className="rounded-md border border-slate-300 px-5 py-2 font-medium shadow-sm hover:bg-slate-50"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </header>

        <main className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-end pr-20">
             <img
                src="/Welcome.png"
                alt="Clinic management system"
                className="w-[48%] max-w-[760px] rounded-2xl object-contain shadow-xl"
            />
            </div>                                                                                          

          <section className="relative z-10 flex min-h-screen items-center pl-20 lg:pl-40 pr-10">
            <div className="max-w-xl ml-20 lg:ml-40">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest">
                Welcome!
              </p>

              <h1 className="mb-6 text-4xl font-extrabold uppercase leading-tight tracking-tight text-slate-950 lg:text-5xl">
                Streamline your practice, enhance patient care.
              </h1>

              <p className="mb-8 text-lg text-slate-700">
                The modern, integrated Practice Management System for
                scheduling, records, billing, and patient engagement.
              </p>


            </div>
          </section>
        </main>
      </div>
    </>
  );
}