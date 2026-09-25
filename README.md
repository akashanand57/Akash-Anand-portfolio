# Akash Anand — Portfolio

A futuristic developer portfolio. **Vite + React + Tailwind** frontend, **Supabase**
(Postgres + Storage + Edge Functions) backend, deployable to **Vercel**. Every piece
of content — skills, experience, projects, certifications, education, contact links,
résumé PDF, and the entire color theme — is editable from a hidden `/admin` panel
gated by a single passcode. No redeploys needed to change content.

---

## 1. What's in here

```
├── index.html                      # app shell + Google Fonts
├── src/
│   ├── components/                 # public site sections (Hero, Projects, …)
│   ├── admin/                      # the /admin console (passcode gate + panels)
│   ├── context/ContentContext.jsx  # loads content from Supabase, applies theme
│   └── lib/                        # supabase client, api wrapper, theme engine
├── supabase/
│   ├── schema.sql                  # all tables + RLS + seed data (your résumé)
│   └── functions/admin-api/        # the trusted Edge Function (auth + writes)
├── scripts/generate-passcode-hash.mjs   # one-time initial passcode setup
├── .env.example                    # frontend env vars
└── vercel.json                     # SPA rewrite so /admin works on refresh
```

## 2. How the passcode security works (short version)

- The passcode is **never** in the frontend and **never** stored in plain text. A
  PBKDF2-SHA256 hash lives in the `admin_config` table.
- Verification runs **server-side** inside the `admin-api` Edge Function
  (constant-time compare). A wrong passcode returns a flat `incorrect passcode` —
  no hints.
- A correct passcode mints a short-lived (8h) signed **JWT** session token.
- **RLS is on for every table**: the public anon key can only `SELECT`. It cannot
  write. **All** mutations go through the Edge Function, which validates your JWT
  then writes with the `service_role` key (a secret that never reaches the browser).
- `/admin` is not linked anywhere on the public site; it's reachable only by typing
  the URL. The panel title is a generic "Console".

---

## 3. Local development

Prereqs: Node 18+.

```bash
npm install
cp .env.example .env      # then fill in your Supabase URL + anon key
npm run dev               # http://localhost:5173
```

> The site renders fully even without Supabase configured — it falls back to the
> seeded résumé content. You just can't log into `/admin` until Supabase + the
> Edge Function are set up (steps 4–6).

---

## 4. Supabase setup

### 4.1 Create the project & database

1. Create a project at [supabase.com](https://supabase.com).
2. **Project Settings → API** — copy the **Project URL** and the **anon public**
   key into your `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. **SQL Editor → New query** — paste the entire contents of
   [`supabase/schema.sql`](supabase/schema.sql) and click **Run**. This creates
   every table, turns on RLS (public read / no public write), seeds your résumé
   content, and creates the public `resume` storage bucket.

### 4.2 Set your initial passcode

The passcode hash is generated locally so your passcode never travels anywhere.

```bash
npm run hash "YourStrongPasscodeHere"
```

Copy the `update public.admin_config …` statement it prints and run it in the
Supabase **SQL Editor**. (You can change the passcode later from inside the panel.)

---

## 5. Deploy the `admin-api` Edge Function

Install the Supabase CLI ([docs](https://supabase.com/docs/guides/cli)), then:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Generate a long random signing secret for admin sessions:
#   (any long random string works; e.g. `openssl rand -base64 48`)
supabase secrets set ADMIN_JWT_SECRET="paste-a-long-random-string-here"

# Deploy the function. --no-verify-jwt lets the login call reach it unauthenticated;
# the function does its own passcode + JWT checks internally.
supabase functions deploy admin-api --no-verify-jwt
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected into Edge Functions
automatically — you do **not** set those yourself, and they never touch the frontend.

The function is now live at:
`https://YOUR_PROJECT_REF.supabase.co/functions/v1/admin-api`
(the frontend derives this from `VITE_SUPABASE_URL` automatically).

---

## 6. First login

1. `npm run dev`, go to `http://localhost:5173/admin`.
2. Enter the passcode you set in step 4.2.
3. You now have the full console:
   - **Profile** — name, role, tagline, summary, email, phone, location
   - **Skills / Experience / Projects / Certifications / Education / Contact links**
     — add, edit, delete, reorder (↑ ↓)
   - **Résumé** — upload a PDF; visitors get view/download links automatically
   - **Theme** — live color + radius editor with presets; save to publish
   - **Security** — change your passcode
4. Add your real **GitHub** and **LinkedIn** URLs under **Contact links**.

---

## 7. Deploy to Vercel

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com) → **New Project** → import the repo.
   - Framework preset: **Vite** (auto-detected). Build: `npm run build`,
     Output: `dist`.
3. **Settings → Environment Variables** — add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. `vercel.json` already rewrites all routes to `index.html`, so a hard
   refresh on `/admin` works.

Content and theme are stored in Supabase, so from now on you change the site
entirely from `/admin` — **no redeploys**.

---

## 8. Security notes & good habits

- Keep `ADMIN_JWT_SECRET` and the `service_role` key secret. They live only in
  Supabase; never put them in `.env` or the frontend.
- Use a strong, unique passcode (12+ characters). Rotate it from **Security** if
  you ever suspect exposure.
- The `admin_config` table has **no** RLS policies, so it's unreadable by the
  anon key by design — only the Edge Function (service role) can touch it.
- To further lock down the panel you can optionally add rate limiting / an IP
  allowlist in front of the Edge Function later; the current design already
  resists brute force reasonably (server-side PBKDF2, generic errors, no user
  enumeration).
```
