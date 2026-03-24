-- Build the following Supabase tables:

create table users (
  id uuid primary key,
  email text unique,
  full_name text,
  handicap int,
  subscription_status text, -- active | inactive | lapsed
  subscription_plan text,   -- monthly | yearly
  subscription_id text,     -- Stripe subscription ID
  charity_id uuid,
  charity_percentage int default 10,
  role text default 'user',
  created_at timestamp default now()
);

create table charities (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  image_url text,
  website text,
  is_featured boolean default false,
  events jsonb,
  created_at timestamp default now()
);

alter table users add constraint users_charity_id_fkey foreign key (charity_id) references charities(id);

create table scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  score int check (score >= 1 and score <= 45),
  played_on date,
  created_at timestamp default now()
);

create table draws (
  id uuid primary key default gen_random_uuid(),
  draw_date date,
  draw_type text,        -- random | algorithmic
  winning_numbers int[],
  status text,           -- draft | simulated | published
  jackpot_amount decimal,
  jackpot_rolled_over boolean default false,
  created_at timestamp default now()
);

create table draw_entries (
  id uuid primary key default gen_random_uuid(),
  draw_id uuid references draws(id),
  user_id uuid references users(id),
  numbers int[],
  match_count int,
  prize_tier text,       -- 3-match | 4-match | 5-match
  prize_amount decimal,
  created_at timestamp default now()
);

create table winners (
  id uuid primary key default gen_random_uuid(),
  draw_id uuid references draws(id),
  user_id uuid references users(id),
  prize_tier text,
  prize_amount decimal,
  proof_url text,
  verification_status text, -- pending | approved | rejected
  payment_status text,      -- pending | paid
  created_at timestamp default now()
);

create table prize_pools (
  id uuid primary key default gen_random_uuid(),
  draw_id uuid references draws(id),
  total_pool decimal,
  five_match_pool decimal,  -- 40%
  four_match_pool decimal,  -- 35%
  three_match_pool decimal, -- 25%
  active_subscribers int,
  created_at timestamp default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  stripe_subscription_id text,
  plan text,             -- monthly | yearly
  status text,
  current_period_start timestamp,
  current_period_end timestamp,
  charity_contribution decimal,
  created_at timestamp default now()
);

-- -----------------------------------------------------------------------------
-- CREATE STORAGE BUCKETS
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public) 
values ('winner-proofs', 'winner-proofs', true)
on conflict (id) do nothing;

create policy "Public access to winner proofs" 
on storage.objects for select 
using (bucket_id = 'winner-proofs');

create policy "Users can upload own proofs" 
on storage.objects for insert 
with check (bucket_id = 'winner-proofs');

-- -----------------------------------------------------------------------------
-- AUTOMATED SYNC TRIGGERS
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, subscription_status)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'inactive')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
