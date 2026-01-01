-- ============================================
-- Parking Ticket System - Complete Database Schema
-- ============================================
-- Run this file in your Supabase SQL Editor to create
-- all tables required for the Parking Ticket System.
-- ============================================

-- ============================================
-- 1. TICKETS TABLE
-- Core table for parking tickets
-- ============================================

CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    officer_id UUID REFERENCES auth.users(id) NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    license_plate TEXT NOT NULL,
    vehicle_type TEXT,
    vehicle_name TEXT,
    vehicle_color TEXT,
    parking_spot TEXT NOT NULL,
    hours NUMERIC NOT NULL,
    price NUMERIC NOT NULL,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Paid')),
    fine_amount NUMERIC DEFAULT 0,
    actual_exit_time TIMESTAMPTZ,
    is_pass_holder BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Officers can view all tickets" ON public.tickets
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Officers can create tickets" ON public.tickets
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Officers can update tickets" ON public.tickets
    FOR UPDATE TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tickets_license_plate ON public.tickets(license_plate);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.tickets(created_at DESC);

-- ============================================
-- 2. PARKING RATES TABLE
-- Hourly rates by vehicle type
-- ============================================

CREATE TABLE IF NOT EXISTS public.parking_rates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_type TEXT UNIQUE NOT NULL,
    hourly_rate NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.parking_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read rates" ON public.parking_rates
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage rates" ON public.parking_rates
    FOR ALL TO authenticated USING (true);

-- Seed data
INSERT INTO public.parking_rates (vehicle_type, hourly_rate) VALUES
    ('Car', 20),
    ('Bike', 10),
    ('Truck', 50)
ON CONFLICT (vehicle_type) DO NOTHING;

-- ============================================
-- 3. PARKING SLOTS TABLE
-- Parking lot visualization
-- ============================================

CREATE TABLE IF NOT EXISTS public.parking_slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slot_number TEXT UNIQUE NOT NULL,
    section TEXT NOT NULL,
    is_occupied BOOLEAN DEFAULT FALSE,
    vehicle_type_allowed TEXT DEFAULT 'Any',
    floor TEXT DEFAULT 'Ground',
    is_ev_charging BOOLEAN DEFAULT FALSE,
    is_handicap BOOLEAN DEFAULT FALSE,
    current_vehicle_plate TEXT,
    current_vehicle_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.parking_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read slots" ON public.parking_slots
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage slots" ON public.parking_slots
    FOR ALL TO authenticated USING (true);

-- Seed data
INSERT INTO public.parking_slots (slot_number, section, vehicle_type_allowed) VALUES
    ('A-1', 'A', 'Car'), ('A-2', 'A', 'Car'), ('A-3', 'A', 'Car'), ('A-4', 'A', 'Car'), ('A-5', 'A', 'Car'),
    ('A-6', 'A', 'Car'), ('A-7', 'A', 'Car'), ('A-8', 'A', 'Car'),
    ('B-1', 'B', 'Bike'), ('B-2', 'B', 'Bike'), ('B-3', 'B', 'Bike'), ('B-4', 'B', 'Bike'),
    ('C-1', 'C', 'Truck'), ('C-2', 'C', 'Truck')
ON CONFLICT (slot_number) DO NOTHING;

-- ============================================
-- 4. MONTHLY PASSES TABLE
-- For monthly pass holders
-- ============================================

CREATE TABLE IF NOT EXISTS public.monthly_passes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    vehicle_number TEXT NOT NULL,
    phone_number TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Expired', 'Cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.monthly_passes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage passes" ON public.monthly_passes
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Public can check via vehicle number" ON public.monthly_passes
    FOR SELECT USING (true);

-- ============================================
-- 5. ROLES TABLE
-- For role-based access control
-- ============================================

CREATE TABLE IF NOT EXISTS public.roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Roles are viewable by authenticated users" ON public.roles
    FOR SELECT TO authenticated USING (true);

-- Seed roles
INSERT INTO public.roles (name, description, permissions) VALUES
    ('Admin', 'Full system access', '["*"]'::jsonb),
    ('Manager', 'Management access without user administration', '["tickets.*","passes.*","analytics.*","rates.*","shifts.*","vehicles.*"]'::jsonb),
    ('Officer', 'Basic ticket operations and own shifts', '["tickets.view","tickets.create","tickets.update","passes.view","shifts.own"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 6. USER_ROLES TABLE
-- Maps users to roles
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check if user is admin (avoids recursion)
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = check_user_id AND r.name = 'Admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users can view their own role
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
CREATE POLICY "Users can view their own role" ON public.user_roles
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

-- Admins can manage all roles (using security definer function to avoid recursion)
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
CREATE POLICY "Admins can manage user roles" ON public.user_roles
    FOR ALL TO authenticated
    USING (public.is_admin(auth.uid()));

-- Allow INSERT for any authenticated user (for auto-assign trigger)
DROP POLICY IF EXISTS "Allow role insert" ON public.user_roles;
CREATE POLICY "Allow role insert" ON public.user_roles
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

-- ============================================
-- 7. SHIFTS TABLE
-- For shift management
-- ============================================

CREATE TABLE IF NOT EXISTS public.shifts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    clock_in TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    clock_out TIMESTAMPTZ,
    tickets_issued INTEGER DEFAULT 0,
    revenue_collected DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;

-- Users can view and manage their own shifts
CREATE POLICY "Users can manage their own shifts" ON public.shifts
    FOR ALL TO authenticated
    USING (user_id = auth.uid());

-- Managers can view all shifts
CREATE POLICY "Managers can view all shifts" ON public.shifts
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            JOIN public.roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() AND r.name IN ('Admin', 'Manager')
        )
    );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_shifts_user_id ON public.shifts(user_id);
