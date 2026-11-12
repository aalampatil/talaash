export default function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="dashboard-title">{title}</h1>
        {description && <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
