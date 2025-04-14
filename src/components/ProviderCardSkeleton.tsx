import { Skeleton } from "./ui/skeleton";

export function ProviderCardSkeleton() {
  return (
    <div className="flex space-x-4 p-4">
      <Skeleton className="h-[100px] w-[100px] rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
