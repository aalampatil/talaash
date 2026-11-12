import Link from "next/link";

export default function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Talaash home"
      className={`inline-flex shrink-0 items-center gap-2.5 ${light ? "text-[#f9f7ed]" : "text-primary"}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 32 36"
        fill="none"
        className="h-9 w-8"
      >
        <path
          d="M4 32V13L16 4l12 9v19H4Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M11 32V20a5 5 0 0 1 10 0v12M1 15 16 3l15 12"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M16 9v4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-display text-[32px] tracking-[-0.065em]">
        talaash<span className="text-[#a6533b]">.</span>
      </span>
    </Link>
  );
}
