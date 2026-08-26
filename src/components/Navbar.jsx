import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Ticket, Menu, X, Bell } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/events', label: 'Events' },
    { to: '/admin', label: 'Manage' },
    { to: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          <div className="brand-mark"><Ticket size={19} /></div>
          <div>
            <span className="navbar-brand-title">GATEWAY</span>
            <span className="navbar-brand-sub">EVENT STUDIO</span>
          </div>
        </NavLink>

        <nav className={`navbar-links ${open ? 'is-open' : ''}`}>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `navbar-link ${isActive ? 'is-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="nav-icon"><Bell size={17} /></button>
          <button className="navbar-toggle" onClick={() => setOpen(v => !v)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}