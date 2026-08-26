import React from 'react';
import { ArrowUpRight, CalendarDays, CircleDollarSign, Ticket, Users, TrendingUp } from 'lucide-react';
import { getEvents } from '../data/event';

export default function Dashboard() {
  const events = getEvents();
  const registrations = events.reduce((s, e) => s + e.attendees.length, 0);
  const capacity = events.reduce((s, e) => s + Number(e.capacity), 0);
  const fill = capacity ? Math.round(registrations / capacity * 100) : 0;

  const bars = [38, 52, 44, 68, 61, 82, 74, 92, 79, 96, 88, 100];

  return (
    <section>
      <div className="dashboard-head">
        <div><span className="section-kicker">ORGANIZER STUDIO</span><h1>Good morning, Admin <span>✦</span></h1><p>Here is your event performance at a glance.</p></div>
        <button className="btn btn-primary">Download Report <ArrowUpRight size={15}/></button>
      </div>

      <div className="stat-grid advanced-stats">
        <div className="stat-card-light"><div className="stat-top"><span>Total events</span><span className="stat-icon"><CalendarDays size={17}/></span></div><strong>{events.length}</strong><small><TrendingUp size={12}/> 18% vs last month</small></div>
        <div className="stat-card-light"><div className="stat-top"><span>Registrations</span><span className="stat-icon"><Users size={17}/></span></div><strong>{registrations}</strong><small><TrendingUp size={12}/> 24% vs last month</small></div>
        <div className="stat-card-light"><div className="stat-top"><span>Ticket value</span><span className="stat-icon"><CircleDollarSign size={17}/></span></div><strong>₹4.8L</strong><small><TrendingUp size={12}/> 12% vs last month</small></div>
        <div className="stat-card dark-stat"><div className="stat-top"><span>Attendance rate</span><span className="stat-icon"><Ticket size={17}/></span></div><strong>{fill}%</strong><small>Across all events</small></div>
      </div>

      <div className="dashboard-grid">
        <div className="panel chart-panel">
          <div className="panel-head"><div><span className="section-kicker">PERFORMANCE</span><h2>Registration activity</h2></div><select><option>Last 12 months</option></select></div>
          <div className="chart"><div className="chart-y"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="bars">{bars.map((v,i)=><div className="bar-wrap" key={i}><div className="bar" style={{height:`${v}%`}}></div><small>{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</small></div>)}</div></div>
        </div>

        <div className="panel">
          <div className="panel-head"><div><span className="section-kicker">UP NEXT</span><h2>Upcoming events</h2></div></div>
          <div className="mini-events">{events.slice(0,4).map(e => <div className="mini-event" key={e.id}><div className="mini-date"><strong>{e.date.slice(8,10)}</strong><small>{e.date.slice(5,7)}</small></div><div><strong>{e.title}</strong><small>{e.location}</small></div><span>{e.attendees.length}/{e.capacity}</span></div>)}</div>
        </div>
      </div>

      <div className="panel category-panel">
        <div className="panel-head"><div><span className="section-kicker">AUDIENCE</span><h2>Event mix</h2></div></div>
        <div className="mix-grid">{[...new Set(events.map(e=>e.category))].map((cat,i)=>{const count=events.filter(e=>e.category===cat).length;return <div className="mix-item" key={cat}><div><strong>{cat}</strong><span>{count} event{count!==1?'s':''}</span></div><div className="mix-track"><div style={{width:`${Math.max(18,count/events.length*100)}%`}}/></div></div>})}</div>
      </div>
    </section>
  );
}