// FILE: src/components/states/EmptyState.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string; }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
