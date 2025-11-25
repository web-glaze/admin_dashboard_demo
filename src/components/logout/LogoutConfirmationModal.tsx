"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  userName?: string;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  userName = "User",
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onCancel]);

  if (typeof window === "undefined") return null;

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onCancel}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              duration: 0.4,
              bounce: 0.3,
            }}
            className="relative z-10 w-full max-w-md mx-auto"
          >
            {/* Glass Card - Updated to match your app's theme */}
            <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
              {/* Background Gradient Overlay - Subtle blue/purple like your app */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-white dark:from-blue-950/20 dark:via-purple-950/10 dark:to-gray-900" />
              
              {/* Decorative Elements - Matching your app's blue/purple theme */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full translate-y-12 -translate-x-12" />

              {/* Close Button */}
              <button
                onClick={onCancel}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 group z-20"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
              </button>

              {/* Content */}
              <div className="relative z-10 p-8 text-center">
                {/* Icon - Updated to match your blue/purple gradient */}
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20 relative">
                  <LogOut className="w-9 h-9 text-white" />
                  
                  {/* Pulse Animation */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse opacity-40" />
                  
                  {/* Warning Badge */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                    <AlertCircle className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-wide">
                  Confirm Logout
                </h3>

                {/* Description */}
                <div className="space-y-2 mb-8">
                  <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                    Hi <span className="font-semibold text-blue-600 dark:text-blue-400">{userName}</span>!
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Are you sure you want to Logout of your account? You&#39;ll need to log in again to access your dashboard.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {/* Cancel Button - Matching your app's style */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onCancel}
                    className={cn(
                      "flex-1 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200",
                      "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
                      "border border-gray-300 dark:border-gray-600",
                      "text-gray-700 dark:text-gray-300",
                      "shadow-sm hover:shadow-md",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
                    )}
                  >
                    Cancel
                  </motion.button>

                  {/* Logout Button - Blue/Purple gradient matching your app */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirm}
                    className={cn(
                      "flex-1 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200",
                      "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
                      "text-white shadow-lg hover:shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40",
                      "border border-blue-400/20",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
                    )}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </span>
                  </motion.button>
                </div>

                {/* Bottom Gradient Line - Matching your app's theme */}
                <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default LogoutConfirmationModal;