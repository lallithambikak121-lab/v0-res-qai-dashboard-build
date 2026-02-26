"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Shield } from "lucide-react"
import { SignIn } from "@clerk/nextjs"

export default function LoginPage() {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && userId) {
      router.push("/dashboard")
    }
  }, [isLoaded, userId, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="auth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">ResQAI</h1>
            <p className="text-xs text-muted-foreground">Disaster Response AI</p>
          </div>
        </div>

        {/* Clerk SignIn Component */}
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "rounded-2xl border border-border bg-card",
              formHeaderTitle: "text-lg font-semibold text-foreground",
              formHeaderSubtitle: "text-sm text-muted-foreground",
              formFieldLabel: "text-xs font-medium text-muted-foreground",
              formFieldInput: "rounded-xl bg-secondary text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/50",
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground text-xs",
              footerActionText: "text-muted-foreground text-sm",
              footerActionLink: "text-primary hover:text-primary/80 font-medium",
            },
          }}
          redirectUrl="/dashboard"
          signUpUrl="/sign-up"
        />

        <p className="text-center text-[10px] text-muted-foreground mt-6">
          National Disaster Response Authority - Authorized Personnel Only
        </p>
      </div>
    </div>
  )
}
