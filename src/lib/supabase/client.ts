import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

    try {
        if (!supabaseUrl || !supabaseUrl.startsWith("http") || !supabaseKey) {
            throw new Error("Invalid Supabase configuration")
        }
        return createBrowserClient(supabaseUrl, supabaseKey, {
            cookieOptions: {
                name: 'sb-auth-token',
                path: '/',
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
            }
        })
    } catch (e) {
        return createBrowserClient(
            "https://placeholder-project.supabase.co",
            "placeholder-key"
        )
    }
}
