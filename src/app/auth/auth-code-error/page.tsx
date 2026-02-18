import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthCodeError() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
            <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center space-y-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-light text-white/90">Authentication Error</h1>
                    <p className="text-sm text-white/50">
                        We couldn't verify your login. This usually happens if the login link expired or if your environment variables are misconfigured.
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
        </div>
    )
}
