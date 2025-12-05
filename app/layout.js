import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Parking Ticket System",
    description: "Officer Dashboard for Parking Management",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.className} min-h-screen bg-gray-50 text-gray-900 antialiased`}>
                <Navbar />
                <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    {children}
                </main>
            </body>
        </html>
    );
}
