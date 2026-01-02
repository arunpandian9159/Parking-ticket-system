# 🚗 Parking Ticket System

<p align="center">
  <img src="public/logo2.png" alt="ParkingTicket Logo" width="120" />
</p>

<p align="center">
  <strong>A modern, full-featured parking management solution built for the digital age.</strong>
</p>

<p align="center">
  <a href="https://parking-ticket-system.vercel.app/">View Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a>
</p>

---

## 🌐 Live Demo

**🔗 [https://parkingticket.vercel.app](https://parkingticket.vercel.app)**

---

## ✨ Features

### 🎫 Ticket Management

- **Create Tickets** - Issue parking tickets with vehicle details, customer info, and slot selection
- **View & Track** - Monitor all active and paid tickets in real-time
- **Mark as Paid** - Process payments with automatic fine calculation for overstays
- **Delete Tickets** - Remove tickets with confirmation dialogs
- **Print Receipts** - Generate printable parking receipts
- **QR Code Integration** - Every ticket includes a scannable QR code for quick lookup

### 👮 Role-Based Access Control

- **Admin Role** - Full system access including user management, analytics, and configuration
- **Manager Role** - Analytics, rates management, shift oversight, and reporting
- **Officer Role** - Ticket creation, shift management, and basic operations
- **Auto Role Assignment** - New users automatically assigned Officer role

### 🔐 Authentication

- **Email/Password Login** - Secure authentication with Supabase Auth
- **Google OAuth** - One-click Google Sign-In integration
- **Session Management** - Persistent sessions with automatic refresh
- **Profile Integration** - User avatars and display names from OAuth providers

### 🎟️ Monthly Passes

- **Pass Management** - Create, edit, and delete monthly parking passes
- **Status Tracking** - Active, expired, and cancelled pass states
- **Auto-detection** - Automatic pass holder recognition during ticket creation
- **Pass Validation** - Check pass validity by vehicle number
- **QR Code Passes** - Scannable QR codes for quick validation

### 🗺️ Smart Parking Map

- **Interactive Floor Plan** - 2D visual representation of parking lot
- **Real-time Occupancy** - Live slot status indicators
- **Multi-Floor Support** - Ground, Level 1, Level 2, and more
- **Section Grouping** - Organized by sections (A, B, C, etc.)
- **Vehicle Type Filtering** - Filter slots by Car, Bike, Truck
- **Special Slots** - EV charging and handicap accessible indicators
- **Search Functionality** - Quick slot search by number

### 📱 QR Code Scanner

- **Camera Scanning** - Built-in QR scanner using device camera
- **Ticket Lookup** - Instant ticket details on scan
- **Pass Validation** - Quick monthly pass verification
- **Mobile Optimized** - Works seamlessly on mobile devices

### 📊 Advanced Analytics Dashboard

- **Revenue Charts** - Beautiful line and bar charts showing earnings trends
- **Occupancy Analytics** - Real-time and historical occupancy data
- **Vehicle Distribution** - Breakdown by vehicle types (pie chart)
- **Peak Hours Heatmap** - Visual representation of busy times
- **Officer Performance** - Track tickets issued and revenue per officer
- **Time-Based Filtering** - Today, 7 days, 30 days, custom range

### ⏰ Shift Management

- **Clock In/Out** - Officers can track their shifts
- **Shift Statistics** - Tickets issued and revenue per shift
- **Shift History** - View past shifts with detailed stats
- **Manager Oversight** - Managers can view all officer shifts

### 🚗 Vehicle History & Loyalty

- **Visit Tracking** - Complete history of vehicle visits
- **Loyalty Points** - Earn points based on spending
- **Tier System** - Bronze, Silver, Gold, Platinum tiers
- **Customer Insights** - Total visits, total spent, last visit date

### 🔍 Smart Search & Filters

- **Global Search** - Search across tickets, passes, and vehicles
- **Advanced Filters** - Filter by status, date, vehicle type, and more
- **Quick Actions** - Direct actions from search results

### ⚙️ Admin Configuration

- **Rate Management** - Configure hourly rates for different vehicle types
- **User Management** - Assign and manage user roles (Admin only)
- **Dynamic Pricing** - Add, update, or remove vehicle rate categories
- **Slot Configuration** - Manage parking slots and sections

### 🔍 Public Status Check

- **Vehicle Search** - Check parking status by license plate number
- **Live Bill Calculation** - Real-time bill with overdue charges
- **No Login Required** - Public access for customers
- **QR Scan Option** - Scan ticket QR for instant status

### 🎨 Modern UI/UX

- **Dark/Light Theme** - Toggle between themes with smooth animations
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Animations** - Framer Motion powered smooth transitions
- **Glassmorphism** - Modern design with backdrop blur effects
- **Spotlight Cards** - Interactive hover effects on feature cards

---

## 🛠️ Tech Stack

| Category           | Technology                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| **Framework**      | [Next.js 16](https://nextjs.org/) (App Router)                                                                |
| **Language**       | JavaScript                                                                                                    |
| **Styling**        | [Tailwind CSS v4](https://tailwindcss.com/)                                                                   |
| **UI Components**  | Custom components with [Lucide Icons](https://lucide.dev/)                                                    |
| **Charts**         | [Recharts](https://recharts.org/)                                                                             |
| **Animations**     | [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/)                                   |
| **QR Codes**       | [qrcode.react](https://github.com/zpao/qrcode.react) + [html5-qrcode](https://github.com/mebjas/html5-qrcode) |
| **PDF Generation** | [@react-pdf/renderer](https://react-pdf.org/)                                                                 |
| **Backend & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + Auth + RLS)                                                   |
| **Notifications**  | [Sonner](https://sonner.emilkowal.ski/) (Toast notifications)                                                 |
| **Deployment**     | [Vercel](https://vercel.com/)                                                                                 |

---

## 📁 Project Structure

```
parking-ticket-system/
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin pages
│   │   ├── analytics/            # Revenue & occupancy analytics
│   │   ├── rates/                # Parking rate configuration
│   │   └── users/                # User role management
│   ├── auth/                     # Authentication pages
│   │   └── callback/             # OAuth callback handler
│   ├── dashboard/                # Main dashboard with role-based view
│   ├── officer/                  # Officer ticket management portal
│   ├── passes/                   # Monthly passes management
│   ├── scan/                     # QR code scanner page
│   ├── shifts/                   # Shift management
│   ├── status/                   # Public status check page
│   ├── tickets/                  # Ticket related pages
│   │   ├── create/               # Create new ticket with parking map
│   │   └── [id]/                 # Individual ticket view
│   ├── vehicles/                 # Vehicle history & loyalty
│   ├── globals.css               # Global styles & Tailwind config
│   ├── layout.js                 # Root layout with providers
│   └── page.js                   # Landing page
│
├── components/                   # Organized React components
│   ├── auth/                     # Authentication components
│   │   └── LoginModal.js         # Login/Register modal
│   ├── charts/                   # Chart visualizations
│   │   ├── HeatmapChart.js       # Peak hours heatmap
│   │   ├── OccupancyTrendChart.js
│   │   ├── OfficerPerformance.js
│   │   └── VehicleDistributionChart.js
│   ├── common/                   # Shared components
│   │   ├── ErrorBoundary.js      # Error handling
│   │   ├── RevenueChart.js       # Revenue visualization
│   │   └── RoleGuard.js          # Role-based access
│   ├── layout/                   # Layout components
│   │   ├── ClientLayout.js       # Client-side wrapper
│   │   ├── Navbar.js             # Role-based navigation
│   │   └── Providers.js          # Context providers
│   ├── parking/                  # Parking visualization
│   │   ├── ParkingFloorPlan.js   # 2D floor plan
│   │   └── ParkingMap.js         # Slot grid view
│   ├── pdf/                      # PDF generation
│   │   └── PDFReceipt.js         # Downloadable receipts
│   ├── search/                   # Search components
│   │   └── GlobalSearch.js       # Smart search
│   ├── ticket/                   # Ticket components
│   │   ├── QRCodeGenerator.js    # QR code creation
│   │   ├── QRScanner.js          # Camera scanner
│   │   └── TicketReceipt.js      # Print receipt
│   └── ui/                       # UI primitives
│       ├── Avatar.js             # User avatars
│       ├── Button.js             # Button variants
│       ├── Card.js               # Card component
│       ├── Input.js              # Form inputs
│       ├── ReactBits.jsx         # Animation components
│       └── Skeleton.js           # Loading states
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.js                # Authentication hook
│   └── useRole.js                # Role & permissions hook
│
├── lib/                          # Utilities and helpers
│   ├── constants.js              # App-wide constants
│   ├── rbac.js                   # Role-based access control
│   ├── roles.js                  # Role definitions & permissions
│   ├── supabase.js               # Supabase client setup
│   ├── ThemeContext.js           # Theme provider
│   └── utils.js                  # Utility functions
│
├── public/                       # Static assets
│   └── logo2.png                 # App logo
│
├── supabase_schema.sql           # Complete database schema
├── fix_rls_policy.sql            # RLS policy fix script
└── package.json                  # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**
- **Supabase Account** - [Sign up free](https://supabase.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/arunpandian9159/Parking-ticket-system.git
   cd Parking-ticket-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Supabase**

   - Create a new project at [supabase.com](https://supabase.com/)
   - Go to SQL Editor and run the schema from `supabase_schema.sql`
   - This creates all tables, functions, triggers, and RLS policies

4. **Configure environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Configure Google OAuth (Optional)**

   - In Supabase Dashboard → Authentication → Providers → Google
   - Add your Google OAuth credentials
   - Set redirect URL to `https://your-project.supabase.co/auth/v1/callback`

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. **Open in browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

8. **Assign yourself as Admin**

   After signing up, run this in Supabase SQL Editor:

   ```sql
   INSERT INTO user_roles (user_id, role_id)
   SELECT u.id, r.id
   FROM auth.users u, roles r
   WHERE u.email = 'your-email@example.com' AND r.name = 'Admin'
   ON CONFLICT (user_id) DO UPDATE SET role_id = EXCLUDED.role_id;
   ```

---

## 🗄️ Database Schema

The application uses the following main tables:

| Table             | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `tickets`         | Parking tickets with vehicle info, pricing, and status |
| `parking_rates`   | Hourly rates for different vehicle types               |
| `parking_slots`   | Available parking slots with floor & section info      |
| `monthly_passes`  | Monthly pass holder information                        |
| `roles`           | User roles (Admin, Manager, Officer)                   |
| `user_roles`      | Maps users to their roles                              |
| `shifts`          | Officer shift tracking                                 |
| `vehicle_history` | Vehicle visit history and loyalty points               |
| `audit_logs`      | System audit trail                                     |

### Triggers

| Trigger             | Description                                |
| ------------------- | ------------------------------------------ |
| `on_user_created`   | Auto-assigns Officer role to new users     |
| `on_ticket_paid`    | Updates vehicle history and loyalty points |
| `on_ticket_created` | Updates shift statistics                   |
| `audit_tickets`     | Logs ticket changes                        |

See [`supabase_schema.sql`](./supabase_schema.sql) for complete schema with RLS policies.

---

## 🔐 Role-Based Access

| Feature              | Officer | Manager | Admin |
| -------------------- | :-----: | :-----: | :---: |
| Create Tickets       |   ✅    |   ✅    |  ✅   |
| View Tickets         |   ✅    |   ✅    |  ✅   |
| Manage Passes        |  View   |   ✅    |  ✅   |
| View Analytics       |   ❌    |   ✅    |  ✅   |
| Manage Rates         |   ❌    |   ✅    |  ✅   |
| Manage Shifts        |   Own   |   All   |  All  |
| View Vehicle History |   ✅    |   ✅    |  ✅   |
| Manage Users         |   ❌    |   ❌    |  ✅   |

---

## 📜 Available Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

---

## 🎯 Key Features Breakdown

### Pricing System

```javascript
PRICING = {
  DEFAULT_HOURLY_RATE: 20, // ₹20 per hour
  OVERDUE_BASE_FINE: 50, // ₹50 base penalty
  OVERDUE_HOURLY_FINE: 20, // ₹20 per extra hour
}
```

### Loyalty Tiers

| Tier     | Points Required | Benefits             |
| -------- | --------------- | -------------------- |
| Bronze   | 0               | Base rate            |
| Silver   | 100             | 5% discount          |
| Gold     | 500             | 10% discount         |
| Platinum | 1000            | 15% discount + perks |

### Ticket Status Flow

```
Active → Overdue (if time exceeded) → Paid
```

### Monthly Pass Benefits

- Free parking during validity period
- Auto-detected during ticket creation
- Visual badge on status check
- QR code for quick scanning

---

## 🎨 Theme Support

The app supports **Dark** and **Light** themes with:

- System preference detection
- Persistent user preference
- Smooth transition animations
- Consistent color palette across themes

---

## 📱 Responsive Design

- **Mobile** - Optimized for touch with compact layouts
- **Tablet** - Balanced layout with touch-friendly elements
- **Desktop** - Full-featured interface with hover effects

---

## 🛡️ Security Features

- **Row Level Security (RLS)** - Database-level access control
- **Role-Based Permissions** - Feature access based on user role
- **Secure Authentication** - Supabase Auth with JWT tokens
- **OAuth Integration** - Secure Google Sign-In
- **Audit Logging** - Track all important actions

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the project**
2. **Create your feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Arun Pandian**

- GitHub: [@arunpandian9159](https://github.com/arunpandian9159)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - Open Source Firebase Alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS Framework
- [Lucide](https://lucide.dev/) - Beautiful Icons
- [Recharts](https://recharts.org/) - Composable Charting Library
- [Framer Motion](https://www.framer.com/motion/) - Animation Library
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) - QR Code Scanner

---

<p align="center">
  Made with ❤️ for modern parking management
</p>
