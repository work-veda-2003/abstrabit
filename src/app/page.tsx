import { createClient } from "@/lib/supabase/server"
import { LoginView } from "@/components/login-view"
import { DashboardView } from "@/components/dashboard-view"

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <LoginView />
  }

  return <DashboardView user={user} />
}
