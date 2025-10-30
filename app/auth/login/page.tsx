"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [apiError, setApiError] = React.useState<string>("");
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://techbranzzo.com";

  function validate(form: HTMLFormElement) {
    const formData = new FormData(form);
    const mobile = String(formData.get("mobile") || "").trim();
    const password = String(formData.get("password") || "");
    const nextErrors: Record<string, string> = {};
    if (!/^\d{10}$/.test(mobile)) nextErrors.mobile = "Enter a valid 10-digit mobile number";
    if (!password) nextErrors.password = "Password is required";
    return { isValid: Object.keys(nextErrors).length === 0, nextErrors };
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const { isValid, nextErrors } = validate(form);
    if (!isValid) { setErrors(nextErrors); return; }
    setErrors({});
    setApiError("");
    setIsSubmitting(true);
    try {
      const formData = new FormData(form);
      const payload = {
        mobile: String(formData.get("mobile") || "").trim(),
        password: String(formData.get("password") || ""),
      };
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        // Handle 422 validation errors
        if (response.status === 422 && data?.errors) {
          const fieldErrors: Record<string, string> = {};
          // Convert array of error messages to single string per field
          Object.keys(data.errors).forEach((field) => {
            const errorArray = data.errors[field];
            fieldErrors[field] = Array.isArray(errorArray) ? errorArray[0] : errorArray;
          });
          setErrors(fieldErrors);
          // Also show the general message if present
          if (data?.message) {
            setApiError(data.message);
          }
        } else {
          // Handle other errors (like invalid credentials)
          setApiError(data?.message || data?.error || "Login failed");
        }
        return;
      }
      
      if (data?.token) { 
        try { 
          localStorage.setItem("token", data.token); 
          console.log('Token saved:', data.token);
        } catch {} 
      }
      if (data?.user) { 
        try { 
          localStorage.setItem("user", JSON.stringify(data.user)); 
          localStorage.setItem("userData", JSON.stringify(data.user)); // For profile page
          console.log('User saved:', data.user);
        } catch {} 
      }
      router.push("/");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-red-950/60 via-black to-pink-950/40 px-4 py-10 md:py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="shadow-input w-full rounded-2xl border border-zinc-900/50 bg-white/80 p-5 backdrop-blur dark:border-zinc-800 dark:bg-black/60 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Welcome back
            </h2>
          </div>
          <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
            Log in using your mobile number and password.
          </p>

          <form className="my-8 space-y-5" onSubmit={handleSubmit} noValidate>
            <LabelInputContainer>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" name="mobile" placeholder="9876543210" type="tel" inputMode="numeric" autoComplete="tel" aria-invalid={Boolean(errors.mobile)} aria-describedby="mobile-error" required />
              {errors.mobile ? (
                <p id="mobile-error" className="text-xs text-red-500">{errors.mobile}</p>
              ) : (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Use your 10-digit mobile number.</p>
              )}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" name="password" placeholder="••••••••" type={showPassword ? "text" : "password"} autoComplete="current-password" className="pr-10" aria-invalid={Boolean(errors.password)} aria-describedby="password-error" required />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password ? (
                <p id="password-error" className="text-xs text-red-500">{errors.password}</p>
              ) : (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Enter your account password.</p>
              )}
            </LabelInputContainer>

            <button
              className="group/btn relative flex h-11 w-full items-center justify-center rounded-md bg-gradient-to-r from-red-600 to-pink-600 font-medium text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Signing in…
                </span>
              ) : (
                <>
                  Log in 
                </>
              )}
            </button>

            {apiError ? (
              <p className="text-center text-sm text-red-500">{apiError}</p>
            ) : null}

            <p className="text-center text-xs text-neutral-600 dark:text-neutral-400">
              New here? <a href="/auth/signup" className="font-medium text-pink-600 hover:underline">Create an account</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

