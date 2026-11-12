"use client";
import { RefreshCw } from "lucide-react";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div
      role="alert"
      className="flex min-h-[65vh] flex-col items-center justify-center px-6 py-16 text-center"
    >
      <p className="eyebrow">A moment to pause</p>
      <h1 className="display-title mt-4 text-4xl sm:text-5xl">
        A small bump along the way.
      </h1>
      <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
        We couldn’t load this page. Give it another try, and we’ll help you get
        back to your search.
      </p>
      <button onClick={reset} className="button-primary mt-7">
        <RefreshCw size={15} />
        Try again
      </button>
    </div>
  );
}
