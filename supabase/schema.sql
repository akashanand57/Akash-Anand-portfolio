-- ============================================================================
--  Akash Anand — Portfolio schema
--  Run this in: Supabase Dashboard → SQL Editor → New query → Run
--
--  Security model:
--    * RLS is ON for every table.
--    * The public (anon) key may ONLY read (SELECT). There are deliberately
--      NO insert/update/delete policies, so the anon key physically cannot
--      write. All mutations go through the `admin-api` Edge Function, which
--      uses the service_role key (which bypasses RLS) after verifying the
--      admin session JWT.
--    * `admin_config` (the passcode hash) is NOT publicly readable at all.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. Helpers
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- 1. Admin config (passcode hash) — NEVER exposed to the public
-- ---------------------------------------------------------------------------
create table if not exists public.admin_config (
  id            int primary key default 1,
  passcode_hash text,
  updated_at    timestamptz not null default now(),
  constraint admin_config_singleton check (id = 1)
);
insert into public.admin_config (id, passcode_hash)
  values (1, null) on conflict (id) do nothing;

alter table public.admin_config enable row level security;
-- No policies at all -> anon/authenticated cannot read or write.
-- Only the service_role (used inside the Edge Function) can touch it.

-- ---------------------------------------------------------------------------
-- 2. Profile (single row)
-- ---------------------------------------------------------------------------
create table if not exists public.profile (
  id         int primary key default 1,
  name       text not null default '',
  role       text not null default '',
  tagline    text not null default '',
  summary    text not null default '',
  email      text not null default '',
  phone      text not null default '',
  location   text not null default '',
  resume_url text,
  updated_at timestamptz not null default now(),
  constraint profile_singleton check (id = 1)
);
create trigger trg_profile_updated before update on public.profile
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Social / contact links
-- ---------------------------------------------------------------------------
create table if not exists public.social_links (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  url        text not null default '',
  handle     text default '',
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 4. Skills
-- ---------------------------------------------------------------------------
create table if not exists public.skills (
  id         uuid primary key default gen_random_uuid(),
  category   text not null,
  name       text not null,
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 5. Experience
-- ---------------------------------------------------------------------------
create table if not exists public.experiences (
  id          uuid primary key default gen_random_uuid(),
  role        text not null,
  company     text not null,
  period      text not null default '',
  location    text default '',
  summary     text default '',
  highlights  jsonb not null default '[]'::jsonb,  -- array of strings
  tags        jsonb not null default '[]'::jsonb,  -- array of strings
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 6. Projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  tech        jsonb not null default '[]'::jsonb,  -- array of strings
  live_url    text default '',
  repo_url    text default '',
  featured    boolean not null default false,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 7. Certifications
-- ---------------------------------------------------------------------------
create table if not exists public.certifications (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  issuer     text not null default '',
  year       text default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 8. Education
-- ---------------------------------------------------------------------------
create table if not exists public.education (
  id          uuid primary key default gen_random_uuid(),
  degree      text not null,
  institution text not null default '',
  location    text default '',
  period      text default '',
  score       text default '',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 9. Settings (theme) — single row, public-readable
-- ---------------------------------------------------------------------------
create table if not exists public.settings (
  id         int primary key default 1,
  theme      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);
create trigger trg_settings_updated before update on public.settings
  for each row execute function public.set_updated_at();

-- ============================================================================
--  ROW LEVEL SECURITY — public read-only, no public writes
-- ============================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'profile','social_links','skills','experiences',
    'projects','certifications','education','settings'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "public read %1$s" on public.%1$I;', t);
    execute format(
      'create policy "public read %1$s" on public.%1$I for select using (true);', t);
  end loop;
end $$;

-- ============================================================================
--  SEED DATA — pulled from Akash Anand's résumé
-- ============================================================================

-- Profile
insert into public.profile (id, name, role, tagline, summary, email, phone, location)
values (
  1,
  'Akash Anand',
  'AI-Augmented Full Stack Software Developer',
  'I build real product features at the seam where full-stack engineering meets agentic AI.',
  'B.Tech Computer Science graduate with hands-on full stack development experience and professional training in Java Full Stack Development. Experienced integrating modern AI tools and agentic workflows (Claude, Codex, n8n, ElevenLabs Conversational Agents, Nemotron, MCP) into real product features.',
  'akashanand330@gmail.com',
  '+91-7970433198',
  'India'
) on conflict (id) do nothing;

-- Social links (URLs left editable — fill from the admin panel)
insert into public.social_links (label, url, handle, sort_order) values
  ('GitHub',   '', '', 1),
  ('LinkedIn', '', '', 2),
  ('Email',    'mailto:akashanand330@gmail.com', 'akashanand330@gmail.com', 3);

-- Skills
insert into public.skills (category, name, sort_order) values
  ('Languages','Java',1),('Languages','JavaScript',2),('Languages','TypeScript',3),
  ('Frontend','React.js',1),('Frontend','Angular',2),('Frontend','HTML5',3),('Frontend','CSS3',4),('Frontend','Tailwind CSS',5),('Frontend','Bootstrap',6),
  ('Backend','Node.js',1),('Backend','Express.js',2),('Backend','Spring Boot',3),
  ('Databases','MySQL',1),('Databases','MongoDB',2),('Databases','PostgreSQL',3),
  ('Cloud & Deployment','AWS',1),('Cloud & Deployment','DigitalOcean',2),('Cloud & Deployment','Aiven',3),('Cloud & Deployment','Vercel',4),
  ('AI Tools & Agentic Platforms','Claude (Anthropic)',1),('AI Tools & Agentic Platforms','OpenAI Codex',2),('AI Tools & Agentic Platforms','n8n',3),('AI Tools & Agentic Platforms','ElevenLabs Conversational AI',4),('AI Tools & Agentic Platforms','NVIDIA Nemotron',5),('AI Tools & Agentic Platforms','Model Context Protocol (MCP)',6),
  ('Other Tools','Git',1),('Other Tools','GitHub',2),('Other Tools','Postman',3),('Other Tools','Swagger',4),('Other Tools','REST APIs',5),('Other Tools','Agile',6),('Other Tools','Figma',7),('Other Tools','Canva',8),('Other Tools','React Native',9),('Other Tools','Elementor',10),('Other Tools','WordPress',11);

-- Experience
insert into public.experiences (role, company, period, summary, highlights, tags, sort_order) values
  (
    'Tech Executive','Exchange4Media','Sep 2025 - Present',
    'Shipping web platform features and automating editorial + growth workflows with agentic AI.',
    '["Built web platform features and reusable frontend components","Delivered API integrations across editorial and marketing systems","Improved SEO and ran newsletter / email campaigns","Automated content and growth workflows using Claude / Codex + n8n"]'::jsonb,
    '["Claude","Codex","n8n","SEO","Frontend","APIs"]'::jsonb,
    1
  ),
  (
    'Full Stack Developer','Colibyt Technologies','Sep 2024 - Aug 2025',
    'Built production React + Node applications and REST APIs in an Agile team.',
    '["Developed React.js / Node.js / MySQL applications end to end","Designed and consumed REST APIs","Built reusable UI component libraries","Worked in Agile / Git-based collaborative workflows"]'::jsonb,
    '["React.js","Node.js","MySQL","REST APIs","Agile","Git"]'::jsonb,
    2
  ),
  (
    'Java Full Stack Development Trainee','QSpiders','Jan 2024 - Aug 2024',
    'Intensive professional training in Java full stack engineering.',
    '["Core Java and Object-Oriented Programming","JDBC and SQL","React fundamentals","Spring Boot backend development"]'::jsonb,
    '["Core Java","JDBC","SQL","React","Spring Boot"]'::jsonb,
    3
  );

-- Projects
insert into public.projects (title, description, tech, live_url, featured, sort_order) values
  ('AITrackStocks','AI-powered stock trading platform with intelligent trading bots and real-time market analysis.','["AI Trading Bots","Real-time Data","React","Node.js"]'::jsonb,'https://aitrackstocks.com',true,1),
  ('Globlys','AI-powered visa application platform covering 190+ destinations, with an ElevenLabs-based AI chat + voice advisor.','["ElevenLabs","Conversational AI","Voice","React","Node.js"]'::jsonb,'https://globlys.com',true,2),
  ('Property On Click','AI-driven real estate discovery platform with AI market-intelligence briefs, price heatmaps, and a chat + voice AI advisor.','["AI Briefs","Heatmaps","Voice AI","React","Node.js"]'::jsonb,'https://dev.propertyonclick.com',true,3),
  ('Bywinn','E-commerce platform built on a React / Node / Express / MySQL stack.','["React","Node.js","Express.js","MySQL","E-commerce"]'::jsonb,'',false,4),
  ('Job Aggregator Platform','Aggregates job listings from multiple external APIs into a single searchable feed.','["React","External APIs","Aggregation"]'::jsonb,'https://job-aggregator-omega.vercel.app',false,5),
  ('Crypto Intel Dashboard','Real-time cryptocurrency market data dashboard with live price intelligence.','["React","Real-time Data","Dashboard","Crypto APIs"]'::jsonb,'https://crypto-intel-nu.vercel.app',false,6);

-- Certifications
insert into public.certifications (title, issuer, year, sort_order) values
  ('JavaScript, Java & OOP','Geekster','2024',1),
  ('Advanced Data Structures & Algorithms','Geekster','2024',2);

-- Education
insert into public.education (degree, institution, location, period, score, sort_order) values
  ('B.Tech, Computer Science Engineering','IK Gujral Punjab Technical University','Jalandhar, Punjab','2020 - 2024','72.90%',1);

-- Default theme (mirrors the shipped design; editable from the admin panel)
insert into public.settings (id, theme) values (
  1,
  '{
    "bg":"#0A0B12","surface":"#12131C","line":"#232536","ink":"#EDEEF4","muted":"#9A9DB2",
    "primary":"#C9F24D","secondary":"#7C6CFF","accent":"#FF8A5B","radius":16
  }'::jsonb
) on conflict (id) do nothing;

-- ============================================================================
--  STORAGE — résumé bucket (public read)
--  If the INSERT below errors because the bucket exists, that's fine.
-- ============================================================================
insert into storage.buckets (id, name, public)
  values ('resume','resume', true)
  on conflict (id) do nothing;

-- Public can read files in the resume bucket; uploads happen via service_role.
drop policy if exists "public read resume" on storage.objects;
create policy "public read resume" on storage.objects
  for select using (bucket_id = 'resume');
