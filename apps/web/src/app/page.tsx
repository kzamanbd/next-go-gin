import { ApiStatus } from "./api-status";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-6 px-6 py-24">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Next.js + Go (Gin)
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Frontend in <code className="font-mono">apps/web/</code>, API in{" "}
          <code className="font-mono">apps/api/</code>. Requests to{" "}
          <code className="font-mono">/api/*</code> are proxied to the Gin server.
        </p>
        <ApiStatus />
      </main>
    </div>
  );
}
