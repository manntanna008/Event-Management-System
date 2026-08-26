import React from 'react';
import { Ticket } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Ticket size={16} />
          <span>GATEWAY</span>
        </div>
        <div className="footer-note">
          Built for organizers who'd rather be running the event than chasing spreadsheets.
        </div>
        <div className="footer-copy">
          © {new Date().getFullYear()} Gateway Event Ops
        </div>
      </div>
    </footer>
  );
}