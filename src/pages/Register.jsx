import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  CalendarDays,
  Clock,
  MapPin,
} from 'lucide-react';

import { getEvents, saveEvents } from '../data/event';

export default function Register() {
  const { id } = useParams();
  const navigate = useNavigate();

  const events = getEvents();

  const event = events.find(
    (item) => String(item.id) === String(id)
  );

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!event) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h2>Event not found</h2>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/events')}
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const seatsLeft =
    Number(event.capacity || 0) -
    Number(event.attendees?.length || 0);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (!form.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!form.email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!form.phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    if (seatsLeft <= 0) {
      setError('Sorry, this event is already full.');
      return;
    }

    setLoading(true);

    try {
     const response = await fetch(
  'https://event-management-system-bs6b.onrender.com/api/register',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            eventId: event.id,
            eventTitle: event.title,
            name: form.name,
            email: form.email,
            phone: form.phone,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Registration failed.'
        );
      }

      // Update local event attendee count
      const updatedEvents = events.map((item) => {
        if (String(item.id) === String(event.id)) {
          return {
            ...item,
            attendees: [
              ...(item.attendees || []),
              {
                name: form.name,
                email: form.email,
                phone: form.phone,
              },
            ],
          };
        }

        return item;
      });

      saveEvents(updatedEvents);

      setSuccess(true);

    } catch (err) {
      console.error(
        'Registration error:',
        err
      );

      setError(
        err.message ||
          'Unable to connect to the server.'
      );

    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-container">

        <div className="success-card">

          <div className="success-icon">
            <CheckCircle size={52} />
          </div>

          <span className="form-kicker">
            REGISTRATION CONFIRMED
          </span>

          <h1>
            You're registered! 🎉
          </h1>

          <p>
            Your registration for
            <strong> {event.title}</strong>
            {' '}has been confirmed.
          </p>

          <div className="success-details">

            <div>
              <Mail size={18} />
              <span>{form.email}</span>
            </div>

            <div>
              <Phone size={18} />
              <span>{form.phone}</span>
            </div>

          </div>

          <p className="success-note">
            A confirmation email and SMS will
            be sent to your registered contact
            details.
          </p>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(`/events/${event.id}`)
            }
          >
            Back to Event
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="page-container">

      <div className="registration-layout">

        {/* LEFT SIDE */}

        <div className="registration-main">

          <div className="event-summary-card">

            <div className="event-summary-icon">
              <CalendarDays size={28} />
            </div>

            <div>

              <span className="event-category">
                {event.category}
              </span>

              <h2>
                {event.title}
              </h2>

              <div className="event-meta">

                <span>
                  <CalendarDays size={14} />
                  {event.date}
                </span>

                <span>
                  <Clock size={14} />
                  {event.time}
                </span>

                <span>
                  <MapPin size={14} />
                  {event.location}
                </span>

              </div>

            </div>

          </div>


          <div className="registration-card">

            <div className="registration-heading">

              <div>
                <span className="form-kicker">
                  REGISTRATION
                </span>

                <h1>
                  Your information
                </h1>

                <p>
                  Enter your details carefully.
                </p>
              </div>

              <ShieldCheck
                size={28}
                className="heading-icon"
              />

            </div>


            <form
              onSubmit={handleSubmit}
              className="registration-form"
            >

              {/* NAME */}

              <div className="form-field">

                <label>
                  Full Name
                </label>

                <div className="input-box">

                  <User size={19} />

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="form-field">

                <label>
                  Email Address
                </label>

                <div className="input-box">

                  <Mail size={19} />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />

                </div>

              </div>


              {/* PHONE */}

              <div className="form-field">

                <label>
                  Phone Number
                </label>

                <div className="input-box">

                  <Phone size={19} />

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />

                </div>

              </div>


              {/* ERROR */}

              {error && (
                <div className="registration-error">
                  {error}
                </div>
              )}


              {/* BUTTON */}

              <button
                type="submit"
                className="register-submit"
                disabled={loading}
              >

                {loading
                  ? 'Processing...'
                  : 'Confirm Registration'}

                {!loading && (
                  <ArrowRight size={20} />
                )}

              </button>

              <div className="secure-note">

                <ShieldCheck size={15} />

                Your information is securely
                stored and a confirmation email
                will be sent.

              </div>

            </form>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <aside className="registration-sidebar">

          <div className="price-card">

            <span>
              TICKET PRICE
            </span>

            <strong>
              ₹{Number(event.price || 0).toLocaleString('en-IN')}
            </strong>

            <small>
              per person
            </small>

          </div>


          <div className="availability-card">

            <span>
              AVAILABILITY
            </span>

            <h3>
              {seatsLeft} seats left
            </h3>

            <div className="availability-bar">

              <div
                style={{
                  width: `${
                    event.capacity
                      ? Math.min(
                          100,
                          ((event.attendees?.length || 0) /
                            event.capacity) *
                            100
                        )
                      : 0
                  }%`,
                }}
              />

            </div>

            <small>
              {event.attendees?.length || 0} of{' '}
              {event.capacity} seats booked
            </small>

          </div>


          <div className="included-card">

            <span>
              INCLUDED
            </span>

            <h3>
              Your registration includes
            </h3>

            <div>
              <CheckCircle size={17} />
              Event access
            </div>

            <div>
              <CheckCircle size={17} />
              Networking opportunities
            </div>

            <div>
              <CheckCircle size={17} />
              Full event experience
            </div>

          </div>

        </aside>

      </div>

    </div>
  );
}