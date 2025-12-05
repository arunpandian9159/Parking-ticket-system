import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  console.error('Required variables: REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Database table schemas for reference (no longer TypeScript interfaces)
// These are just comments for documentation purposes

/*
ParkingTicket:
- id: string (UUID)
- license_plate: string
- vehicle_make: string
- vehicle_model: string
- vehicle_color: string
- violation_type: string
- violation_description: string
- location: string
- issued_date: string (ISO date)
- due_date: string (ISO date)
- fine_amount: number
- status: 'pending' | 'paid' | 'disputed' | 'overdue'
- officer_id: string
- created_at: string (ISO date)

Officer:
- id: string (UUID)
- badge_number: string
- first_name: string
- last_name: string
- email: string
- phone: string
- created_at: string (ISO date)

Vehicle:
- id: string (UUID)
- license_plate: string
- make: string
- model: string
- color: string
- year: number
- owner_name: string
- owner_phone: string
- owner_email: string
- created_at: string (ISO date)
*/

// Helper function to handle Supabase errors
export const handleSupabaseError = (error, context) => {
  console.error(`Supabase error in ${context}:`, error);
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.code) {
    switch (error.code) {
      case 'PGRST116':
        return 'Database connection failed. Please check your Supabase configuration.';
      case '42501':
        return 'Permission denied. Please check your database policies.';
      case '42P01':
        return 'Table not found. Please run the database setup SQL.';
      default:
        return `Database error (${error.code}). Please try again.`;
    }
  }
  
  return 'An unexpected error occurred. Please try again.';
};
