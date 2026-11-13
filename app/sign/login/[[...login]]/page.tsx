import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { authAppearance } from "@/lib/auth-appearance";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  const { isAuthenticated } = await auth();
  if (isAuthenticated) redirect("/platform");

  return (
    <Suspense fallback={<p className="auth-loading" role="status">Loading sign in…</p>}>
      <SignIn
        routing="path"
        path="/sign/login"
        signUpUrl="/sign/register"
        fallbackRedirectUrl="/platform"
        signUpFallbackRedirectUrl="/platform"
        appearance={authAppearance}
        withSignUp={false}
      />
    </Suspense>
  );
}
