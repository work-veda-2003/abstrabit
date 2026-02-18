# Abstrabit 🌌

Abstrabit is a clean, minimal, and fast bookmark manager built for developers who hate clutter. It uses a "glassmorphic" design to make your links feel like they are floating in space.

## 🛠 Why I Built This (and the problems I solved)

Building this wasn't just about putting links on a screen. I ran into real technical walls and had to find smart ways around them. Here is the "human" version of the engineering journey:

### 1. The "Invisible" Server Crash
**The Problem**: When I first deployed to Vercel, the whole site crashed with a "Server Component Error." This happened because Vercel was trying to build the site before the Supabase keys were ready, and the code didn't know how to handle "missing" values.
**The Fix**: I rewrote the Supabase connection logic to be "defensive." I added checks that say: *"If the keys aren't here yet, don't crash the whole site; just show a safe fallback."* I also forced the app to render "dynamically" so it wouldn't get confused about user cookies during the build process.

### 2. The "Handshake" Fail (Auth PKCE)
**The Problem**: Google Login would work on my computer but fail on my phone. It kept saying "PKCE code verifier not found." This is basically like the phone and the server speaking two different languages and losing the "security' key during the handshake.
**The Fix**: I found out that the Browser and the Server were using slightly different names for their security cookies. I manually synchronized the cookie settings (Name, Path, and Security level) in both the `client.ts` and `server.ts` files. This made the handshake 100% reliable.

### 3. The "Double Entry" Bug
**The Problem**: On mobile, when you added a bookmark, it would appear twice for a second, then go back to one. This happened because my "Optimistic Update" (making the UI feel fast) was fighting with the "Real-time Sync" (getting live data from the database).
**The Fix**: I synchronized the IDs. Now, the phone generates the ID *before* sending it to the database. When the database sends the message back saying "Hey, I have a new link," the phone checks the ID and says: *"I already have this one on the screen, ignore it."* No more double entries!

### 4. The Hover Trap
**The Problem**: I designed a clean UI where the "Delete" button appeared when you hovered your mouse. It looked great on PC, but on a phone, there is no "hover." Users couldn't delete anything!
**The Fix**: I implemented smart device detection. Now, on phones, the delete button is always visible and has a larger "touch target" (so you don't miss it), but on PC, it stays hidden until you hover to keep things looking clean.

---

## 🏗 Tech Stack
- **Next.js 15**: For the lightning-fast speed.
- **Supabase**: For the real-time database and secure login.
- **Tailwind CSS v4**: For the beautiful glassmorphic design.
- **Framer Motion**: For those smooth, "buttery" animations.

## 🚀 Speed-Run Setup

1. **Clone & Install**: `npm install`
2. **Database**: Create a `bookmarks` table in Supabase with `id`, `title`, `url`, and `user_id`. (Don't forget to enable RLS so users can't see each other's links!)
3. **Environment**: Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to an `.env.local` file.
4. **Go Live**: `npm run dev`

---

## 💡 Design Philosophy
*"Depth over Distraction."* 
Everything in Abstrabit is designed to feel calm. From the dark void background to the subtle shadows on the cards, the goal is to help you focus on your links, not the UI.
