import { createClient } from "@/lib/supabase/server"
import { LoginView } from "@/components/login-view"
import { DashboardView } from "@/components/dashboard-view"

export const dynamic = 'force-dynamic'

export default async function Home() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
      .catch((e) => {
        console.error("Auth error in Home:", e)
        return { data: { user: null } }
      })

    if (!user) {
      return <LoginView />
    }

    return <DashboardView user={user} />
  } catch (error) {
    console.error("Critical rendering error in Home:", error)
    return <LoginView />
  }
}
