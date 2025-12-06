# Parking Ticket System

A comprehensive web application for managing parking tickets, officer operations, and vehicle tracking. Built with modern web technologies to ensure performance, scalability, and a premium user experience.

## Deployed website
https://parking-ticket-system.vercel.app/

## 🚀 Key Features

*   **Dashboard Overview**: Real-time insights into issued tickets and recent activities.
*   **Ticket Management**: Efficiently create, view, and manage parking tickets.
*   **Officer Portal**: Secure login and management interface for parking officers.
*   **Vehicle Tracking**: Record and monitor vehicle information including license plates and descriptions.
*   **Modern UI/UX**: A responsive and accessible interface designed with Tailwind CSS v4 and Lucide icons.
*   **Real-time Database**: Powered by Supabase for instant data synchronization.

## 🛠️ Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Language**: JavaScript / TypeScript
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Backend & Auth**: [Supabase](https://supabase.com/)
*   **Utilities**: `clsx`, `tailwind-merge`

## ⚙️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm or yarn
*   A Supabase account 

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/arunpandian9159/Parking-ticket-system.git
    cd Parking-ticket-system
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables**

    Create a `.env.local` file in the root directory and add your Supabase credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗄️ Database Setup

This project requires specific tables in your Supabase database (`officers`, `vehicles`, `parking_tickets`). Ensure you have applied the necessary SQL schema and Row Level Security (RLS) policies.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
