import { supabase } from '../lib/supabase';

// Dummy Officers Data
const dummyOfficers = [
  {
    badge_number: 'OFF001',
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@city.gov',
    phone: '(555) 123-4567'
  },
  {
    badge_number: 'OFF002',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@city.gov',
    phone: '(555) 234-5678'
  },
  {
    badge_number: 'OFF003',
    first_name: 'Michael',
    last_name: 'Davis',
    email: 'michael.davis@city.gov',
    phone: '(555) 345-6789'
  },
  {
    badge_number: 'OFF004',
    first_name: 'Lisa',
    last_name: 'Wilson',
    email: 'lisa.wilson@city.gov',
    phone: '(555) 456-7890'
  },
  {
    badge_number: 'OFF005',
    first_name: 'Robert',
    last_name: 'Brown',
    email: 'robert.brown@city.gov',
    phone: '(555) 567-8901'
  }
];

// Dummy Vehicles Data
const dummyVehicles = [
  {
    license_plate: 'ABC123',
    make: 'Toyota',
    model: 'Camry',
    color: 'Blue',
    year: 2020,
    owner_name: 'Alice Johnson',
    owner_phone: '(555) 111-2222',
    owner_email: 'alice.johnson@email.com'
  },
  {
    license_plate: 'XYZ789',
    make: 'Honda',
    model: 'Civic',
    color: 'Red',
    year: 2019,
    owner_name: 'Bob Smith',
    owner_phone: '(555) 222-3333',
    owner_email: 'bob.smith@email.com'
  },
  {
    license_plate: 'DEF456',
    make: 'Ford',
    model: 'Focus',
    color: 'Silver',
    year: 2021,
    owner_name: 'Carol Davis',
    owner_phone: '(555) 333-4444',
    owner_email: 'carol.davis@email.com'
  },
  {
    license_plate: 'GHI789',
    make: 'Nissan',
    model: 'Altima',
    color: 'Black',
    year: 2018,
    owner_name: 'David Wilson',
    owner_phone: '(555) 444-5555',
    owner_email: 'david.wilson@email.com'
  },
  {
    license_plate: 'JKL012',
    make: 'Chevrolet',
    model: 'Malibu',
    color: 'White',
    year: 2022,
    owner_name: 'Emma Brown',
    owner_phone: '(555) 555-6666',
    owner_email: 'emma.brown@email.com'
  },
  {
    license_plate: 'MNO345',
    make: 'Hyundai',
    model: 'Sonata',
    color: 'Green',
    year: 2020,
    owner_name: 'Frank Miller',
    owner_phone: '(555) 666-7777',
    owner_email: 'frank.miller@email.com'
  },
  {
    license_plate: 'PQR678',
    make: 'Kia',
    model: 'Optima',
    color: 'Gray',
    year: 2021,
    owner_name: 'Grace Taylor',
    owner_phone: '(555) 777-8888',
    owner_email: 'grace.taylor@email.com'
  },
  {
    license_plate: 'STU901',
    make: 'Mazda',
    model: 'Mazda3',
    color: 'Orange',
    year: 2019,
    owner_name: 'Henry Anderson',
    owner_phone: '(555) 888-9999',
    owner_email: 'henry.anderson@email.com'
  }
];

