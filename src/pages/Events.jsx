import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import EventCard from '../components/EventCard';
import { getEvents } from '../data/event';

export default function Events() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const events = getEvents();
  const categories = ['All', ...new Set(events.map(e => e.category))];

  const filtered = useMemo(() => events.filter(e => {
    const text = `${e.title} ${e.location} ${e.category}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (category === 'All' || e.category === category);
  }), [events, query, category]);

  return (
    <section>
      <div className="page-hero">
        <div><span className="section-kicker"><Sparkles size={12}/> DISCOVER</span><h1>Find your next experience.</h1><p>Browse workshops, conferences, seminars and more.</p></div>
        <div className="result-pill">{filtered.length} events</div>
      </div>

      <div className="filter-bar">
        <div className="search-box advanced-search"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by event, venue or category..." /></div>
        <div className="category-pills">{categories.map(c => <button key={c} className={category === c ? 'category-pill active' : 'category-pill'} onClick={() => setCategory(c)}>{c}</button>)}</div>
        <button className="filter-icon"><SlidersHorizontal size={17}/></button>
      </div>

      {filtered.length ? <div className="event-grid">{filtered.map(event => <EventCard key={event.id} event={event}/>)}</div> : <div className="empty modern-empty"><Search size={30}/><h3>No matching events</h3><p>Try a different search or category.</p></div>}
    </section>
  );
}