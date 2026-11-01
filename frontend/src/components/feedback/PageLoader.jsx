export default function PageLoader() {
  return (
    <div role="status" className="flex min-h-[60vh] items-center justify-center">
      <div aria-hidden="true" className="h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

