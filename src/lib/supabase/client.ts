import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

    // If variables are missing or obviously invalid (like a postgres protocol)
    if (!supabaseUrl || !supabaseUrl.startsWith("http") || !supabaseKey) {
        return createBrowserClient(
            "https://placeholder-project.supabase.co",
            "placeholder-key"
        )
    }

    try {
        return createBrowserClient(supabaseUrl, supabaseKey)
    } catch (e) {
        console.error("Supabase client init error:", e)
        return createBrowserClient(
            "https://placeholder-project.supabase.co",
            "placeholder-key"
        )
    }
}
