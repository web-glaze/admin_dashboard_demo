import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Mail, Phone, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { CreateUserData } from "@/types/user";
import { useState } from "react";

interface ContactInfoSectionProps {
  formData: CreateUserData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  requiredFields: string[];
  onInputChange: (field: keyof CreateUserData, value: string) => void;
  onFieldBlur: (field: keyof CreateUserData) => void;
  getFieldError: (field: string) => string;
}

// Generate random 10-digit Indian phone number (starts with 6-9)
const generateRandomPhoneNumber = (): string => {
  const firstDigit = Math.floor(Math.random() * 4) + 6; // 6, 7, 8, 9
  const remainingDigits = Array.from({ length: 9 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return `${firstDigit}${remainingDigits}`;
};

export function ContactInfoSection({
  formData,
  requiredFields,
  onInputChange,
  onFieldBlur,
  getFieldError,
}: ContactInfoSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const isRequired = (field: string) => requiredFields.includes(field);
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) =>
    /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[-\s]/g, ""));

  const handleGeneratePhone = () => {
    setIsGenerating(true);
    const randomPhone = generateRandomPhoneNumber();
    onInputChange("phoneNumber", randomPhone);

    // Add a small delay for visual feedback
    setTimeout(() => {
      setIsGenerating(false);
    }, 300);
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-green-50/50 to-green-100/20 dark:from-green-950/10 dark:to-green-900/5 p-6 rounded-xl border border-green-200/30 dark:border-green-800/20 shadow-sm">
      <div className="flex items-center gap-3 pb-3">
        <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <Mail className="size-5 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Contact Information
        </h3>
      </div>
      <Separator className="bg-green-200/40 dark:bg-green-800/30" />

      <div className="space-y-5">
        {/* Email Address */}
        <div className="space-y-2">
          <Label
            htmlFor="mail"
            className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300"
          >
            <Mail className="size-4" />
            Email Address
            {isRequired("mail") && (
              <span className="text-red-500 font-bold">*</span>
            )}
          </Label>
          <div className="relative">
            <Input
              id="mail"
              type="email"
              value={formData.mail}
              onChange={(e) => onInputChange("mail", e.target.value)}
              onBlur={() => onFieldBlur("mail")}
              placeholder="user@company.com"
              data-error={!!getFieldError("mail")}
              className={`h-11 transition-all duration-200 pr-10 ${
                getFieldError("mail")
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20"
                  : formData.mail && isValidEmail(formData.mail)
                  ? "border-green-400 focus:border-green-500 focus:ring-green-500/20 bg-green-50/50 dark:bg-green-950/20"
                  : "border-slate-300 dark:border-slate-600 focus:border-green-500 focus:ring-green-500/20 bg-white dark:bg-slate-800"
              }`}
            />
            {formData.mail &&
              !getFieldError("mail") &&
              isValidEmail(formData.mail) && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-green-500" />
              )}
          </div>
          {getFieldError("mail") && (
            <div className="flex items-center gap-2 mt-2">
              <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {getFieldError("mail")}
              </p>
            </div>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label
            htmlFor="phoneNumber"
            className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300"
          >
            <Phone className="size-4" />
            Phone Number
            {isRequired("phoneNumber") && (
              <span className="text-red-500 font-bold">*</span>
            )}
            <span className="text-xs text-slate-500 dark:text-slate-400 font-normal ml-1">
              (Optional - Auto-generated if empty)
            </span>
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => onInputChange("phoneNumber", e.target.value)}
                onBlur={() => onFieldBlur("phoneNumber")}
                placeholder="XXXXXXXXXX"
                data-error={!!getFieldError("phoneNumber")}
                className={`h-11 transition-all duration-200 pr-10 ${
                  getFieldError("phoneNumber")
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20"
                    : formData.phoneNumber && isValidPhone(formData.phoneNumber)
                    ? "border-green-400 focus:border-green-500 focus:ring-green-500/20 bg-green-50/50 dark:bg-green-950/20"
                    : "border-slate-300 dark:border-slate-600 focus:border-green-500 focus:ring-green-500/20 bg-white dark:bg-slate-800"
                }`}
              />
              {formData.phoneNumber &&
                !getFieldError("phoneNumber") &&
                isValidPhone(formData.phoneNumber) && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-green-500" />
                )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleGeneratePhone}
              disabled={isGenerating}
              className="h-11 w-11 flex-shrink-0 border-green-300 hover:bg-green-50 hover:border-green-400 dark:border-green-700 dark:hover:bg-green-950/30"
              title="Generate random phone number"
            >
              <RefreshCw
                className={`size-4 text-green-600 dark:text-green-400 ${
                  isGenerating ? "animate-spin" : ""
                }`}
              />
            </Button>
          </div>
          {getFieldError("phoneNumber") && (
            <div className="flex items-center gap-2 mt-2">
              <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {getFieldError("phoneNumber")}
              </p>
            </div>
          )}
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Leave empty to auto-generate, or enter with country code (e.g., +91
            for India)
          </p>
        </div>
      </div>
    </div>
  );
}
