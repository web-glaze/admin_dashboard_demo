// hooks/useInfiniteScroll.ts - Reusable Infinite Scroll Hook
import { useEffect, useRef, useCallback, RefObject } from "react";

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  threshold?: number;
  enabled?: boolean;
}

interface UseInfiniteScrollReturn {
  sentinelRef: RefObject<HTMLDivElement | null>; 
}

export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = "200px",
  threshold = 0.1,
  enabled = true,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn => {
  
  const sentinelRef = useRef<HTMLDivElement | null>(null); // ✅ Fixed: Explicit null type
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting && hasMore && !isLoading && enabled) {
        console.log("📍 Infinite scroll triggered - loading more...");
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore, enabled]
  );

  useEffect(() => {
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Don't create observer if disabled
    if (!enabled) return;

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin,
      threshold,
    };

    observerRef.current = new IntersectionObserver(handleObserver, options);

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, rootMargin, threshold, enabled]);

  return { sentinelRef };
};
