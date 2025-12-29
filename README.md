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

**🔗 [https://parking-ticket-system.vercel.app/](https://parking-ticket-system.vercel.app/)**

---

## ✨ Features

### 🎫 Ticket Management

- **Create Tickets** - Issue parking tickets with vehicle details, customer info, and slot selection
- **View & Track** - Monitor all active and paid tickets in real-time
- **Mark as Paid** - Process payments with automatic fine calculation for overstays
- **Delete Tickets** - Remove tickets with confirmation dialogs
- **Print Receipts** - Generate printable parking receipts

### 👮 Officer Portal

- **Secure Authentication** - Email/password and Google OAuth login
- **Dashboard Overview** - Quick stats, recent activity, and role-based navigation
- **Ticket Filtering** - Search and filter tickets by status, date, or vehicle
- **Real-time Updates** - Live ticket status changes

### 🎟️ Monthly Passes

- **Pass Management** - Create, edit, and delete monthly parking passes
- **Status Tracking** - Active, expired, and cancelled pass states
- **Auto-detection** - Automatic pass holder recognition during ticket creation
- **Pass Validation** - Check pass validity by vehicle number

### 🗺️ Smart Parking Map

- **Visual Slot Selection** - Interactive parking map with section grouping
- **Occupancy Display** - Real-time occupied/available slot indicators
- **Vehicle Type Filtering** - Filter slots by compatible vehicle types (Car, Bike, Truck)
- **Legend & Status** - Clear visual indicators for slot states

### 📊 Revenue Analytics

- **Revenue Charts** - Beautiful bar charts showing daily earnings
- **Today's Revenue** - Track current day earnings
- **Total Revenue** - Cumulative earnings overview
- **7-Day Trends** - Visual representation of recent performance

### ⚙️ Admin Configuration

- **Rate Management** - Configure hourly rates for different vehicle types
- **Dynamic Pricing** - Add, update, or remove vehicle rate categories
- **Slot Configuration** - Manage parking slots and sections

### 🔍 Public Status Check

- **Vehicle Search** - Check parking status by license plate number
- **Live Bill Calculation** - Real-time bill with overdue charges
- **No Login Required** - Public access for customers

### 🎨 Modern UI/UX

- **Dark/Light Theme** - Toggle between themes with smooth animations
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Animations** - Framer Motion powered smooth transitions
- **Glassmorphism** - Modern design with backdrop blur effects
- **Spotlight Cards** - Interactive hover effects on feature cards

---

## 🛠️ Tech Stack

| Category           | Technology                                                                  |
| ------------------ | --------------------------------------------------------------------------- |
| **Framework**      | [Next.js 16](https://nextjs.org/) (App Router)                              |
| **Language**       | JavaScript / TypeScript                                                     |
| **Styling**        | [Tailwind CSS v4](https://tailwindcss.com/)                                 |
| **UI Components**  | Custom components with [Lucide Icons](https://lucide.dev/)                  |
| **Charts**         | [Recharts](https://recharts.org/)                                           |
| **Animations**     | [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/) |
| **Backend & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + Auth)                       |
| **Utilities**      | `clsx`, `tailwind-merge`                                                    |
| **Deployment**     | [Vercel](https://vercel.com/)                                               |

---

## 📁 Project Structure

```
parking-ticket-system/
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin pages
│   │   ├── analytics/            # Revenue analytics dashboard
│   │   └── rates/                # Parking rate configuration
│   ├── dashboard/                # Main dashboard with role selection
│   ├── officer/                  # Officer ticket management portal
│   ├── passes/                   # Monthly passes management
│   ├── status/                   # Public status check page
│   ├── tickets/                  # Ticket related pages
│   │   ├── create/               # Create new ticket
│   │   └── [id]/                 # Individual ticket view
│   ├── globals.css               # Global styles & Tailwind config
│   ├── layout.js                 # Root layout with providers
│   └── page.js                   # Landing page
│
├── components/                   # Reusable React components
│   ├── auth/                     # Authentication components
│   │   └── LoginModal.js         # Login/Register modal
│   ├── ui/                       # UI primitives
│   │   ├── Button.js             # Button component
│   │   ├── Card.js               # Card component
│   │   ├── Input.js              # Input component
│   │   └── ReactBits.jsx         # Animation components
│   ├── ClientLayout.js           # Client-side layout wrapper
│   ├── Navbar.js                 # Navigation bar
│   ├── ParkingMap.js             # Visual parking slot map
│   ├── RevenueChart.js           # Revenue bar chart
│   └── TicketReceipt.js          # Printable ticket receipt
│
├── lib/                          # Utilities and helpers
│   ├── constants.js              # App-wide constants
│   ├── supabase.js               # Supabase client setup
│   ├── ThemeContext.js           # Theme provider
│   └── utils.js                  # Utility functions
│
├── public/                       # Static assets
│   └── logo2.png                 # App logo
│
├── supabase_schema.sql           # Database schema
├── dummy_data.sql                # Sample data for testing
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
   # or
   yarn install
   ```

3. **Set up Supabase**

   - Create a new project at [supabase.com](https://supabase.com/)
   - Go to SQL Editor and run the schema from `supabase_schema.sql`
   - (Optional) Run `dummy_data.sql` for sample data

4. **Configure environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open in browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Schema

The application uses the following main tables:

| Table            | Description                                            |
| ---------------- | ------------------------------------------------------ |
| `tickets`        | Parking tickets with vehicle info, pricing, and status |
| `parking_rates`  | Hourly rates for different vehicle types               |
| `parking_slots`  | Available parking slots with sections                  |
| `monthly_passes` | Monthly pass holder information                        |

See [`supabase_schema.sql`](./supabase_schema.sql) for complete schema with RLS policies.

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
// Configurable pricing constants
PRICING = {
  DEFAULT_HOURLY_RATE: 20, // ₹20 per hour
  OVERDUE_BASE_FINE: 50, // ₹50 base penalty
  OVERDUE_HOURLY_FINE: 20, // ₹20 per extra hour
}
```

### Ticket Status Flow

```
Active → Overdue (if time exceeded) → Paid
```

### Monthly Pass Benefits

- Free parking during validity period
- Auto-detected during ticket creation
- Visual badge on status check

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

---

<p align="center">
  Made with ❤️ for modern parking management
</p>
