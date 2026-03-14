import { useRouteError, Link } from "react-router";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { AlertCircle } from "lucide-react";

export function ErrorBoundary() {
  const error = useRouteError() as Error;

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 rounded-xl border border-border text-center space-y-4">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">
          {error?.message || "An unexpected error occurred"}
        </p>
        <Link to="/">
          <Button className="rounded-lg">Go to Home</Button>
        </Link>
      </Card>
    </div>
  );
}
