"use client";

import PageLoader from "@/components/feedback/PageLoader";
import { RefreshCw } from "lucide-react";

export default function ResourceState({
  loading,
  error,
  retry,
  children,
}: {
  loading: boolean;
  error: string;
  retry: () => void;
  children: React.ReactNode;
}) {
  if (loading) return <PageLoader />;
  if (error)
    return (
      <div role="alert" className="dashboard-page">
        <div className="surface p-10 text-center">
          <h1 className="display-title text-3xl">
            A small pause, then we’re back.
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">{error}</p>
          <button onClick={retry} className="button-primary mt-6">
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      </div>
    );
  return children;
}
