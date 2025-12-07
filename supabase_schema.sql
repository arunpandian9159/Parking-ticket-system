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

create policy "Public can view active tickets" on tickets
  for select using (status = 'Active');

create policy "Officers can update tickets" on tickets
  for update using (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- NEW FEATURES SCHEMA
-- -----------------------------------------------------------------------------

-- 1. Parking Rates
create table if not exists parking_rates (
  id uuid default gen_random_uuid() primary key,
  vehicle_type text unique not null, -- e.g., 'Car', 'Bike', 'Truck'
  hourly_rate numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for parking_rates
alter table parking_rates enable row level security;
create policy "Anyone can read rates" on parking_rates for select using (true);
create policy "Authenticated users can manage rates" on parking_rates using (auth.role() = 'authenticated');

-- 2. Parking Slots
create table if not exists parking_slots (
  id uuid default gen_random_uuid() primary key,
  slot_number text unique not null,
  section text not null, -- e.g., 'A', 'B', 'Basement'
  is_occupied boolean default false,
  vehicle_type_allowed text default 'Any',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for parking_slots
alter table parking_slots enable row level security;
create policy "Anyone can read slots" on parking_slots for select using (true);
create policy "Authenticated users can manage slots" on parking_slots using (auth.role() = 'authenticated');

-- 3. Monthly Passes
create table if not exists monthly_passes (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  vehicle_number text not null,
  phone_number text,
  start_date date not null,
  end_date date not null,
  status text default 'Active' check (status in ('Active', 'Expired', 'Cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for monthly_passes
alter table monthly_passes enable row level security;
create policy "Authenticated users can manage passes" on monthly_passes using (auth.role() = 'authenticated');
create policy "Public can check via vehicle number" on monthly_passes for select using (true);

-- 4. Updates to Tickets Table
alter table tickets add column if not exists fine_amount numeric default 0;
alter table tickets add column if not exists actual_exit_time timestamp with time zone;
alter table tickets add column if not exists is_pass_holder boolean default false;

-- Initial Seed Data for Rates (User can run this once)
insert into parking_rates (vehicle_type, hourly_rate) values
  ('Car', 20),
  ('Bike', 10),
  ('Truck', 50)
on conflict (vehicle_type) do nothing;

-- Initial Seed Data for Slots (Example)
insert into parking_slots (slot_number, section, vehicle_type_allowed) values
  ('A-1', 'A', 'Car'), ('A-2', 'A', 'Car'), ('A-3', 'A', 'Car'),
  ('B-1', 'B', 'Bike'), ('B-2', 'B', 'Bike')
on conflict (slot_number) do nothing;
