-- Create tickets table
create table tickets (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  officer_id uuid references auth.users not null,
  customer_name text not null,
  customer_phone text not null,
  license_plate text not null,
  vehicle_type text,
  vehicle_name text,
  vehicle_color text,
  parking_spot text not null,
  hours numeric not null,
  price numeric not null,
  status text default 'Active' check (status in ('Active', 'Paid'))
);

-- Enable RLS
alter table tickets enable row level security;

-- Policies
create policy "Officers can view all tickets" on tickets
  for select using (auth.role() = 'authenticated');

create policy "Officers can create tickets" on tickets
  for insert with check (auth.role() = 'authenticated');

create policy "Officers can update tickets" on tickets
  for update using (auth.role() = 'authenticated');
