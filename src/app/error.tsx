"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <div className="flex flex-col gap-[3px] rounded-md bg-surface-dark p-2 shadow-inner mb-6">
        <span className="h-3 w-3 rounded-full bg-traffic-red" />
        <span className="h-3 w-3 rounded-full bg-traffic-amber" />
        <span className="h-3 w-3 rounded-full bg-traffic-green" />
      </div>
      <h1 className="display text-3xl font-bold">Something went wrong</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        An unexpected error occurred. Please try again or contact support if the problem persists.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex h-10 items-center justify-center rounded-full bg-traffic-green px-6 text-sm font-medium text-white transition-all hover:bg-traffic-green/90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-medium transition-all hover:bg-secondary"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
