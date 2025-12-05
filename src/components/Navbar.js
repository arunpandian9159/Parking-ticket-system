'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Ticket, PlusCircle, Users, Car } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    if (path === '/tickets/create') return pathname === '/tickets/create';
    if (path === '/tickets') {
      return pathname.startsWith('/tickets') && pathname !== '/tickets/create';
    }
    return pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tickets', label: 'Tickets', icon: Ticket },
    { path: '/tickets/create', label: 'New Ticket', icon: PlusCircle },
    { path: '/officers', label: 'Officers', icon: Users },
    { path: '/vehicles', label: 'Vehicles', icon: Car }
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          <div className={styles.logoIcon}>
            <Car size={24} className="text-primary-600" />
          </div>
          <span>Parking Ticket System</span>
        </Link>
        <ul className={styles.nav}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <li key={item.path} className={styles.navItem}>
                <Link
                  href={item.path}
                  className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                  title={item.label}
                >
                  <span className={styles.navIcon}>
                    <Icon size={18} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
