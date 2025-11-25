// FILE: src/components/states/ErrorState.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void; }) {
  return (
    <div className="container mx-auto p-6">
      <Card className="border-destructive bg-destructive/10">
        <CardContent className="pt-6 text-center">
          <p className="text-destructive-foreground mb-4">{message}</p>
          <Button onClick={onRetry} variant="destructive">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}