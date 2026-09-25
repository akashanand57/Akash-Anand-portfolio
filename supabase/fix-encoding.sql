-- One-time fix for a text-encoding bug: the en dash (–) in these date ranges
-- got corrupted into mojibake ("â€“") when the original schema.sql was piped
-- through PowerShell's clipboard. This replaces it with a plain hyphen, which
-- has no multi-byte encoding to go wrong.
update public.experiences set period = 'Sep 2025 - Present' where company = 'Exchange4Media';
update public.experiences set period = 'Sep 2024 - Aug 2025' where company = 'Colibyt Technologies';
update public.experiences set period = 'Jan 2024 - Aug 2024' where company = 'QSpiders';
update public.education set period = '2020 - 2024' where degree like 'B.Tech%';
