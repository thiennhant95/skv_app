import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-gray-200", className)}
      {...props}
    />
  );
}

export function SummarySkeleton() {
  return (
    <div className="mx-4 grid grid-cols-2 gap-3">
      <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-3.5 shadow-sm">
        <Skeleton className="h-6 w-6 rounded-lg" />
        <Skeleton className="mt-2 h-3 w-24" />
        <Skeleton className="mt-1 h-7 w-16" />
        <div className="mt-2 space-y-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-3.5 shadow-sm">
        <Skeleton className="h-6 w-6 rounded-lg" />
        <Skeleton className="mt-2 h-3 w-24" />
        <Skeleton className="mt-1 h-7 w-20" />
        <div className="mt-2 space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="mx-4">
      <Skeleton className="h-12 w-full rounded-2xl" />
    </div>
  );
}

export function UserCardSkeleton() {
  return (
    <div className="mx-4">
      <Skeleton className="h-14 w-full rounded-2xl" />
    </div>
  );
}

export function ActionCardSkeleton() {
  return (
    <div className="mx-4 grid grid-cols-2 gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-[60px] rounded-2xl" />
      ))}
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="mx-4 h-10 rounded-2xl" />
      <BannerSkeleton />
      <UserCardSkeleton />
      <SummarySkeleton />
      <ActionCardSkeleton />
    </div>
  );
}
