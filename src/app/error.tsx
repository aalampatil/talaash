"use client";


export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p>Please try loading this page again.</p>
      <button onClick={reset} className="rounded bg-black px-4 py-2 text-white">Try again</button>
    </div>
  );
}

