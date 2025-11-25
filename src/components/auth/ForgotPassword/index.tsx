import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  sendPasswordResetOTP,
  verifyPasswordResetOTP,
  resetPasswordWithOTP,
} from "@/api/user";
import { ErrorResponseSchema } from "@/types/responseError";

// Step 1 Props
export interface StepSendOTPProps {
  email: string;
  setEmail: (val: string) => void;
  onNext: () => void;
}

// Step 1: Send OTP
export function StepSendOTP({ email, setEmail, onNext }: StepSendOTPProps) {
  const [error, setError] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setIsLoading(true);
    try {
      const res = await sendPasswordResetOTP(email);
      if (res.data) {
        onNext();
      } else {
        setError(res.error?.message || "Failed to send OTP");
      }
    } catch (err: any) {
      const erorObj = err as ErrorResponseSchema;
      setError(erorObj.error?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSendOTP} className="space-y-3">
      <Label className="text-gray-200 font-medium">Email Address</Label>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-white/5 border-white/20 text-white"
      />
      <Button
        type="submit"
        className="bg-purple-500 w-full"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send OTP"}
      </Button>
      {error && <div className="text-xs text-red-300 mt-1">{error}</div>}
    </form>
  );
}

// Step 2 Props
export interface StepVerifyOTPProps {
  email: string;
  otp: string;
  setOtp: (val: string) => void;
  onNext: (token: string) => void;
  setToken: (token: string) => void;
}

// Step 2: Verify OTP (Stores token for next step)
export function StepVerifyOTP({
  email,
  otp,
  setOtp,
  onNext,
  setToken,
}: StepVerifyOTPProps) {
  const [error, setError] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!otp) {
      setError("Please enter OTP");
      return;
    }
    setIsLoading(true);
    try {
      const res = await verifyPasswordResetOTP(email, otp);
      if (res.data?.token) {
        // Store the token in parent component state
        setToken(res.data.token);
        // Move to next step
        onNext(res.data.token);
      } else {
        setError(res.error?.message || "Invalid OTP");
      }
    } catch (err: any) {
      const erorObj = err as ErrorResponseSchema;
      setError(erorObj.error?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-3">
      <Label className="text-gray-200 font-medium">OTP</Label>
      <Input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
        className="bg-white/5 border-white/20 text-white"
      />
      <Button
        type="submit"
        className="bg-purple-500 w-full"
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>
      {error && <div className="text-xs text-red-300 mt-1">{error}</div>}
    </form>
  );
}

// Step 3 Props
export interface StepResetPasswordProps {
  token: string;
  pass: string;
  setPass: (val: string) => void;
  confirm: string;
  setConfirm: (val: string) => void;
  onReset: () => void;
}

// Step 3: Reset Password (uses resetToken from Step 2)
export function StepResetPassword({
  token,
  pass,
  setPass,
  confirm,
  setConfirm,
  onReset,
}: StepResetPasswordProps) {
  const [error, setError] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!pass || !confirm) {
      setError("Please enter new password and confirm password");
      return;
    }
    if (pass !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      // Pass token in the body (token comes from step2)
      console.log("Sending data:", { pass, token });
      const res = await resetPasswordWithOTP(pass, token);
      console.log("API response:", res);
      setIsLoading(false);
      if (res.data) {
        onReset();
      } else {
        setError(res.error?.message || "Failed to reset password");
      }
    } catch (err: any) {
      const erorObj = err as ErrorResponseSchema;
      setError(erorObj.error?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleReset} className="space-y-3">
      <Label className="text-gray-200 font-medium">New Password</Label>
      <Input
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        required
        className="bg-white/5 border-white/20 text-white"
      />
      <Label className="text-gray-200 font-medium">Confirm Password</Label>
      <Input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
        className="bg-white/5 border-white/20 text-white"
      />
      <Button
        type="submit"
        className="bg-purple-500 w-full"
        disabled={isLoading}
      >
        {isLoading ? "Resetting..." : "Reset Password"}
      </Button>
      {error && <div className="text-xs text-red-300 mt-1">{error}</div>}
    </form>
  );
}
