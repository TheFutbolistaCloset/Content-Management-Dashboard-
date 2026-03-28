# ContentHub — Setup Guide

This guide walks you through connecting the three real-data integrations:

1. **Supabase** — persists posts for the Instagram Manager
2. **Instagram Graph API** — pulls published media and Insights analytics
3. **RSS Feeds** — auto-fetches from Anthropic Blog, The Verge, and Ars Technica

---

## Quick Start

```bash
cp .env.local.example .env.local
# Fill in the values from the steps below, then:
npm run dev
```

---

## 1. Supabase — Post Persistence

### Create a project

1. Go to [supabase.com](https://supabase.com) and sign up / log in.
2. Click **New project**, choose a name, region, and database password.
3. Wait ~2 minutes for provisioning.

### Create the database schema

1. In your project, go to **SQL Editor → New query**.
2. Paste the entire contents of `supabase/schema.sql`.
3. Click **Run**.

### Get your credentials

1. Go to **Settings → API**.
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Once set, the Instagram Manager page will automatically load/save posts from Supabase instead of showing demo data.

---

## 2. Instagram Graph API

You need a **Meta Developer App** connected to an **Instagram Business or Creator account**.

### Step 1 — Create a Meta Developer App

1. Go to [developers.facebook.com](https://developers.facebook.com) and log in.
2. Click **My Apps → Create App**.
3. Select **Business** as the app type.
4. Fill in the app name and contact email.

### Step 2 — Add Instagram Graph API product

1. In your app dashboard, click **Add Product**.
2. Find **Instagram Graph API** and click **Set up**.

### Step 3 — Connect your Instagram Business account

1. Go to **Instagram Graph API → Basic Display** (or **Instagram API** depending on app type).
2. Under **Instagram Testers**, add your Instagram account.
3. Accept the tester invitation from your Instagram account settings.

   Alternatively, if you have a Facebook Page linked to your Instagram Business account:
   - Go to **Instagram Graph API → Getting Started**.
   - Follow the guided setup to link your Facebook Page.

### Step 4 — Generate a Long-Lived Access Token

1. Use the [Graph API Explorer](https://developers.facebook.com/tools/explorer/) tool.
2. Select your app from the dropdown.
3. Click **Generate Access Token** and grant the required permissions:
   - `instagram_basic`
   - `instagram_manage_insights`
   - `pages_show_list`
   - `pages_read_engagement`
4. Copy the short-lived token (valid 1 hour).
5. Exchange it for a long-lived token (valid 60 days) by calling:

```
GET https://graph.facebook.com/oauth/access_token
  ?grant_type=fb_exchange_token
  &client_id={app-id}
  &client_secret={app-secret}
  &fb_exchange_token={short-lived-token}
```

Save the resulting `access_token`.

### Step 5 — Get your Instagram User ID

```
GET https://graph.instagram.com/v19.0/me?fields=id,username&access_token={your-token}
```

The `id` field is your `INSTAGRAM_USER_ID`.

### Step 6 — Add to .env.local

```env
INSTAGRAM_ACCESS_TOKEN=EAAxxxxxxxx...
INSTAGRAM_USER_ID=17841400000000000
```

Once set:
- The **Analytics** page will show real Instagram Insights instead of demo data.
- The `/api/instagram/media` endpoint will return your published posts.

> **Token refresh**: Long-lived tokens expire after 60 days. Refresh them before expiry:
> ```
> GET https://graph.instagram.com/refresh_access_token
>   ?grant_type=ig_refresh_token
>   &access_token={valid-token}
> ```

---

## 3. RSS News Feeds

No configuration required. The News Consolidator automatically fetches from:

| Feed | URL |
|------|-----|
| Anthropic Blog | `https://www.anthropic.com/rss.xml` |
| The Verge AI | `https://www.theverge.com/rss/ai-artificial-intelligence/index.xml` |
| Ars Technica | `https://feeds.arstechnica.com/arstechnica/technology-lab` |

If all feeds are unreachable (e.g., network restrictions), the page automatically falls back to curated mock articles.

---

## Environment Variables Reference

| Variable | Required for | Where to get it |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Instagram Manager (persistence) | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Instagram Manager (persistence) | Supabase → Settings → API |
| `INSTAGRAM_ACCESS_TOKEN` | Analytics (real data) + Media sync | Meta Developer App |
| `INSTAGRAM_USER_ID` | Analytics (real data) + Media sync | Graph API `/me` endpoint |

---

## Running Locally

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local with your values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Building for Production

```bash
npm run build
npm start
```
