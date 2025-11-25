"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, Sparkles, Check } from "lucide-react";
import { authLogin } from "@/api/user";
import { setCookie } from "@/helpers";
import { CLIENT_TOKEN_STORAGE_KEY, USER_ROLE } from "@/constants";
import useAuthStore from "@/store/useAuthStore";
import {
  StepSendOTP,
  StepVerifyOTP,
  StepResetPassword,
} from "@/components/auth/ForgotPassword";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const router = useRouter();
  const { isAuthenticated, isLoaded, setAuthStore } = useAuthStore();

  useEffect(() => {
    if (isLoaded && isAuthenticated) {
      router.replace("/dashboard/profile");
    }
  }, [isAuthenticated, isLoaded, router]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await authLogin({ mail: email, password: password });
      if (res.data?.access_token) {
        setCookie(CLIENT_TOKEN_STORAGE_KEY, res.data.access_token, 30);
        window.location.href = "/dashboard/profile";
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>Checking session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <Card className="w-full max-w-md relative z-10 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {showForgot ? "Reset Password" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-gray-300">
            {showForgot
              ? "Follow the steps to reset your password"
              : "Sign in to access your account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {successMsg && (
            <Alert className="bg-green-500/10 border-green-500/20 text-green-300">
              <AlertDescription>{successMsg}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert className="bg-red-500/10 border-red-500/20 text-red-300">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!showForgot ? (
            <>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-200 font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-sm text-purple-300 hover:underline focus:outline-none"
                  >
                    Forgot Password?
                  </button>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-8 px-4">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      step > 0
                        ? "bg-green-500 text-white"
                        : step === 0
                        ? "bg-purple-500 text-white ring-4 ring-purple-300/30"
                        : "bg-white/10 text-gray-400"
                    }`}
                  >
                    {step > 0 ? <Check className="w-5 h-5" /> : "1"}
                  </div>
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${
                      step > 0 ? "bg-green-500" : "bg-white/20"
                    }`}
                  ></div>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      step > 1
                        ? "bg-green-500 text-white"
                        : step === 1
                        ? "bg-purple-500 text-white ring-4 ring-purple-300/30"
                        : "bg-white/10 text-gray-400"
                    }`}
                  >
                    {step > 1 ? <Check className="w-5 h-5" /> : "2"}
                  </div>
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${
                      step > 1 ? "bg-green-500" : "bg-white/20"
                    }`}
                  ></div>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      step === 2
                        ? "bg-purple-500 text-white ring-4 ring-purple-300/30"
                        : "bg-white/10 text-gray-400"
                    }`}
                  >
                    3
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium w-10 text-center ${
                      step === 0
                        ? "text-purple-300"
                        : step > 0
                        ? "text-green-300"
                        : "text-gray-400"
                    }`}
                  >
                    Send OTP
                  </span>
                  <div className="flex-1 mx-2"></div>
                  <span
                    className={`text-xs font-medium w-10 text-center ${
                      step === 1
                        ? "text-purple-300"
                        : step > 1
                        ? "text-green-300"
                        : "text-gray-400"
                    }`}
                  >
                    Verify OTP
                  </span>
                  <div className="flex-1 mx-2"></div>
                  <span
                    className={`text-xs font-medium w-10 text-center ${
                      step === 2 ? "text-purple-300" : "text-gray-400"
                    }`}
                  >
                    Reset Password
                  </span>
                </div>
              </div>
              {step === 0 && (
                <StepSendOTP
                  email={email}
                  setEmail={setEmail}
                  onNext={() => setStep(1)}
                />
              )}
              {step === 1 && (
                <StepVerifyOTP
                  email={email}
                  otp={otp}
                  setOtp={setOtp}
                  onNext={() => setStep(2)}
                  setToken={setResetToken}
                />
              )}
              {step === 2 && (
                <StepResetPassword
                  token={resetToken}
                  pass={pass}
                  setPass={setPass}
                  confirm={confirm}
                  setConfirm={setConfirm}
                  onReset={() => {
                    setSuccessMsg(
                      "Password reset successful! You can now sign in."
                    );
                    setShowForgot(false);
                    setStep(0);
                    setPass("");
                    setConfirm("");
                    setOtp("");
                  }}
                />
              )}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setStep(0);
                  }}
                  className="text-sm text-purple-300 hover:underline focus:outline-none"
                >
                  Remember password? Sign In
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
