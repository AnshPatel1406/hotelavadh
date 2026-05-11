export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-16 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-xl shadow-slate-200/50 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="max-w-4xl">
          <p className="mb-4 inline-flex rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
            Hotel Avadh
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Modern hotel booking made simple.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Manage rooms, users, bookings, and payments with a clean Next.js backend architecture built for future expansion.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/90">
          <h2 className="text-2xl font-semibold">API-ready booking models</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            The app includes models for rooms, users, bookings, and payments, plus reusable database connection helpers for MongoDB.
          </p>
          <ul className="mt-6 space-y-3 text-slate-700 dark:text-slate-200">
            <li>• Room inventory with availability tracking</li>
            <li>• User profiles and unique contact validation</li>
            <li>• Booking lifecycle with room availability update</li>
            <li>• Payment records linked to bookings</li>
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/90">
          <h2 className="text-2xl font-semibold">Ready-to-use API routes</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Create and fetch resources directly from REST endpoints under <code className="rounded bg-slate-100 px-2 py-1 text-sm dark:bg-slate-800">/api/*</code>.
          </p>
          <div className="mt-6 space-y-3 text-slate-700 dark:text-slate-200">
            <p>• <code className="rounded bg-slate-100 px-2 py-1 text-sm dark:bg-slate-800">/api/rooms</code></p>
            <p>• <code className="rounded bg-slate-100 px-2 py-1 text-sm dark:bg-slate-800">/api/users</code></p>
            <p>• <code className="rounded bg-slate-100 px-2 py-1 text-sm dark:bg-slate-800">/api/bookings</code></p>
            <p>• <code className="rounded bg-slate-100 px-2 py-1 text-sm dark:bg-slate-800">/api/payments</code></p>
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/90">
        <h2 className="text-2xl font-semibold">Get started</h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Add your MongoDB connection string to <code className="rounded bg-slate-100 px-2 py-1 text-sm dark:bg-slate-800">.env.local</code>, then run the app locally and begin seeding rooms, users, bookings, and payments.
        </p>
      </section>
    </main>
  );
}
