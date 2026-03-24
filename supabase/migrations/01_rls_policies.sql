-- Enable RLS on all tables
alter table users enable row level security;
alter table charities enable row level security;
alter table scores enable row level security;
alter table draws enable row level security;
alter table draw_entries enable row level security;
alter table winners enable row level security;
alter table prize_pools enable row level security;
alter table subscriptions enable row level security;

-- Users can read and update their own profiles
create policy "Users can view own profile" on users for select using (auth.uid() = id);
create policy "Users can update own profile" on users for update using (auth.uid() = id);

-- Charities are public read
create policy "Charities are viewable by everyone" on charities for select using (true);

-- Scores
create policy "Users can insert own scores" on scores for insert with check (auth.uid() = user_id);
create policy "Users can view own scores" on scores for select using (auth.uid() = user_id);
create policy "Users can delete own scores" on scores for delete using (auth.uid() = user_id);

-- Draws are public read so people can see history
create policy "Draws are viewable by everyone" on draws for select using (true);

-- Draw Entries
create policy "Users can view own draw entries" on draw_entries for select using (auth.uid() = user_id);

-- Winners
create policy "Users can view own winnings" on winners for select using (auth.uid() = user_id);
create policy "Users can update own winnings (for proof upload)" on winners for update using (auth.uid() = user_id);

-- Prize Pools are public read
create policy "Prize Pools are viewable by everyone" on prize_pools for select using (true);

-- Subscriptions
create policy "Users can view own subscriptions" on subscriptions for select using (auth.uid() = user_id);
