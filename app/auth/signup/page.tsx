"use client";
import React from "react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [apiError, setApiError] = React.useState<string>("");
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://techbranzzo.com";

  function validate(form: HTMLFormElement) {
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const username = String(formData.get("username") || "").trim();
    const mobile = String(formData.get("mobile") || "").trim();
    const password = String(formData.get("password") || "");

    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.name = "Full name is required";
    if (username.length < 3) nextErrors.username = "Username must be at least 3 characters";
    if (!/^\d{10}$/.test(mobile)) nextErrors.mobile = "Enter a valid 10-digit mobile number";
    if (password.length < 6) nextErrors.password = "Password must be at least 6 characters";
    return { isValid: Object.keys(nextErrors).length === 0, nextErrors };
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const { isValid, nextErrors } = validate(form);
    if (!isValid) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setApiError("");
    setIsSubmitting(true);
    try {
      const formData = new FormData(form);
      const payload = {
        name: String(formData.get("name") || "").trim(),
        username: String(formData.get("username") || "").trim(),
        mobile: String(formData.get("mobile") || "").trim(),
        password: String(formData.get("password") || ""),
        email: String(formData.get("email") || "").trim() || undefined,
      };
      const response = await fetch(`${API_BASE}/api/auth/register`, {
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
          // Handle other errors
          setApiError(data?.message || data?.error || "Registration failed");
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
              Create your EsportsNeo account
            </h2>
          </div>
          <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
            Sign up and join the battle. Your mobile number will be your unique ID.
          </p>

          <form className="my-8 space-y-5" onSubmit={handleSubmit} noValidate>
            <LabelInputContainer>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" type="text" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby="name-error" required />
              {errors.name ? (
                <p id="name-error" className="text-xs text-red-500">{errors.name}</p>
              ) : null}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" placeholder="NeoWarrior" type="text" autoComplete="username" aria-invalid={Boolean(errors.username)} aria-describedby="username-error" required />
              {errors.username ? (
                <p id="username-error" className="text-xs text-red-500">{errors.username}</p>
              ) : null}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" name="mobile" placeholder="9876543210" type="tel" inputMode="numeric" autoComplete="tel" aria-invalid={Boolean(errors.mobile)} aria-describedby="mobile-error" required />
              {errors.mobile ? (
                <p id="mobile-error" className="text-xs text-red-500">{errors.mobile}</p>
              ) : (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">We'll send important updates to this number.</p>
              )}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" name="email" placeholder="john@neo.gg" type="email" autoComplete="email" />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" name="password" placeholder="••••••••" type={showPassword ? "text" : "password"} autoComplete="new-password" className="pr-10" aria-invalid={Boolean(errors.password)} aria-describedby="password-error" required />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password ? (
                <p id="password-error" className="text-xs text-red-500">{errors.password}</p>
              ) : (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Use 6+ characters for a strong password.</p>
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
                  Creating account…
                </span>
              ) : (
                <>
                  Sign up 
                  <BottomGradient />
                </>
              )}
            </button>

            {apiError ? (
              <p className="text-center text-sm text-red-500">{apiError}</p>
            ) : null}

            <p className="text-center text-xs text-neutral-600 dark:text-neutral-400">
              By continuing, you agree to our <span className="underline decoration-red-500/60 underline-offset-2">Terms</span> and <span className="underline decoration-pink-500/60 underline-offset-2">Privacy Policy</span>.
            </p>
          </form>

          <div className="mt-4 text-center text-sm text-neutral-700 dark:text-neutral-300">
            Already have an account? <a href="/auth/login" className="font-medium text-pink-600 hover:underline">Log in</a>
          </div>
        </div>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

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
