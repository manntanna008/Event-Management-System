import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Sparkles, Users, Zap } from 'lucide-react';
import EventCard from '../components/EventCard';
import { getEvents } from '../data/event';

export default function Home() {
  const events = getEvents();
  const featured = events.slice(0, 3);

  return (
    <>
      <section className="hero-advanced">
        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />
        <div className="hero-content">
          <div className="hero-eyebrow"><Sparkles size={14} /> THE MODERN EVENT PLATFORM</div>
          <h1>CREATE EVENTS<br /><span>PEOPLE REMEMBER.</span></h1>
          <p>Plan, promote and manage unforgettable experiences from one beautiful workspace.</p>
          <div className="hero-actions">
            <Link to="/events" className="btn btn-primary btn-large"><CalendarDays size={17} /> Explore Events</Link>
            <Link to="/admin" className="btn btn-glass">Create an Event <ArrowRight size={16} /></Link>
          </div>
          <div className="hero-trust">
            <div className="avatar-stack"><span>MK</span><span>AP</span><span>RS</span><span>+</span></div>
            <div><strong>2,480+</strong> attendees managed this season</div>
          </div>
        </div>
        <div className="hero-ticket">
          <div className="ticket-top"><span>GATEWAY</span><span>LIVE EVENT</span></div>
          <div className="ticket-art">✦</div>
          <div className="ticket-main"><small>FEATURED EXPERIENCE</small><h3>Future Forward</h3><p>Technology · Design · Ideas</p></div>
          <div className="ticket-meta"><span>20 AUG</span><span>AHMEDABAD</span></div>
        </div>
      </section>

      <section className="metric-strip">
        <div><span className="metric-icon"><CalendarDays size={18}/></span><strong>86</strong><small>Events created</small></div>
        <div><span className="metric-icon"><Users size={18}/></span><strong>2.4K</strong><small>Attendees</small></div>
        <div><span className="metric-icon"><Zap size={18}/></span><strong>92%</strong><small>Avg. attendance</small></div>
        <div><span className="metric-icon"><Sparkles size={18}/></span><strong>4.9/5</strong><small>Experience score</small></div>
      </section>

      <section className="section featured-section">
        <div className="section-header">
          <div><span className="section-kicker">CURATED FOR YOU</span><h2 className="section-heading-large">Upcoming experiences</h2></div>
          <Link to="/events" className="section-link">View all events <ArrowRight size={14}/></Link>
        </div>
        <div className="event-grid">{featured.map(event => <EventCard key={event.id} event={event} />)}</div>
      </section>

      <section className="promo-panel">
        <div><span className="section-kicker">FOR ORGANIZERS</span><h2>Turn your next idea into a full room.</h2><p>Create, edit and track registrations without spreadsheets.</p></div>
        <Link to="/admin" className="btn btn-primary">Open Organizer Studio <ArrowRight size={15}/></Link>
      </section>
    </>
  );
}