// Dummy Parking Tickets Data
const dummyTickets = [
  {
    license_plate: 'ABC123',
    vehicle_make: 'Toyota',
    vehicle_model: 'Camry',
    vehicle_color: 'Blue',
    violation_type: 'Expired Meter',
    violation_description: 'Vehicle parked at expired meter for over 2 hours',
    location: '123 Main Street, Downtown',
    issued_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    due_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days from now
    fine_amount: 35.00,
    status: 'pending',
    officer_id: 'OFF001'
  },
  {
    license_plate: 'XYZ789',
    vehicle_make: 'Honda',
    vehicle_model: 'Civic',
    vehicle_color: 'Red',
    violation_type: 'No Parking',
    violation_description: 'Vehicle parked in no parking zone during rush hour',
    location: '456 Oak Avenue, Midtown',
    issued_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    due_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days from now
    fine_amount: 75.00,
    status: 'paid',
    officer_id: 'OFF002'
  },
  {
    license_plate: 'DEF456',
    vehicle_make: 'Ford',
    vehicle_model: 'Focus',
    vehicle_color: 'Silver',
    violation_type: 'Handicap Zone',
    violation_description: 'Vehicle parked in handicap zone without proper permit',
    location: '789 Pine Street, Uptown',
    issued_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    due_date: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(), // 29 days from now
    fine_amount: 250.00,
    status: 'disputed',
    officer_id: 'OFF003'
  },
  {
    license_plate: 'GHI789',
    vehicle_make: 'Nissan',
    vehicle_model: 'Altima',
    vehicle_color: 'Black',
    violation_type: 'Fire Hydrant',
    violation_description: 'Vehicle parked within 15 feet of fire hydrant',
    location: '321 Elm Street, Downtown',
    issued_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    due_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
    fine_amount: 100.00,
    status: 'overdue',
    officer_id: 'OFF004'
  },
  {
    license_plate: 'JKL012',
    vehicle_make: 'Chevrolet',
    vehicle_model: 'Malibu',
    vehicle_color: 'White',
    violation_type: 'Double Parking',
    violation_description: 'Vehicle double parked blocking traffic flow',
    location: '654 Maple Drive, Midtown',
    issued_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    due_date: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(), // 27 days from now
    fine_amount: 50.00,
    status: 'pending',
    officer_id: 'OFF005'
  },
  {
    license_plate: 'MNO345',
    vehicle_make: 'Hyundai',
    vehicle_model: 'Sonata',
    vehicle_color: 'Green',
    violation_type: 'Blocking Driveway',
    violation_description: 'Vehicle parked blocking residential driveway',
    location: '987 Cedar Lane, Uptown',
    issued_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    due_date: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(), // 23 days from now
    fine_amount: 60.00,
    status: 'paid',
    officer_id: 'OFF001'
  },
  {
    license_plate: 'PQR678',
    vehicle_make: 'Kia',
    vehicle_model: 'Optima',
    vehicle_color: 'Gray',
    violation_type: 'Expired Meter',
    violation_description: 'Vehicle parked at expired meter for 45 minutes',
    location: '147 Birch Road, Downtown',
    issued_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    due_date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days from now
    fine_amount: 35.00,
    status: 'overdue',
    officer_id: 'OFF002'
  },
  {
    license_plate: 'STU901',
    vehicle_make: 'Mazda',
    vehicle_model: 'Mazda3',
    vehicle_color: 'Orange',
    violation_type: 'No Parking',
    violation_description: 'Vehicle parked in loading zone during restricted hours',
    location: '258 Spruce Street, Midtown',
    issued_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    fine_amount: 75.00,
    status: 'disputed',
    officer_id: 'OFF003'
  }
];

// Function to seed the database
export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Insert Officers
    console.log('Inserting officers...');
    const { data: officersData, error: officersError } = await supabase
      .from('officers')
      .insert(dummyOfficers)
      .select();

    if (officersError) {
      console.error('Error inserting officers:', officersError);
    } else {
      console.log(`Successfully inserted ${officersData?.length} officers`);
    }

    // Insert Vehicles
    console.log('Inserting vehicles...');
    const { data: vehiclesData, error: vehiclesError } = await supabase
      .from('vehicles')
      .insert(dummyVehicles)
      .select();

    if (vehiclesError) {
      console.error('Error inserting vehicles:', vehiclesError);
    } else {
      console.log(`Successfully inserted ${vehiclesData?.length} vehicles`);
    }

    // Insert Parking Tickets
    console.log('Inserting parking tickets...');
    const { data: ticketsData, error: ticketsError } = await supabase
      .from('parking_tickets')
      .insert(dummyTickets)
      .select();

    if (ticketsError) {
      console.error('Error inserting tickets:', ticketsError);
    } else {
      console.log(`Successfully inserted ${ticketsData?.length} tickets`);
    }

    console.log('Database seeding completed!');
    return { success: true };

  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error };
  }
};

// Function to clear all data (for testing)
export const clearDatabase = async () => {
  try {
    console.log('Clearing database...');

    // Delete in reverse order due to foreign key constraints
    await supabase.from('parking_tickets').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('vehicles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('officers').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Database cleared successfully!');
    return { success: true };

  } catch (error) {
    console.error('Error clearing database:', error);
    return { success: false, error };
  }
};
