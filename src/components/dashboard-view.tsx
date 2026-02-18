"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AnimatePresence, motion } from "framer-motion"
import { Trash2, Link as LinkIcon, Plus, LogOut, Loader2 } from "lucide-react"

type Bookmark = {
    id: string
    created_at: string
    title: string
    url: string
    user_id: string
}

export function DashboardView({ user }: { user: any }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const [newTitle, setNewTitle] = useState("")
    const [newUrl, setNewUrl] = useState("")

    const supabase = createClient()

    useEffect(() => {
        const fetchBookmarks = async () => {
            const { data, error } = await supabase
                .from("bookmarks")
                .select("*")
                .order("created_at", { ascending: false })

            if (error) console.error("Error fetching bookmarks:", error)
            else setBookmarks(data || [])

            setLoading(false)
        }

        fetchBookmarks()

        const channel = supabase
            .channel("realtime bookmarks")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        const newBookmark = payload.new as Bookmark
                        setBookmarks((prev) => {
                            // Check if it already exists (to avoid double entry from optimistic updates)
                            if (prev.some(b => b.id === newBookmark.id)) return prev
                            return [newBookmark, ...prev]
                        })
                    } else if (payload.eventType === "DELETE") {
                        setBookmarks((prev) => prev.filter((b) => b.id !== (payload.old as { id: string }).id))
                    } else if (payload.eventType === "UPDATE") {
                        setBookmarks((prev) => prev.map((b) => b.id === (payload.new as Bookmark).id ? payload.new as Bookmark : b))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, user.id])

    const handleAddBookmark = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTitle || !newUrl) return

        // Normalize URL for duplicate checking
        const normalizedUrl = newUrl.trim().toLowerCase()
        const isDuplicate = bookmarks.some(b => b.url.trim().toLowerCase() === normalizedUrl)

        if (isDuplicate) {
            alert("This bookmark already exists in your collection.")
            return
        }

        const optimisticBookmark: Bookmark = {
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            title: newTitle,
            url: newUrl,
            user_id: user.id
        }

        // Optimistically update the UI
        setBookmarks((prev) => [optimisticBookmark, ...prev])
        setNewTitle("")
        setNewUrl("")

        setAdding(true)
        const { error } = await supabase.from("bookmarks").insert({
            id: optimisticBookmark.id, // Pass the same ID to the database
            title: optimisticBookmark.title,
            url: optimisticBookmark.url,
            user_id: user.id
        })

        if (error) {
            console.error("Error adding bookmark:", error)
            // Revert the optimistic update on error
            setBookmarks((prev) => prev.filter(b => b.id !== optimisticBookmark.id))
            setNewTitle(optimisticBookmark.title)
            setNewUrl(optimisticBookmark.url)
        }
        setAdding(false)
    }

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from("bookmarks").delete().eq("id", id)
        if (error) console.error("Error deleting bookmark:", error)
    }

    const getDomain = (url: string) => {
        try {
            return new URL(url).hostname.replace('www.', '')
        } catch {
            return url
        }
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        window.location.reload()
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-h-screen">
            <header className="flex items-center justify-between py-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-80" />
                    <h1 className="text-xl sm:text-2xl font-light tracking-tight text-white/90">
                        Abstrabit
                    </h1>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-[10px] sm:text-xs font-mono text-white/30 truncate max-w-[100px] sm:max-w-none">{user.email}</span>
                    <Button
                        onClick={handleSignOut}
                        className="bg-transparent hover:bg-white/5 text-white/50 hover:text-white border-0 h-8 w-8 p-0"
                    >
                        <LogOut className="w-4 h-4" />
                    </Button>
                </div>
            </header>

            <div className="glass-panel p-1 rounded-2xl flex flex-col md:flex-row gap-0 md:gap-2 items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent pointer-events-none" />
                <div className="flex-1 w-full relative group border-b border-white/5 md:border-b-0">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/50 transition-colors">
                        <span className="text-xs font-medium">T</span>
                    </div>
                    <Input
                        placeholder="Title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="border-0 bg-transparent focus:bg-transparent pl-8 h-12 text-sm sm:text-base placeholder:text-white/20"
                    />
                </div>
                <div className="w-px h-8 bg-white/10 hidden md:block" />
                <div className="flex-1 w-full relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/50 transition-colors">
                        <LinkIcon className="w-3 h-3" />
                    </div>
                    <Input
                        placeholder="https://"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="border-0 bg-transparent focus:bg-transparent pl-8 h-12 text-sm sm:text-base font-mono placeholder:text-white/20"
                    />
                </div>
                <Button
                    onClick={handleAddBookmark}
                    disabled={adding || !newTitle || !newUrl}
                    className="m-2 md:m-1 w-[95%] md:w-auto bg-white/10 hover:bg-white/20 text-white border-0 rounded-xl h-10 px-6 transition-all"
                >
                    {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                </Button>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-6 h-6 animate-spin text-white/20" />
                    </div>
                ) : bookmarks.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32"
                    >
                        <p className="text-2xl font-light text-white/20 mb-2">Empty Space</p>
                        <p className="text-sm text-white/10">Add depth to your collection.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
                        <AnimatePresence mode="popLayout">
                            {bookmarks.map((bookmark) => (
                                <motion.div
                                    key={bookmark.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                    className="group relative glass-panel p-0 rounded-xl hover:bg-white/10 transition-all hover:shadow-2xl hover:shadow-indigo-500/10"
                                >
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(bookmark.id);
                                            }}
                                            className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>

                                    <a
                                        href={bookmark.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col h-full p-5"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 p-2 rounded-lg bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white transition-colors">
                                                <LinkIcon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-white/90 truncate pr-6 text-base group-hover:text-indigo-300 transition-colors">
                                                    {bookmark.title}
                                                </h3>
                                                <p className="text-[10px] text-white/30 truncate mt-1 font-mono uppercase tracking-wider">
                                                    {getDomain(bookmark.url)}
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}
