import PageCard from "@/app/ui/dashboard/page-card";

export default function Loading() {
  return (
    <PageCard>
      <div role="status">
        <span className="sr-only">Loading…</span>
        <div aria-hidden="true" className="animate-pulse space-y-6 motion-reduce:animate-none">
          <div className="h-8 w-48 rounded-md bg-gray-200" />
          <div className="h-24 rounded-xl bg-gray-100" />
          <div className="h-24 rounded-xl bg-gray-100" />
          <div className="h-40 rounded-xl bg-gray-100" />
        </div>
      </div>
    </PageCard>
  );
}
