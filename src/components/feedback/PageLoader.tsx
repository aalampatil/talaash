export default function PageLoader() {
  return (
    <div
      role="status"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-5"
    >
      <div
        aria-hidden="true"
        className="size-10 animate-spin rounded-full border-2 border-[#dce3d3] border-t-primary"
      />
      <p className="text-xs tracking-wide text-muted-foreground">
        Making a little room…
      </p>
      <span className="sr-only">Loading</span>
    </div>
  );
}