CREATE INDEX IF NOT EXISTS idx_shifts_clock_in ON public.shifts(clock_in DESC);

-- ============================================
-- 8. VEHICLE HISTORY TABLE
-- For tracking vehicle visits and loyalty
-- ============================================

CREATE TABLE IF NOT EXISTS public.vehicle_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    license_plate TEXT NOT NULL UNIQUE,
    vehicle_type TEXT DEFAULT 'Car',
    total_visits INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    loyalty_points INTEGER DEFAULT 0,
    loyalty_tier TEXT DEFAULT 'Bronze',
    first_visit TIMESTAMPTZ,
    last_visit TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.vehicle_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage vehicle history" ON public.vehicle_history
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vehicle_history_plate ON public.vehicle_history(license_plate);
CREATE INDEX IF NOT EXISTS idx_vehicle_history_tier ON public.vehicle_history(loyalty_tier);

-- ============================================
-- 9. AUDIT LOGS TABLE
-- For tracking important actions
-- ============================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            JOIN public.roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() AND r.name = 'Admin'
        )
    );

CREATE POLICY "Authenticated users can create audit logs" ON public.audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ============================================
-- 10. FUNCTIONS & TRIGGERS
-- ============================================

-- Function: Update vehicle history on ticket payment
CREATE OR REPLACE FUNCTION update_vehicle_history()
RETURNS TRIGGER AS $$
DECLARE
    points_per_rupee DECIMAL := 0.1;
    new_points INTEGER;
BEGIN
    IF NEW.status = 'Paid' AND (OLD.status IS NULL OR OLD.status != 'Paid') THEN
        new_points := FLOOR(NEW.price * points_per_rupee);
        
        INSERT INTO public.vehicle_history (
            license_plate, vehicle_type, total_visits, total_spent,
            loyalty_points, first_visit, last_visit, updated_at
        ) VALUES (
            NEW.license_plate, NEW.vehicle_type, 1, NEW.price,
            new_points, NEW.created_at, NOW(), NOW()
        )
        ON CONFLICT (license_plate) DO UPDATE SET
            total_visits = vehicle_history.total_visits + 1,
            total_spent = vehicle_history.total_spent + NEW.price,
            loyalty_points = vehicle_history.loyalty_points + new_points,
            last_visit = NOW(),
            updated_at = NOW();
        
        UPDATE public.vehicle_history SET
            loyalty_tier = CASE
                WHEN loyalty_points >= 1000 THEN 'Platinum'
                WHEN loyalty_points >= 500 THEN 'Gold'
                WHEN loyalty_points >= 100 THEN 'Silver'
                ELSE 'Bronze'
            END
        WHERE license_plate = NEW.license_plate;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_ticket_paid ON public.tickets;
CREATE TRIGGER on_ticket_paid
    AFTER UPDATE ON public.tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_vehicle_history();

-- Function: Update shift stats on ticket creation
CREATE OR REPLACE FUNCTION update_shift_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.shifts SET
        tickets_issued = tickets_issued + 1,
        revenue_collected = revenue_collected + COALESCE(NEW.price, 0)
    WHERE user_id = auth.uid()
      AND clock_out IS NULL;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_ticket_created ON public.tickets;
CREATE TRIGGER on_ticket_created
    AFTER INSERT ON public.tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_shift_stats();

-- Function: Log audit trail
CREATE OR REPLACE FUNCTION log_audit_trail()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id, action, entity_type, entity_id, old_data, new_data
    ) VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS audit_tickets ON public.tickets;
CREATE TRIGGER audit_tickets
    AFTER INSERT OR UPDATE OR DELETE ON public.tickets
    FOR EACH ROW
    EXECUTE FUNCTION log_audit_trail();

DROP TRIGGER IF EXISTS audit_monthly_passes ON public.monthly_passes;
CREATE TRIGGER audit_monthly_passes
    AFTER INSERT OR UPDATE OR DELETE ON public.monthly_passes
    FOR EACH ROW
    EXECUTE FUNCTION log_audit_trail();

-- Function: Auto-assign default role to new users
CREATE OR REPLACE FUNCTION assign_default_role()
RETURNS TRIGGER AS $$
DECLARE
    default_role_id UUID;
BEGIN
    SELECT id INTO default_role_id FROM public.roles WHERE name = 'Officer' LIMIT 1;
    
    IF default_role_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role_id)
        VALUES (NEW.id, default_role_id)
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_user_created ON auth.users;
CREATE TRIGGER on_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION assign_default_role();

-- ============================================
-- SETUP COMPLETE!
-- 
-- Tables created:
--   - tickets
--   - parking_rates
--   - parking_slots
--   - monthly_passes
--   - roles
--   - user_roles
--   - shifts
--   - vehicle_history
--   - audit_logs
--
-- Triggers created:
--   - on_ticket_paid (loyalty points)
--   - on_ticket_created (shift stats)
--   - audit_tickets (audit log)
--   - audit_monthly_passes (audit log)
--   - on_user_created (auto-assign Officer role)
-- ============================================
