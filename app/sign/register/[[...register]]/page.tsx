import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { authAppearance } from "@/lib/auth-appearance";

export const metadata: Metadata = { title: "Create an account" };

export default async function RegisterPage() {
  const { isAuthenticated } = await auth();
  if (isAuthenticated) redirect("/platform");

  return (
    <Suspense fallback={<p className="auth-loading" role="status">Loading sign up…</p>}>
      <SignUp
        routing="path"
        path="/sign/register"
        signInUrl="/sign/login"
        forceRedirectUrl="/platform"
        signInForceRedirectUrl="/platform"
        appearance={authAppearance}
      />
    </Suspense>
  );
}
