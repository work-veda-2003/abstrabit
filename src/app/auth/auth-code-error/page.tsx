"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get("error") || "We couldn't verify your login. This usually happens if the login link expired or if your environment variables are misconfigured."

    return (
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-light text-white/90">Authentication Error</h1>
                <p className="text-sm text-white/50">
                    {error}
                </p>
            </div>

            <div className="pt-4">
                <Link href="/">
                    <Button className="w-full h-12 glass-button">
                        Return to Login
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default function AuthCodeError() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
            <Suspense fallback={<div className="text-white/50">Loading error details...</div>}>
                <ErrorContent />
            </Suspense>
        </div>
    )
}
