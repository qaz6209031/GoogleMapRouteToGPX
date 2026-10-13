-- User feedback submitted from the site's feedback form.
-- Only the server (via the secret key) reads or writes this table:
-- RLS is enabled with no policies, so anon/authenticated roles have no access.
create table public.feedback (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  rating smallint check (rating between 1 and 5),
  message text check (char_length(message) <= 2000),
  email text check (char_length(email) <= 320),
  constraint feedback_has_content check (rating is not null or message is not null)
);

alter table public.feedback enable row level security;

revoke all on table public.feedback from anon, authenticated;
