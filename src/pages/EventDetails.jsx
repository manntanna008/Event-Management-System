import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  IndianRupee,
  CheckCircle2,
} from 'lucide-react';

import { getEvents, CATEGORIES } from '../data/event';

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  );
}

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const events = getEvents();

  const event = events.find(
    (item) => String(item.id) === String(id)
  );

  if (!event) {
    return (
      <div className="details-not-found">
        <h2>Event not found</h2>

        <p>
          The event you're looking for doesn't exist.
        </p>

        <Link to="/events" className="btn btn-primary">
          Back to Events
        </Link>
      </div>
    );
  }

  const color =
    CATEGORIES[event.category] || '#ff5a45';

  const attendees = event.attendees || [];

  const capacity = Number(event.capacity) || 0;

  const bookedPercentage = capacity
    ? Math.min(
        100,
        Math.round(
          (attendees.length / capacity) * 100
        )
      )
    : 0;

  const seatsLeft = Math.max(
    0,
    capacity - attendees.length
  );

  const isSoldOut = seatsLeft === 0;

  const price = Number(event.price ?? 0);

  return (
    <div className="event-details-page">

      {/* BACK */}

      <button
        className="details-back"
        onClick={() => navigate('/events')}
      >
        <ArrowLeft size={16} />
        Back to Events
      </button>


      {/* HERO */}

      <section
        className="details-hero"
        style={{
          '--details-color': color,
        }}
      >

        <div className="details-pattern" />

        <div className="details-hero-content">

          <div className="details-category">
            {event.category}
          </div>

          <h1>{event.title}</h1>

          <p className="details-hero-description">
            {event.description ||
              'Join us for an exciting and memorable event experience.'}
          </p>

          <div className="details-hero-meta">

            <span>
              <CalendarDays size={15} />
              {formatDate(event.date)}
            </span>

            <span>
              <Clock size={15} />
              {event.time}
            </span>

            <span>
              <MapPin size={15} />
              {event.location}
            </span>

          </div>

        </div>


        {/* HERO PRICE CARD */}

        <div className="details-ticket">

          <div className="ticket-label">
            EVENT PASS
          </div>

          <div className="details-ticket-symbol">
            ✦
          </div>

          <div className="details-ticket-line" />

          <small>
            TICKET PRICE
          </small>

          <strong>
            {price === 0
              ? 'FREE'
              : `₹${price.toLocaleString('en-IN')}`}
          </strong>

          {price !== 0 && (
            <span>per person</span>
          )}

        </div>

      </section>


      {/* INFORMATION */}

      <section className="details-info-grid">

        {/* DATE */}

        <div className="details-info-card">

          <div className="details-info-icon orange">
            <CalendarDays size={19} />
          </div>

          <div>
            <small>DATE</small>
            <strong>
              {new Date(
                event.date + 'T00:00:00'
              ).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </strong>
          </div>

        </div>


        {/* TIME */}

        <div className="details-info-card">

          <div className="details-info-icon purple">
            <Clock size={19} />
          </div>

          <div>
            <small>TIME</small>
            <strong>{event.time}</strong>
          </div>

        </div>


        {/* LOCATION */}

        <div className="details-info-card">

          <div className="details-info-icon green">
            <MapPin size={19} />
          </div>

          <div>
            <small>LOCATION</small>
            <strong>{event.location}</strong>
          </div>

        </div>


        {/* SEATS */}

        <div className="details-info-card">

          <div className="details-info-icon blue">
            <Users size={19} />
          </div>

          <div>
            <small>AVAILABILITY</small>
            <strong>
              {isSoldOut
                ? 'Sold Out'
                : `${seatsLeft} seats left`}
            </strong>
          </div>

        </div>

      </section>


      {/* MAIN CONTENT */}

      <section className="details-content-grid">

        {/* DESCRIPTION */}

        <div className="details-description-card">

          <div className="details-section-label">
            ABOUT THE EVENT
          </div>

          <h2>
            Everything you need to know.
          </h2>

          <p>
            {event.description ||
              `Welcome to ${event.title}. This event is designed to provide attendees with an engaging and valuable experience. Come connect with people, learn something new and enjoy the experience.`}
          </p>

          <div className="details-highlights">

            <div>
              <CheckCircle2 size={17} />
              Professional experience
            </div>

            <div>
              <CheckCircle2 size={17} />
              Interactive sessions
            </div>

            <div>
              <CheckCircle2 size={17} />
              Networking opportunities
            </div>

          </div>

        </div>


        {/* BOOKING CARD */}

        <div className="details-book-card">

          <div className="details-section-label">
            YOUR EVENT PASS
          </div>

          <h3>
            Reserve your seat.
          </h3>

          <div className="booking-price">

            <div>

              <small>
                TICKET PRICE
              </small>

              <strong>
                {price === 0
                  ? 'FREE'
                  : `₹${price.toLocaleString('en-IN')}`}
              </strong>

            </div>

            <IndianRupee size={22} />

          </div>


          {/* PROGRESS */}

          <div className="booking-progress-header">

            <span>
              Seats booked
            </span>

            <strong>
              {attendees.length}/{capacity}
            </strong>

          </div>

          <div className="booking-progress">

            <div
              style={{
                width: `${bookedPercentage}%`,
              }}
            />

          </div>

          <small className="booking-note">
            {isSoldOut
              ? 'This event is currently sold out.'
              : `Only ${seatsLeft} seats remaining.`}
          </small>


          {isSoldOut ? (

            <button
              className="details-register-btn disabled"
              disabled
            >
              Sold Out
            </button>

          ) : (

            <Link
              to={`/events/${event.id}/register`}
              className="details-register-btn"
            >
              Register Now
              <ArrowRight size={17} />
            </Link>

          )}

        </div>

      </section>

    </div>
  );
}