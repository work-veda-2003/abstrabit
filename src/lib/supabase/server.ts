import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

    // Safe fallback check
    if (!supabaseUrl || !supabaseUrl.startsWith("http") || !supabaseKey) {
        return createServerClient(
            "https://placeholder-project.supabase.co",
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
                cookieOptions: {
                    name: 'sb-auth-token',
                    path: '/',
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                },
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch (error) {
                            // The `setAll` method was called from a Server Component.
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
            "https://placeholder-project.supabase.co",
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
