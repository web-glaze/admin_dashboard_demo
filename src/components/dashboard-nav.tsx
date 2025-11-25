"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useSidebar } from "@/hooks/useSidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import type { NavItemWithOptionalChildren } from "@/types/navItem";
import useAuthStore from "@/store/useAuthStore";
import { ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import LogoutConfirmationModal from "@/components/logout/LogoutConfirmationModal";
import { useRouter } from "next/navigation";
import { removeUserToken } from "@/helpers";

interface DashboardNavProps {
  items: NavItemWithOptionalChildren[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false,
}: DashboardNavProps) {
  const [isMounted, setIsMounted] = useState(false);

  const path = usePathname();
  const { isMinimized } = useSidebar();
  const session = useAuthStore();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const router = useRouter();

  const handleConfirmLogout = () => {
    removeUserToken();
    setIsLogoutOpen(false);
    router.replace("/");
  };

  const handleCancelLogout = () => {
    setIsLogoutOpen(false);
  };

  const toggleDropdown = (title: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  if (!items?.length) return null;

  if (!isMounted || !session.isAuthenticated) {
    return <div className="p-4">Loading...</div>;
  }

   // Now safely check authentication
  if (!session.isAuthenticated) {
    return (
      <nav className="grid items-start gap-1 p-2">
        <div className="text-sm text-muted-foreground p-4">
          Please log in to access navigation
        </div>
      </nav>
    );
  }

  if (session.isAuthenticated && session.user) {
    return (
      <>
        <nav className="grid items-start gap-1 p-2">
          <TooltipProvider>
            {items.map((item, index) => {
              const Icon = Icons[item.icon || "arrowRight"];
              const hasChildren = item.items && item.items.length > 0;
              const isOpen = openDropdowns[item.title];
              const isActive =
                path === item.href ||
                (hasChildren &&
                  item.items?.some((child) => path === child.href));

              return (
                session?.user?.role &&
                item.role.includes(session.user.role) && (
                  <div key={index} className="relative">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            // Base styles with glassmorphism
                            "group relative flex items-center gap-3 overflow-hidden rounded-xl py-3 px-3 text-sm font-medium cursor-pointer transition-all duration-300 ease-in-out",
                            // Glassmorphism effect
                            "backdrop-blur-sm border border-white/10",
                            // Active state with gradient
                            isActive
                              ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/10 border-blue-400/20"
                              : "hover:bg-white/5 hover:shadow-lg hover:shadow-black/5 hover:border-white/20",
                            // Interactive states
                            "hover:scale-[1.02] active:scale-[0.98]",
                            item.disabled && "cursor-not-allowed opacity-50"
                          )}
                          onClick={() => {
                            if (hasChildren) {
                              toggleDropdown(item.title);
                            } else if (item.title === "Logout") {
                              setIsLogoutOpen(true);
                            }
                          }}
                        >
                          {/* Animated background gradient */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl" />

                          {/* Icon with enhanced styling */}
                          <div
                            className={cn(
                              "relative z-10 p-2 rounded-lg transition-all duration-300",
                              isActive
                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                                : "bg-white/10 text-muted-foreground group-hover:bg-white/20 group-hover:text-foreground"
                            )}
                          >
                            <Icon className="size-5" />
                            {isActive && (
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/30 to-purple-400/30 animate-pulse" />
                            )}
                          </div>

                          {/* Text and chevron */}
                          {isMobileNav || (!isMinimized && !isMobileNav) ? (
                            <>
                              {hasChildren ? (
                                <span className="relative z-10 mr-2 truncate flex-1 text-foreground font-medium">
                                  {item.title}
                                  {isActive && (
                                    <Sparkles className="inline-block ml-2 size-3 text-blue-400 animate-pulse" />
                                  )}
                                </span>
                              ) : item.title === "Logout" ? (
                                // Don't wrap Logout in Link
                                <span className="relative z-10 mr-2 truncate flex-1 text-foreground font-medium hover:text-red-400 transition-colors">
                                  {item.title}
                                </span>
                              ) : (
                                <Link
                                  href={item.disabled ? "/" : item.href || "/"}
                                  className="relative z-10 mr-2 truncate flex-1 text-foreground font-medium hover:text-blue-400 transition-colors"
                                >
                                  {item.title}
                                  {isActive && (
                                    <Sparkles className="inline-block ml-2 size-3 text-blue-400 animate-pulse" />
                                  )}
                                </Link>
                              )}
                              {hasChildren && (
                                <div
                                  className={cn(
                                    "relative z-10 mr-1 p-1 rounded-md transition-all duration-300",
                                    "group-hover:bg-white/10"
                                  )}
                                >
                                  {isOpen ? (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-transform duration-300" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-transform duration-300" />
                                  )}
                                </div>
                              )}
                            </>
                          ) : null}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        align="center"
                        side="right"
                        sideOffset={8}
                        className={!isMinimized ? "hidden" : "inline-block"}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="size-4" />
                          {item.title}
                        </div>
                      </TooltipContent>
                    </Tooltip>

                    {/* Enhanced dropdown menu */}
                    {hasChildren &&
                      isOpen &&
                      (isMobileNav || (!isMinimized && !isMobileNav)) && (
                        <div className="mt-2 ml-4 space-y-1 animate-in slide-in-from-top-2 duration-300">
                          {/* Connecting line */}
                          <div className="w-px h-2 bg-gradient-to-b from-blue-400/50 to-transparent ml-6" />

                          {item.items?.map(
                            (child, childIndex) =>
                              session?.user?.role &&
                              child.role.includes(session.user.role) && (
                                <Link
                                  key={childIndex}
                                  href={child.href || "/"}
                                  className={cn(
                                    "group flex items-center gap-3 rounded-lg py-2.5 px-4 text-sm transition-all duration-200",
                                    "backdrop-blur-sm border border-transparent",
                                    "hover:bg-white/5 hover:border-white/10 hover:shadow-md",
                                    path === child.href
                                      ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/20 text-blue-400 font-medium"
                                      : "text-muted-foreground hover:text-foreground"
                                  )}
                                  onClick={() => {
                                    if (setOpen) setOpen(false);
                                  }}
                                >
                                  {/* Animated bullet point */}
                                  <div
                                    className={cn(
                                      "flex-shrink-0 w-1.5 h-1.5 rounded-full transition-all duration-300",
                                      path === child.href
                                        ? "bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg shadow-blue-400/50 scale-125"
                                        : "bg-muted-foreground/40 group-hover:bg-muted-foreground group-hover:scale-110"
                                    )}
                                  />

                                  <span className="flex-1">{child.title}</span>

                                  {/* Active indicator */}
                                  {path === child.href && (
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                                  )}
                                </Link>
                              )
                          )}
                        </div>
                      )}
                  </div>
                )
              );
            })}
          </TooltipProvider>
        </nav>

        {/* Logout Confirmation Modal */}
        <LogoutConfirmationModal
          isOpen={isLogoutOpen}
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
          userName={session.user?.name || "User"}
        />
      </>
    );
  }
  return null;
}
