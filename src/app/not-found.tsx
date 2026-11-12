import Brand from "@/components/ui/brand";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <Brand />
      <p className="eyebrow mt-14">A little off the beaten path</p>
      <p
        aria-hidden="true"
        className="mt-5 font-display text-9xl text-[#cbd4c1]"
      >
        404
      </p>
      <h1 className="display-title mt-3 text-4xl sm:text-5xl">
        Let’s find your way home.
      </h1>
      <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
        This page has moved, or perhaps it was never here. There’s still a good
        place waiting for you.
      </p>
      <Link href="/" className="button-primary mt-8">
        Back to Talaash <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}
