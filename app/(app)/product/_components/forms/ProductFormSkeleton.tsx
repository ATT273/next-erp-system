import { Card, Skeleton } from "@heroui/react";

const FieldSkeleton = ({ width = "w-full" }: { width?: string }) => (
  <div className="flex flex-col gap-1">
    <Skeleton className="h-4 w-24 rounded" />
    <Skeleton className={`h-9 ${width} rounded-lg`} />
  </div>
);

const ProductFormSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-3 px-4 pt-4 overflow-y-auto w-full">
      {/* Basic Information */}
      <Card className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-700" variant="transparent">
        <Skeleton className="h-6 w-40 rounded mb-3" />
        <div className="flex flex-col gap-3">
          <FieldSkeleton />
          <div className="flex w-full gap-2">
            <FieldSkeleton width="flex-1" />
            <FieldSkeleton width="flex-1" />
          </div>
          <FieldSkeleton />
          <FieldSkeleton />
        </div>
      </Card>

      {/* Pricing */}
      <Card className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-700" variant="transparent">
        <Skeleton className="h-6 w-24 rounded mb-3" />
        <div className="flex flex-col gap-3">
          <FieldSkeleton />
          <FieldSkeleton />
        </div>
      </Card>

      {/* Attributes */}
      <Card className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-700" variant="transparent">
        <Skeleton className="h-6 w-32 rounded mb-3" />
        <div className="flex flex-col gap-3">
          <FieldSkeleton />
          <FieldSkeleton />
        </div>
      </Card>

      {/* Extra / Images */}
      <Card className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-700" variant="transparent">
        <Skeleton className="h-6 w-28 rounded mb-3" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-24 rounded-lg" />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProductFormSkeleton;
