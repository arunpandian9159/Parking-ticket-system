-- =============================================================================
-- DUMMY DATA FOR PARKING TICKET SYSTEM
-- Run this script in Supabase SQL Editor to populate sample data
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. MONTHLY PASSES - Sample Data
-- -----------------------------------------------------------------------------
-- Note: Dates are relative to current date for realistic testing

INSERT INTO monthly_passes (customer_name, vehicle_number, phone_number, start_date, end_date, status) VALUES
-- Active passes (current month)
('John Smith', 'TN-01-AB-1234', '+91 9876543210', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '15 days', 'Active'),
('Priya Sharma', 'TN-02-CD-5678', '+91 8765432109', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', 'Active'),
('Michael Johnson', 'KA-03-EF-9012', '+91 7654321098', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', 'Active'),
('Ananya Patel', 'MH-04-GH-3456', '+91 6543210987', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE + INTERVAL '10 days', 'Active'),
('David Wilson', 'TN-05-IJ-7890', '+91 5432109876', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'Active'),
('Lakshmi Iyer', 'KL-06-KL-2345', '+91 4321098765', CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE + INTERVAL '5 days', 'Active'),
('Robert Brown', 'AP-07-MN-6789', '+91 3210987654', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '28 days', 'Active'),
('Kavitha Nair', 'TN-08-OP-0123', '+91 2109876543', CURRENT_DATE - INTERVAL '12 days', CURRENT_DATE + INTERVAL '18 days', 'Active'),

-- Expired passes (last month)
('James Miller', 'TN-09-QR-4567', '+91 1098765432', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '15 days', 'Expired'),
('Deepa Krishnan', 'KA-10-ST-8901', '+91 9087654321', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '30 days', 'Expired'),
('William Davis', 'MH-11-UV-2345', '+91 8076543210', CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE - INTERVAL '10 days', 'Expired'),
('Meena Sundaram', 'TN-12-WX-6789', '+91 7065432109', CURRENT_DATE - INTERVAL '50 days', CURRENT_DATE - INTERVAL '20 days', 'Expired'),

-- Cancelled passes
('Thomas Garcia', 'AP-13-YZ-0123', '+91 6054321098', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '0 days', 'Cancelled'),
('Sanjay Reddy', 'TN-14-AB-4567', '+91 5043210987', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE + INTERVAL '10 days', 'Cancelled');


-- -----------------------------------------------------------------------------
-- 2. TICKETS - Sample Data
-- -----------------------------------------------------------------------------
-- Note: Replace 'YOUR_USER_UUID' with an actual auth.users UUID from your Supabase
-- You can get this from the Supabase Authentication > Users section

-- First, let's create a variable for the officer ID (you'll need to replace this)
-- If you have an authenticated user, use their UUID

DO $$
DECLARE
    officer_uuid UUID;
BEGIN
    -- Get the first authenticated user as the officer
    -- Replace this with a specific UUID if needed
    SELECT id INTO officer_uuid FROM auth.users LIMIT 1;
    
    -- If no user exists, we'll use a placeholder (this will fail if foreign key is enforced)
    IF officer_uuid IS NULL THEN
        RAISE NOTICE 'No authenticated user found. Please create a user first or use the alternative INSERT below.';
        RETURN;
    END IF;

    -- Insert Active tickets (currently parked)
    INSERT INTO tickets (officer_id, customer_name, customer_phone, license_plate, vehicle_type, vehicle_name, vehicle_color, parking_spot, hours, price, status, fine_amount, is_pass_holder) VALUES
    (officer_uuid, 'Raj Kumar', '+91 9988776655', 'TN-01-XY-1234', 'Car', 'Honda City', 'White', 'A-1', 2, 40, 'Active', 0, false),
    (officer_uuid, 'Sunita Verma', '+91 8877665544', 'KA-02-AB-5678', 'Car', 'Maruti Swift', 'Red', 'A-2', 3, 60, 'Active', 0, false),
    (officer_uuid, 'Arun Prasad', '+91 7766554433', 'TN-03-CD-9012', 'Bike', 'Royal Enfield', 'Black', 'B-1', 1, 10, 'Active', 0, false),
    (officer_uuid, 'Rekha Menon', '+91 6655443322', 'MH-04-EF-3456', 'Car', 'Toyota Innova', 'Silver', 'A-3', 4, 80, 'Active', 0, false),
    (officer_uuid, 'Vikram Singh', '+91 5544332211', 'AP-05-GH-7890', 'Bike', 'Honda Activa', 'Blue', 'B-2', 2, 20, 'Active', 0, false),
    (officer_uuid, 'John Smith', '+91 9876543210', 'TN-01-AB-1234', 'Car', 'BMW X5', 'Black', 'A-1', 5, 0, 'Active', 0, true), -- Pass holder
    
    -- Paid tickets (completed parking)
    (officer_uuid, 'Ramesh Gupta', '+91 4433221100', 'TN-06-IJ-2345', 'Car', 'Hyundai Creta', 'Blue', 'A-1', 3, 60, 'Paid', 0, false),
    (officer_uuid, 'Anita Desai', '+91 3322110099', 'KL-07-KL-6789', 'Car', 'Kia Seltos', 'White', 'A-2', 2, 40, 'Paid', 0, false),
    (officer_uuid, 'Suresh Babu', '+91 2211009988', 'TN-08-MN-0123', 'Bike', 'TVS Jupiter', 'Grey', 'B-1', 1, 10, 'Paid', 0, false),
    (officer_uuid, 'Lakshmi Devi', '+91 1100998877', 'KA-09-OP-4567', 'Car', 'Tata Nexon', 'Orange', 'A-3', 5, 100, 'Paid', 0, false),
    (officer_uuid, 'Mohan Lal', '+91 9900887766', 'MH-10-QR-8901', 'Truck', 'Mahindra Bolero', 'White', 'C-1', 2, 100, 'Paid', 0, false),
    (officer_uuid, 'Geetha Nair', '+91 8899776655', 'TN-11-ST-2345', 'Car', 'Ford Ecosport', 'Black', 'A-1', 4, 80, 'Paid', 20, false), -- With fine
    (officer_uuid, 'Prakash Rao', '+91 7788665544', 'AP-12-UV-6789', 'Car', 'MG Hector', 'Green', 'A-2', 6, 120, 'Paid', 30, false), -- With fine
    (officer_uuid, 'Savitha Kumar', '+91 6677554433', 'TN-13-WX-0123', 'Bike', 'Bajaj Pulsar', 'Red', 'B-2', 3, 30, 'Paid', 0, false),
    (officer_uuid, 'Priya Sharma', '+91 8765432109', 'TN-02-CD-5678', 'Car', 'Audi A4', 'Grey', 'A-3', 8, 0, 'Paid', 0, true), -- Pass holder
    (officer_uuid, 'Naveen Kumar', '+91 5566443322', 'KL-14-YZ-4567', 'Car', 'Volkswagen Polo', 'Yellow', 'A-1', 2, 40, 'Paid', 0, false),
    (officer_uuid, 'Divya Menon', '+91 4455332211', 'TN-15-AB-8901', 'Car', 'Skoda Kushaq', 'Blue', 'A-2', 3, 60, 'Paid', 0, false),
    (officer_uuid, 'Karthik Rajan', '+91 3344221100', 'KA-16-CD-2345', 'Bike', 'Yamaha FZ', 'Black', 'B-1', 4, 40, 'Paid', 10, false), -- With fine
    (officer_uuid, 'Shanti Devi', '+91 2233110099', 'MH-17-EF-6789', 'Car', 'Nissan Magnite', 'Red', 'A-3', 1, 20, 'Paid', 0, false),
    (officer_uuid, 'Vijay Shankar', '+91 1122009988', 'TN-18-GH-0123', 'Truck', 'Tata 407', 'White', 'C-1', 3, 150, 'Paid', 50, false); -- With fine

END $$;


-- =============================================================================
-- ALTERNATIVE: If you know your user UUID, use this simpler INSERT
-- Replace 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' with your actual user UUID
-- =============================================================================

/*
INSERT INTO tickets (officer_id, customer_name, customer_phone, license_plate, vehicle_type, vehicle_name, vehicle_color, parking_spot, hours, price, status, fine_amount, is_pass_holder) VALUES
('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'Raj Kumar', '+91 9988776655', 'TN-01-XY-1234', 'Car', 'Honda City', 'White', 'A-1', 2, 40, 'Active', 0, false),
('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'Sunita Verma', '+91 8877665544', 'KA-02-AB-5678', 'Car', 'Maruti Swift', 'Red', 'A-2', 3, 60, 'Active', 0, false),
('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'Arun Prasad', '+91 7766554433', 'TN-03-CD-9012', 'Bike', 'Royal Enfield', 'Black', 'B-1', 1, 10, 'Active', 0, false);
*/


-- =============================================================================
-- VERIFICATION QUERIES
-- Run these to verify the data was inserted correctly
-- =============================================================================

-- Check monthly passes count
-- SELECT status, COUNT(*) FROM monthly_passes GROUP BY status;

-- Check tickets count
-- SELECT status, COUNT(*) FROM tickets GROUP BY status;

-- View all monthly passes
-- SELECT * FROM monthly_passes ORDER BY created_at DESC;

-- View all tickets
-- SELECT * FROM tickets ORDER BY created_at DESC;
