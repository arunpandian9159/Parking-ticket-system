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
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Parking Ticket System
        </Link>
        <ul className="navbar-nav">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link 
                to={item.path} 
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
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
