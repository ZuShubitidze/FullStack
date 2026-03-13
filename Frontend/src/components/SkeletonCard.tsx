import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <Card className="w-full mt-20">
      <CardHeader>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardHeader>
    </Card>
  );
}
