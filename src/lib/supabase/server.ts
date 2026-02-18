import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Fallback/Early return if env vars are missing to prevent crash
    if (!supabaseUrl || !supabaseKey) {
        return createServerClient(
            "https://placeholder.supabase.co",
            "placeholder-key",
            {
                cookies: {
                    getAll() { return [] },
                    setAll() { }
                }
            }
        )
    }

    try {
        return createServerClient(
            supabaseUrl,
            supabaseKey,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        )
    } catch (e) {
        console.error("Error creating Supabase server client:", e)
        return createServerClient(
            "https://placeholder.supabase.co",
            "placeholder-key",
            {
                cookies: {
                    getAll() { return [] },
                    setAll() { }
                }
            }
        )
    }
}
