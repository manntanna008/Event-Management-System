import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Clock,
  MapPin,
  Users,
  IndianRupee,
} from 'lucide-react';

import { CATEGORIES } from '../data/event';

function fmtDate(dateStr) {
  return new Date(
    dateStr + 'T00:00:00'
  ).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function EventCard({ event }) {
  const color =
    CATEGORIES[event.category] || '#8A8578';

  const attendees = event.attendees || [];

  const pct = event.capacity
    ? Math.min(
        100,
        Math.round(
          (attendees.length / event.capacity) * 100
        )
      )
    : 0;

  const full =
    attendees.length >= event.capacity;

  const price =
    Number(event.price ?? 0);

  return (
    <article className="event-card advanced-card">

      {/* EVENT IMAGE / VISUAL */}

      <div
        className="event-visual"
        style={{
          '--event-color': color,
        }}
      >

        <div className="visual-grid" />

        <span className="visual-number">
          #{event.id}
        </span>

        <span className="event-category">
          {event.category}
        </span>

        {full && (
          <span className="sold-badge">
            SOLD OUT
          </span>
        )}

        <div className="visual-symbol">
          ✦
        </div>

      </div>


      {/* CARD BODY */}

      <div className="event-card-body">

        {/* DATE + PRICE */}

        <div className="event-card-date-row">

          <span>
            {fmtDate(event.date)}
          </span>

          <span className="event-card-time">
            <Clock size={12} />
            {event.time}
          </span>

        </div>


        {/* TITLE */}

        <h3 className="event-card-title">
          {event.title}
        </h3>


        {/* LOCATION */}

        <div className="event-card-loc">

          <MapPin size={13} />

          {event.location}

        </div>


        {/* PRICE */}

        <div className="event-price-row">

          <div className="event-price">

            {price === 0 ? (
              <span className="free-price">
                FREE
              </span>
            ) : (
              <>
                <IndianRupee size={14} />
                {price.toLocaleString('en-IN')}
              </>
            )}

          </div>

          <span className="price-label">
            per person
          </span>

        </div>


        {/* CAPACITY */}

        <div className="cap-row">

          <div className="cap-bar-wrap">

            <div
              className="cap-bar-fill"
              style={{
                width: `${pct}%`,
                background: color,
              }}
            />

          </div>

          <span>
            {pct}%
          </span>

        </div>


        {/* FOOTER */}

        <div className="event-card-footer">

          <span className="event-card-cap">

            <Users size={12} />

            {attendees.length} / {event.capacity}

          </span>

          <Link
            to={`/events/${event.id}`}
            className="event-arrow"
          >
            <ArrowUpRight size={17} />
          </Link>

        </div>

      </div>

    </article>
  );
}