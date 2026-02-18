import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            let targetUrl = origin;
            if (isLocalEnv) {
                targetUrl = origin;
            } else if (forwardedHost) {
                targetUrl = `https://${forwardedHost}`;
            }

            console.log("Auth success, redirecting to:", `${targetUrl}${next}`)
            return NextResponse.redirect(`${targetUrl}${next}`)
        } else {
            console.error("Auth exchange error:", error)
        }
    } else {
        console.warn("Auth callback hit without code")
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
