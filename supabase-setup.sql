-- ============================================
-- Parking Ticket System - Supabase Setup SQL
-- ============================================

-- Create Officers Table
CREATE TABLE IF NOT EXISTS public.officers (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    badge_number character varying(20) NOT NULL UNIQUE,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(100) NOT NULL UNIQUE,
    phone character varying(20) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create Vehicles Table
CREATE TABLE IF NOT EXISTS public.vehicles (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    license_plate character varying(20) NOT NULL UNIQUE,
    make character varying(50) NOT NULL,
    model character varying(50) NOT NULL,
    color character varying(30) NOT NULL,
    year integer NOT NULL,
    owner_name character varying(100) NOT NULL,
    owner_phone character varying(20) NOT NULL,
    owner_email character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create Parking Tickets Table
CREATE TABLE IF NOT EXISTS public.parking_tickets (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    license_plate character varying(20) NOT NULL,
    vehicle_make character varying(50) NOT NULL,
    vehicle_model character varying(50) NOT NULL,
    vehicle_color character varying(30) NOT NULL,
    violation_type character varying(100) NOT NULL,
    violation_description text,
    location character varying(200) NOT NULL,
    issued_date timestamp with time zone DEFAULT now(),
    due_date timestamp with time zone NOT NULL,
    fine_amount numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    officer_id character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT parking_tickets_status_check CHECK (
        status::text = ANY (ARRAY['pending'::character varying::text, 'paid'::character varying::text, 'disputed'::character varying::text, 'overdue'::character varying::text])
    )
);

-- Enable Row Level Security
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_tickets ENABLE ROW LEVEL SECURITY;

-- Create Policies for Officers Table
CREATE POLICY "Allow public read access" ON public.officers
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON public.officers
    FOR INSERT WITH CHECK (true);

-- Create Policies for Vehicles Table
CREATE POLICY "Allow public read access" ON public.vehicles
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON public.vehicles
    FOR INSERT WITH CHECK (true);

-- Create Policies for Parking Tickets Table
CREATE POLICY "Allow public read access" ON public.parking_tickets
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON public.parking_tickets
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON public.parking_tickets
    FOR UPDATE USING (true);

-- Insert Sample Officers Data
INSERT INTO public.officers (id, badge_number, first_name, last_name, email, phone, created_at) VALUES
('c0f23a6a-52df-4b2e-a200-8dc640ad6fc0', 'OFF001', 'John', 'Smith', 'john.smith@city.gov', '(555) 123-4567', now()),
('9accae62-f9af-4f59-9ecf-3cf0302450ca', 'OFF002', 'Sarah', 'Johnson', 'sarah.johnson@city.gov', '(555) 234-5678', now()),
('bcbecf03-41ee-46b5-894d-c57bb17b632a', 'OFF003', 'Michael', 'Davis', 'michael.davis@city.gov', '(555) 345-6789', now()),
('9306ac3b-553f-4330-bdb0-1904544cd886', 'OFF004', 'Lisa', 'Wilson', 'lisa.wilson@city.gov', '(555) 456-7890', now()),
('61b07ef8-5f87-4dbc-9a0d-d8cc25887d84', 'OFF005', 'Robert', 'Brown', 'robert.brown@city.gov', '(555) 567-8901', now())
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Vehicles Data
INSERT INTO public.vehicles (id, license_plate, make, model, color, year, owner_name, owner_phone, owner_email, created_at) VALUES
('6f94f243-1431-4e83-950d-c5b6e128c639', 'ABC123', 'Toyota', 'Camry', 'Blue', 2020, 'Alice Johnson', '(555) 111-2222', 'alice.johnson@email.com', now()),
('e3a7fa1e-0094-4a5d-97c6-689492e96f27', 'XYZ789', 'Honda', 'Civic', 'Red', 2019, 'Bob Smith', '(555) 222-3333', 'bob.smith@email.com', now()),
('3c91b241-c033-49b9-8656-711c0d892fc3', 'DEF456', 'Ford', 'Focus', 'Silver', 2021, 'Carol Davis', '(555) 333-4444', 'carol.davis@email.com', now()),
('3e801f82-224d-48cb-94db-d906dd0ec781', 'GHI789', 'Nissan', 'Altima', 'Black', 2018, 'David Wilson', '(555) 444-5555', 'david.wilson@email.com', now()),
('898ed50d-669c-4c4e-a6a8-d80d00c66a3d', 'JKL012', 'Chevrolet', 'Malibu', 'White', 2022, 'Emma Brown', '(555) 555-6666', 'emma.brown@email.com', now()),
('1d8b1a5e-fc8e-436a-add6-6276166a7a9d', 'MNO345', 'Hyundai', 'Sonata', 'Green', 2020, 'Frank Miller', '(555) 666-7777', 'frank.miller@email.com', now()),
('05b235a1-adbb-4466-bbd4-36225da54158', 'PQR678', 'Kia', 'Optima', 'Gray', 2021, 'Grace Taylor', '(555) 777-8888', 'grace.taylor@email.com', now()),
('6d38cb36-b240-482f-923e-2bc40df3371d', 'STU901', 'Mazda', 'Mazda3', 'Orange', 2019, 'Henry Anderson', '(555) 888-9999', 'henry.anderson@email.com', now())
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Parking Tickets Data
INSERT INTO public.parking_tickets (id, license_plate, vehicle_make, vehicle_model, vehicle_color, violation_type, violation_description, location, issued_date, due_date, fine_amount, status, officer_id, created_at, updated_at) VALUES
('2f831b90-ac05-4cb8-89f3-ae4680bfd188', 'ABC123', 'Toyota', 'Camry', 'Blue', 'Expired Meter', 'Vehicle parked at expired meter for over 2 hours', '123 Main Street, Downtown', now() - interval '2 days', now() + interval '28 days', 35.00, 'paid', 'OFF001', now(), now()),
('d5254e07-1811-4970-9d74-d9edc8eef2ff', 'XYZ789', 'Honda', 'Civic', 'Red', 'No Parking', 'Vehicle parked in no parking zone during rush hour', '456 Oak Avenue, Midtown', now() - interval '5 days', now() + interval '25 days', 75.00, 'paid', 'OFF002', now(), now()),
('fbebc653-6189-4041-ad1b-9d9c030f19a0', 'DEF456', 'Ford', 'Focus', 'Silver', 'Handicap Zone', 'Vehicle parked in handicap zone without proper permit', '789 Pine Street, Uptown', now() - interval '1 day', now() + interval '29 days', 250.00, 'pending', 'OFF003', now(), now()),
('07d2c2e2-3f20-4ac4-8513-0cb6df29f939', 'JKL012', 'Chevrolet', 'Malibu', 'White', 'Double Parking', 'Vehicle double parked blocking traffic flow', '654 Maple Drive, Midtown', now() - interval '3 days', now() + interval '27 days', 50.00, 'disputed', 'OFF005', now(), now()),
('fcd12566-ac48-4b83-b328-c3a3a13fef24', 'GHI789', 'Nissan', 'Altima', 'Black', 'Fire Hydrant', 'Vehicle parked within 15 feet of fire hydrant', '321 Elm Street, Downtown', now() - interval '10 days', now() + interval '20 days', 100.00, 'overdue', 'OFF004', now(), now()),
('59c27323-8667-47a6-a322-2477ed4ab034', 'MNO345', 'Hyundai', 'Sonata', 'Green', 'Blocking Driveway', 'Vehicle parked blocking residential driveway', '987 Cedar Lane, Uptown', now() - interval '7 days', now() + interval '23 days', 60.00, 'paid', 'OFF001', now(), now()),
('e7a0b109-0bb8-47e0-a619-780806bc3641', 'PQR678', 'Kia', 'Optima', 'Gray', 'Expired Meter', 'Vehicle parked at expired meter for 45 minutes', '147 Birch Road, Downtown', now() - interval '12 days', now() + interval '18 days', 35.00, 'overdue', 'OFF002', now(), now()),
('1ad9d8b1-e0f0-41f3-b24c-95ca757b5f39', 'STU901', 'Mazda', 'Mazda3', 'Orange', 'No Parking', 'Vehicle parked in loading zone during restricted hours', '258 Spruce Street, Midtown', now() - interval '15 days', now() + interval '15 days', 75.00, 'disputed', 'OFF003', now(), now())
ON CONFLICT (id) DO NOTHING;
