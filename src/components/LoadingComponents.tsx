// components/LoadingComponents.tsx - Reusable Loading Components
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RefObject } from "react";

// ============================================
// 1. CIRCULAR LOADING SPINNER
// ============================================
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const LoadingSpinner = ({
  size = "md",
  className = "",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <Loader2
      className={`animate-spin text-primary ${sizeClasses[size]} ${className}`}
    />
  );
};

// ============================================
// 2. FULL PAGE LOADING
// ============================================
interface PageLoadingProps {
  message?: string;
}

export const PageLoading = ({ message = "Loading..." } : PageLoadingProps) => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/20 z-50">
    <LoadingSpinner size="xl" />
    <p className="text-muted-foreground text-lg font-medium mt-4">{message}</p>
  </div>
);

// ============================================
// 3. INLINE LOADING (for load more)
// ============================================
interface InlineLoadingProps {
  message?: string;
  className?: string;
}

export const InlineLoading = ({
  message = "Loading more...",
  className = "",
}: InlineLoadingProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-8 ${className}`}
    >
      <LoadingSpinner size="lg" />
      <p className="text-sm text-muted-foreground mt-3 font-medium">
        {message}
      </p>
    </div>
  );
};

// ============================================
// 4. SKELETON LOADER (for better UX)
// ============================================
export const SkeletonCard = () => {
  return (
    <div className="border rounded-lg p-6 space-y-4 animate-pulse bg-card">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-muted h-12 w-12"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded"></div>
        <div className="h-3 bg-muted rounded w-5/6"></div>
      </div>
    </div>
  );
};

interface SkeletonGridProps {
  count?: number;
  columns?: 1 | 2 | 3 | 4;
}

export const SkeletonGrid = ({ count = 6, columns = 2 }: SkeletonGridProps) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={`grid gap-6 ${gridCols[columns]}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

// ============================================
// 5. ERROR STATE
// ============================================
interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorState = ({
  message,
  onRetry,
  retryText = "Try Again",
}: ErrorStateProps) => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>
        <p className="text-destructive text-lg font-medium">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="lg">
            <RefreshCw className="size-4 mr-2" />
            {retryText}
          </Button>
        )}
      </div>
    </div>
  );
};

// ============================================
// 6. EMPTY STATE
// ============================================
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4 max-w-md">
        {icon && (
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        {description && <p className="text-muted-foreground">{description}</p>}
        {action && (
          <Button onClick={action.onClick} size="lg" className="mt-4">
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};

// ============================================
// 7. LOAD MORE TRIGGER (for infinite scroll)
// ============================================
interface LoadMoreTriggerProps {
  sentinelRef: RefObject<HTMLDivElement | null>; // ✅ CRITICAL FIX: Must include | null
  isVisible?: boolean;
}

export const LoadMoreTrigger = ({
  sentinelRef,
  isVisible = true,
}: LoadMoreTriggerProps) => {
  if (!isVisible) return null;

  return (
    <div
      ref={sentinelRef}
      className="h-20 flex items-center justify-center"
      aria-hidden="true"
    >
      {/* Invisible sentinel for IntersectionObserver */}
    </div>
  );
};

// ============================================
// 8. END OF LIST MESSAGE
// ============================================
interface EndOfListProps {
  totalCount: number;
  itemName?: string;
  className?: string;
}

export const EndOfList = ({
  totalCount,
  itemName = "items",
  className = "",
}: EndOfListProps) => {
  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="inline-flex items-center gap-2 px-6 py-3 bg-muted/50 rounded-full">
        <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
        <p className="text-muted-foreground font-medium">
          All {itemName} loaded ({totalCount})
        </p>
      </div>
    </div>
  );
};

// ============================================
// 9. LOADING OVERLAY (for actions)
// ============================================
interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay = ({
  message = "Processing...",
}: LoadingOverlayProps) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border rounded-lg p-8 shadow-lg text-center space-y-4">
        <LoadingSpinner size="xl" />
        <p className="text-foreground font-medium">{message}</p>
      </div>
    </div>
  );
};
