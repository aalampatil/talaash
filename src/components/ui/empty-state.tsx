import { ArrowUpRight, House } from "lucide-react";
import Link from "next/link";

export default function EmptyState({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="surface flex min-h-80 flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
        <House size={26} strokeWidth={1.3} />
      </div>
      <h2 className="font-display text-3xl tracking-tight">{title}</h2>
      <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
        {description}
      </p>
      {href && action && (
        <Link href={href} className="button-primary mt-6">
          {action}
          <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}
