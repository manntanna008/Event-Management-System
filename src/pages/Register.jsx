import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ArrowLeft, Ticket } from 'lucide-react';
import { getEventById, addAttendee } from '../data/event.js';
import './Register.css';

export default function Register() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEvent(getEventById(id));
  }, [id]);

  if (!event) {
    return (
      <div className="empty">
        <Ticket size={26} color="#C9C2AE" />
        <p>That event doesn't exist, or was removed.</p>
      </div>
    );
  }

  const full = event.attendees.length >= event.capacity;

  const submit = async (e) => {
    e.preventDefault();

    if (full) {
      return setError('This event has reached capacity.');
    }

    if (!name.trim()) {
      return setError('Enter your name.');
    }

    if (!email.trim() || !email.includes('@')) {
      return setError('Enter a valid email.');
    }

    if (!phone.trim()) {
      return setError('Enter your phone number.');
    }

    if (!/^[0-9]{10}$/.test(phone.trim())) {
      return setError('Enter a valid 10-digit phone number.');
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          eventTitle: event.title,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Registration email could not be sent.'
        );
      }

      // Save attendee only after email is successfully sent
      addAttendee(event.id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      setSuccess(true);

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="register-page">
        <div className="success-card">
          <CheckCircle2 size={32} color="#2E7D6B" />

          <h2>You're registered</h2>

          <p>
            A confirmation email has been sent to{' '}
            <strong>{email}</strong>.
          </p>

          <p>
            A spot at <strong>{event.title}</strong> is yours —{' '}
            {event.date} at {event.time}, {event.location}.
          </p>

          <div
            className="hero-actions"
            style={{ justifyContent: 'center' }}
          >
            <Link
              to={`/events/${event.id}`}
              className="btn btn-secondary"
            >
              Back to Event
            </Link>

            <Link
              to="/events"
              className="btn btn-primary"
            >
              Browse More Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">

      <button
        className="back-link"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div className="register-card">

        <div className="register-header">

          <div className="register-eyebrow">
            REGISTER
          </div>

          <h1>{event.title}</h1>

          <p>
            {event.date} · {event.time} · {event.location}
          </p>

          <p className="register-cap">
            {event.attendees.length} / {event.capacity} spots filled
          </p>

        </div>

        <form
          className="event-form"
          onSubmit={submit}
        >

          {/* NAME */}

          <div className="field field-full">

            <label>Full name</label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              disabled={full || loading}
            />

          </div>


          {/* EMAIL */}

          <div className="field field-full">

            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={full || loading}
            />

          </div>


          {/* PHONE */}

          <div className="field field-full">

            <label>Phone Number</label>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter 10-digit phone number"
              maxLength="10"
              disabled={full || loading}
            />

          </div>


          {/* ERROR */}

          {error && (
            <div className="form-error">

              <AlertCircle size={14} />

              {error}

            </div>
          )}


          {full && (
            <div className="form-error">

              <AlertCircle size={14} />

              This event is at capacity.

            </div>
          )}


          {/* BUTTON */}

          <div className="event-form-actions">

            <button
              type="submit"
              className="btn btn-primary"
              disabled={full || loading}
            >

              {loading
                ? 'Sending Confirmation...'
                : 'Confirm Registration'}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}