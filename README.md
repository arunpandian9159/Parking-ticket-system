# 🚗 Parking Ticket Management System

A modern, comprehensive parking ticket management system built with React, JavaScript, and Supabase. This application allows parking enforcement officers to create, manage, and track parking violations efficiently with a beautiful, responsive interface.

## Deployed website
https://parking-ticket-system.vercel.app/

## ✨ Features

### 🎫 Core Functionality
- **Dashboard**: Real-time overview of system statistics and recent tickets
- **Ticket Management**: Create, view, search, sort, and update parking tickets
- **Officer Management**: Comprehensive parking enforcement officer registry
- **Vehicle Registry**: Complete vehicle and owner information database
- **Status Tracking**: Monitor ticket status (pending, paid, disputed, overdue)

### 🎨 Enhanced UI/UX
- **Modern Design**: Beautiful light theme with professional styling
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Enhanced Tables**: Advanced sorting, filtering, and search capabilities
- **Smooth Animations**: Polished micro-interactions and hover effects
- **Glass Morphism**: Modern transparency and blur effects

## 🛠️ Tech Stack

- **Frontend**: React 18 with JavaScript ES6+
- **Styling**: CSS3 with modern design patterns, CSS Grid, and Flexbox
- **Database**: Supabase (PostgreSQL) with real-time capabilities
- **Routing**: React Router DOM v6
- **Type Checking**: PropTypes for runtime validation
- **Build Tool**: Create React App

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd parking-ticket-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env` file in the root directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

Run the following SQL commands in your Supabase SQL editor:

```sql
-- Create parking_tickets table
CREATE TABLE parking_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  license_plate VARCHAR(20) NOT NULL,
  vehicle_make VARCHAR(50) NOT NULL,
  vehicle_model VARCHAR(50) NOT NULL,
  vehicle_color VARCHAR(30) NOT NULL,
  violation_type VARCHAR(100) NOT NULL,
  violation_description TEXT,
  location VARCHAR(200) NOT NULL,
  issued_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  fine_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'disputed', 'overdue')),
  officer_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create officers table
CREATE TABLE officers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  badge_number VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  license_plate VARCHAR(20) UNIQUE NOT NULL,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  color VARCHAR(30) NOT NULL,
  year INTEGER NOT NULL,
  owner_name VARCHAR(100) NOT NULL,
  owner_phone VARCHAR(20) NOT NULL,
  owner_email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE parking_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
CREATE POLICY "Allow public read access" ON parking_tickets FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON parking_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON parking_tickets FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON officers FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON officers FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON vehicles FOR INSERT WITH CHECK (true);
```

### 5. Start the Development Server

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.js     # Main dashboard
│   ├── Navbar.js        # Navigation component
│   ├── TicketList.js    # List of all tickets
│   ├── CreateTicket.js  # Form to create new tickets
│   ├── TicketDetail.js  # Individual ticket view
│   ├── OfficerList.js   # Officer management
│   ├── VehicleList.js   # Vehicle registry
│   ├── SeedData.js      # Database seeding component
│   ├── ErrorBoundary.js # Error handling component
│   ├── LoadingSpinner.js # Loading component
│   ├── EnhancedTable.js # Reusable table component
│   └── TableControls.js # Table search and filter controls
├── lib/
│   └── supabase.js      # Supabase client configuration
├── utils/
│   └── seedData.js      # Database seeding utilities
├── App.js               # Main app component
├── App.css              # App-specific styles
├── index.js             # Entry point
└── index.css            # Global styles and design system
```

## Usage

### Dashboard
- View system statistics
- See recent tickets
- Quick overview of pending and paid tickets

### Creating Tickets
1. Navigate to "Create Ticket"
2. Fill in vehicle information
3. Select violation type and enter details
4. Set fine amount and location
5. Submit to create the ticket

### Managing Tickets
- View all tickets in the "Tickets" section
- Filter by status (pending, paid, disputed, overdue)
- Update ticket status directly from the list
- View detailed information for each ticket

### Officer Management
- Add new parking enforcement officers
- View all registered officers
- Track officer information and contact details

### Vehicle Registry
- Register vehicles and owner information
- Track vehicle details for future reference
- Maintain contact information for vehicle owners

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
