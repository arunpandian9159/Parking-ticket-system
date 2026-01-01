-- ============================================
-- Parking Ticket System - Database Schema Updates
-- ============================================
-- Run this file in your Supabase SQL Editor to create
-- the new tables required for the feature updates.
-- ============================================

-- ============================================
-- 1. ROLES TABLE
-- For role-based access control
-- ============================================

CREATE TABLE IF NOT EXISTS public.roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default roles
INSERT INTO public.roles (name, description, permissions) VALUES
    ('Admin', 'Full system access', '["*"]'::jsonb),
    ('Manager', 'Management access without user administration', '["tickets.*","passes.*","analytics.*","rates.*","shifts.*","vehicles.*"]'::jsonb),
    ('Officer', 'Basic ticket operations and own shifts', '["tickets.view","tickets.create","tickets.update","passes.view","shifts.own"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Enable RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Read policy for authenticated users
CREATE POLICY "Roles are viewable by authenticated users" ON public.roles
    FOR SELECT TO authenticated USING (true);

-- ============================================
-- 2. USER_ROLES TABLE
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

-- Users can view their own role
CREATE POLICY "Users can view their own role" ON public.user_roles
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

-- Admins can manage all roles
CREATE POLICY "Admins can manage user roles" ON public.user_roles
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            JOIN public.roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() AND r.name = 'Admin'
        )
    );

-- ============================================
-- 3. SHIFTS TABLE
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_shifts_user_id ON public.shifts(user_id);
CREATE INDEX IF NOT EXISTS idx_shifts_clock_in ON public.shifts(clock_in DESC);

-- ============================================
-- 4. VEHICLE_HISTORY TABLE
-- For tracking vehicle visits and loyalty
-- ============================================

CREATE TABLE IF NOT EXISTS public.vehicle_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    license_plate TEXT NOT NULL,
    vehicle_type TEXT DEFAULT 'Car',
    total_visits INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    loyalty_points INTEGER DEFAULT 0,
    loyalty_tier TEXT DEFAULT 'Bronze',
    first_visit TIMESTAMPTZ,
    last_visit TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(license_plate)
);

-- Enable RLS
ALTER TABLE public.vehicle_history ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view and update vehicle history
CREATE POLICY "Authenticated users can manage vehicle history" ON public.vehicle_history
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicle_history_plate ON public.vehicle_history(license_plate);
CREATE INDEX IF NOT EXISTS idx_vehicle_history_tier ON public.vehicle_history(loyalty_tier);

-- ============================================
-- 5. AUDIT_LOGS TABLE
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

-- Authenticated users can insert audit logs
CREATE POLICY "Authenticated users can create audit logs" ON public.audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ============================================
-- 6. UPDATE PARKING_SLOTS TABLE
-- Add new columns for enhanced map
-- ============================================

ALTER TABLE public.parking_slots 
    ADD COLUMN IF NOT EXISTS floor TEXT DEFAULT 'Ground',
    ADD COLUMN IF NOT EXISTS is_ev_charging BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_handicap BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS current_vehicle_plate TEXT,
    ADD COLUMN IF NOT EXISTS current_vehicle_type TEXT;

-- ============================================
-- 7. FUNCTION: Update vehicle history on ticket payment
-- ============================================

CREATE OR REPLACE FUNCTION update_vehicle_history()
RETURNS TRIGGER AS $$
DECLARE
    points_per_rupee DECIMAL := 0.1; -- 1 point per ₹10
    new_points INTEGER;
    tier TEXT;
BEGIN
    -- Only trigger when ticket is marked as Paid
    IF NEW.status = 'Paid' AND (OLD.status IS NULL OR OLD.status != 'Paid') THEN
        -- Calculate new points
        new_points := FLOOR(NEW.price * points_per_rupee);
        
        -- Upsert vehicle history
        INSERT INTO public.vehicle_history (
            license_plate,
            vehicle_type,
            total_visits,
            total_spent,
            loyalty_points,
            first_visit,
            last_visit,
            updated_at
        ) VALUES (
            NEW.license_plate,
            NEW.vehicle_type,
            1,
            NEW.price,
            new_points,
            NEW.created_at,
            NOW(),
            NOW()
        )
        ON CONFLICT (license_plate) DO UPDATE SET
            total_visits = vehicle_history.total_visits + 1,
            total_spent = vehicle_history.total_spent + NEW.price,
            loyalty_points = vehicle_history.loyalty_points + new_points,
            last_visit = NOW(),
            updated_at = NOW();
        
        -- Update loyalty tier based on points
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

-- Create trigger for ticket updates
DROP TRIGGER IF EXISTS on_ticket_paid ON public.tickets;
CREATE TRIGGER on_ticket_paid
    AFTER UPDATE ON public.tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_vehicle_history();

-- ============================================
-- 8. FUNCTION: Update shift stats on ticket creation
-- ============================================

CREATE OR REPLACE FUNCTION update_shift_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Find active shift for the current user and update stats
    UPDATE public.shifts SET
        tickets_issued = tickets_issued + 1,
        revenue_collected = revenue_collected + COALESCE(NEW.price, 0)
    WHERE user_id = auth.uid()
      AND clock_out IS NULL;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for ticket creation
DROP TRIGGER IF EXISTS on_ticket_created ON public.tickets;
CREATE TRIGGER on_ticket_created
    AFTER INSERT ON public.tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_shift_stats();

-- ============================================
-- 9. FUNCTION: Log audit trail
-- ============================================

CREATE OR REPLACE FUNCTION log_audit_trail()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        entity_type,
        entity_id,
        old_data,
        new_data
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

-- Add audit triggers to important tables
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

-- ============================================
-- Done! Database schema updated successfully.
-- ============================================
