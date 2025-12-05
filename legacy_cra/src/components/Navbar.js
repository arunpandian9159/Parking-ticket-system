import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path === '/tickets') {
      return location.pathname === '/tickets';
    }
    if (path === '/tickets/create') {
      return location.pathname === '/tickets/create';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/tickets', label: 'Tickets', icon: '🎫' },
    { path: '/tickets/create', label: 'Create Ticket', icon: '➕' },
    { path: '/officers', label: 'Officers', icon: '👮' },
    { path: '/vehicles', label: 'Vehicles', icon: '🚗' }
  ];

  return (
    <nav className="navbar bg-white-90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray">
      <div className="navbar-container max-w-[1200px] mx-auto px-4 flex justify-between items-center h-16">
        <Link to="/" className="navbar-brand flex items-center gap-2 text-xl font-bold text-gray-800 no-underline hover:text-primary transition-colors">
          <span className="text-2xl">🚗</span>
          Parking Ticket System
        </Link>
        <ul className="navbar-nav flex gap-6 m-0 p-0 list-none items-center">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all no-underline ${isActive(item.path)
                    ? 'bg-primary text-white shadow-md'
                    : 'text-secondary hover:bg-blue-50 hover:text-primary'
                  }`}
                title={item.label}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
