# Abstrabit

A minimal, depth-focused bookmark manager.

## Features

- **Google Authentication**: Seamless sign-in.
- **Real-time Updates**: Bookmarks sync instantly across devices.
- **Private Space**: Your bookmarks are yours alone.
- **Minimal Design**: Focused on content, with subtle depth and glassmorphism.

## Tech Stack

- **Next.js 15** (App Router)
- **Supabase** (Auth, Database, Realtime)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)

## Setup Guide

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **Authentication -> Providers** and enable **Google**.
   - You will need to set up a Google Cloud Project to get the `Client ID` and `Client Secret`.
   - Add the Supabase generic callback URL to your Google Credentials (authorized redirect URIs).
3. Go to **SQL Editor** and run the following query to set up the database:

```sql
-- Create bookmarks table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  url text not null,
  user_id uuid references auth.users not null
);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Create Policies
create policy "Individuals can create bookmarks." on bookmarks for
    insert with check (auth.uid() = user_id);

create policy "Individuals can view their own bookmarks. " on bookmarks for
    select using (auth.uid() = user_id);

create policy "Individuals can update their own bookmarks." on bookmarks for
    update using (auth.uid() = user_id);

create policy "Individuals can delete their own bookmarks." on bookmarks for
    delete using (auth.uid() = user_id);

-- Enable Realtime
alter publication supabase_realtime add table bookmarks;
```

### 2. Environment Variables

Create a file named `.env.local` in the root (or configure in Vercel):

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Locally

```bash
npm install
npm run dev
```

### 4. Deploy to Vercel

1. Push this code to GitHub.
2. Import the project in Vercel.
3. Add the environment variables in Vercel settings.
4. Deploy.

## Design Philosophy

"Depth, Creativity, Minimalism."
The UI uses a dark, "void-like" background with subtle glassmorphism to create a sense of depth. Interactions are smooth and meaningful.
