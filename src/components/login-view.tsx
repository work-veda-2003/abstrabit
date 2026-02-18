"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { Chrome } from "lucide-react"

export function LoginView() {
    const handleLogin = async () => {
        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6 max-w-sm w-full"
            >
                <div className="space-y-2">
                    <h1 className="text-3xl font-light tracking-tight text-white/90">
                        Abstrabit
                    </h1>
                    <p className="text-sm text-white/50">
                        Curate your digital depth. Minimal. Private. Real-time.
                    </p>
                </div>

                <div className="glass-panel p-8 rounded-2xl space-y-4">
                    <Button
                        onClick={handleLogin}
                        className="w-full h-12 glass-button hover:bg-white/10 border-white/10 text-white gap-2"
                    >
                        <Chrome className="w-4 h-4" />
                        Continue with Google
                    </Button>
                    <p className="text-xs text-center text-white/30">
                        By continuing, you agree to our minimal terms of service.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
