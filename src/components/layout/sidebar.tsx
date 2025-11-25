"use client";
import React from "react";
import { DashboardNav } from "@/components/dashboard-nav";
import { navItems } from "@/constants/data";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import Image from "next/image";
import EntitySelector from "../entity-components/entity-selector";

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();

  const handleToggle = () => {
    toggle();
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          `fixed left-0 top-0 z-40 hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block overflow-y-auto`,
          !isMinimized ? "w-72" : "w-[72px]",
          className
        )}
      >
        {/* Enhanced Logo Section */}
        <div
          className={cn(
            "relative flex items-center border-b border-border/40 backdrop-blur-sm",
            "bg-gradient-to-br from-white/95 via-blue-50/50 to-purple-50/40",
            "dark:from-gray-900/95 dark:via-blue-950/30 dark:to-purple-950/20",
            "shadow-sm",
            !isMinimized
              ? "py-6 h-36 justify-start"
              : "px-0 py-6 h-24 justify-center"
          )}
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-purple-500/5 opacity-50"></div>

          {!isMinimized ? (
            // Full Logo Layout - Enhanced
            <div className="relative flex items-center  w-full z-10">
              <EntitySelector />

              {/* Subtle accent line */}
            </div>
          ) : (
            // Minimized Logo - Enhanced
            <div className="relative flex items-center justify-center w-full z-10 group">
              <div className="relative">
                {/* Enhanced minimized logo container */}
                <div className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/40 overflow-hidden p-2 transition-all duration-300 group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-3">
                  {/* Gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                  <Image
                    src="https://www.bluechip-gulf.ae/wp-content/uploads/2018/12/cropped-Re-bluechip-gulf-IT-.png"
                    alt="BG"
                    width={48}
                    height={48}
                    className="relative object-contain transition-all duration-300"
                    quality={100}
                    priority
                  />
                  {/* Animated border effect */}
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-br from-blue-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Enhanced glow effect */}
                <div className="absolute inset-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-lg opacity-0 group-hover:opacity-80 transition-all duration-500 -z-10"></div>

                {/* Pulse effect on hover */}
                <div className="absolute inset-0 w-12 h-12 rounded-xl border-2 border-blue-400/50 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
              </div>
            </div>
          )}

          {/* Decorative elements */}
          <div className="absolute top-2 right-2 w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-60"></div>
          <div className="absolute bottom-2 left-2 w-1 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-40"></div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-2">
          <DashboardNav items={navItems} />
        </div>

        {/* Footer */}
        <div
          className={cn(
            "border-t border-border/50 fixed bottom-0 bg-gradient-to-r from-blue-100 via-white to-purple-100",
            !isMinimized ? "w-72" : "w-[72px]"
          )}
        >
          {!isMinimized ? (
            <div className="px-6 py-4">
              <p className="text-xs text-muted-foreground text-center">
                © 2025 Bluechip Gulf IT Services
              </p>
            </div>
          ) : (
            <div className="py-4 flex justify-center">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          )}
        </div>
      </aside>

      {/* External Toggle Button - Swipe Style */}
      <button
        onClick={handleToggle}
        className={cn(
          "fixed top-6 z-50 hidden md:flex items-center justify-center",
          "w-8 h-14 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900",

          "border border-l-0 border-border/60 shadow-lg backdrop-blur-sm",
          "transition-all duration-500 hover:shadow-xl group",
          // Position based on sidebar state
          !isMinimized
            ? "left-72 rounded-r-xl hover:left-[290px]"
            : "left-[72px] rounded-r-xl hover:left-20"
        )}
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 rounded-r-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Icon with smooth rotation */}
        <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
          {isMinimized ? (
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 transition-colors duration-300" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 transition-colors duration-300" />
          )}
        </div>

        {/* Hover indicator */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>

        {/* Ripple effect on hover */}
        <div className="absolute inset-0 rounded-r-xl bg-blue-500/10 scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
      </button>
    </>
  );
}
