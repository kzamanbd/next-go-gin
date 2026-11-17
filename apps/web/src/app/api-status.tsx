"use client";

import { useEffect, useState } from "react";

type Health = { status: string; service: string; time: string };

export function ApiStatus() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Health>;
      })
      .then(setHealth)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return <p className="text-red-600">Backend unreachable: {error}</p>;
  }
  if (!health) {
    return <p className="text-zinc-500">Checking backend…</p>;
  }
  return (
    <p className="text-green-600">
      {health.service}: {health.status} ({health.time})
    </p>
  );
}
