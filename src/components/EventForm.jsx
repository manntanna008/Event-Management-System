import React, { useState } from 'react';
import {
  AlertCircle,
  IndianRupee,
} from 'lucide-react';

import { CATEGORIES } from '../data/event';

const emptyForm = {
  title: '',
  category: 'Conference',
  date: new Date().toISOString().slice(0, 10),
  time: '10:00',
  location: '',
  capacity: 50,
  price: 999,
  description: '',
};

export default function EventForm({
  initial,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(
    initial
      ? {
          ...emptyForm,
          ...initial,
        }
      : emptyForm
  );

  const [error, setError] = useState('');

  // ===============================
  // INPUT CHANGE
  // ===============================

  const set = (key) => (e) => {
    setForm({
      ...form,
      [key]: e.target.value,
    });

    setError('');
  };


  // ===============================
  // FORM SUBMIT
  // ===============================

  const submit = (e) => {
    e.preventDefault();

    // Title validation
    if (!form.title.trim()) {
      setError(
        'Please enter an event title.'
      );
      return;
    }

    // Location validation
    if (!form.location.trim()) {
      setError(
        'Please enter an event location.'
      );
      return;
    }

    // Capacity validation
    if (
      !form.capacity ||
      Number(form.capacity) <= 0
    ) {
      setError(
        'Capacity must be a positive number.'
      );
      return;
    }

    // Price validation
    if (
      form.price === '' ||
      Number(form.price) < 0
    ) {
      setError(
        'Price cannot be negative.'
      );
      return;
    }

    setError('');

    const eventData = {
      ...form,

      capacity: Number(
        form.capacity
      ),

      price: Number(
        form.price
      ),

      attendees:
        initial?.attendees || [],
    };

    onSubmit(eventData);

    // Reset after creating new event
    if (!initial) {
      setForm({
        ...emptyForm,
        date: new Date()
          .toISOString()
          .slice(0, 10),
      });
    }
  };


  return (
    <form
      className="event-form"
      onSubmit={submit}
    >

      {/* HEADER */}

      <div className="event-form-header">

        <div>

          <span className="form-kicker">
            {initial
              ? 'EDIT EVENT'
              : 'NEW EVENT'}
          </span>

          <h2>
            {initial
              ? 'Update your event'
              : 'Create something memorable'}
          </h2>

          <p>
            Add the details attendees need
            to know.
          </p>

        </div>

      </div>


      {/* FORM GRID */}

      <div className="event-form-grid">

        {/* TITLE */}

        <div className="field field-full">

          <label>
            Event Title
          </label>

          <input
            type="text"
            value={form.title}
            onChange={set('title')}
            placeholder="e.g. Gujarat Tech Summit 2026"
          />

        </div>


        {/* CATEGORY */}

        <div className="field">

          <label>
            Category
          </label>

          <select
            value={form.category}
            onChange={set('category')}
          >

            {Object.keys(CATEGORIES).map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}

          </select>

        </div>


        {/* CAPACITY */}

        <div className="field">

          <label>
            Capacity
          </label>

          <input
            type="number"
            min="1"
            value={form.capacity}
            onChange={set('capacity')}
            placeholder="50"
          />

        </div>


        {/* PRICE */}

        <div className="field">

          <label>
            Ticket Price
          </label>

          <div className="input-with-icon">

            <IndianRupee size={16} />

            <input
              type="number"
              min="0"
              value={form.price}
              onChange={set('price')}
              placeholder="999"
            />

          </div>

          <small>
            Enter 0 for a free event.
          </small>

        </div>


        {/* DATE */}

        <div className="field">

          <label>
            Date
          </label>

          <input
            type="date"
            value={form.date}
            onChange={set('date')}
          />

        </div>


        {/* TIME */}

        <div className="field">

          <label>
            Time
          </label>

          <input
            type="time"
            value={form.time}
            onChange={set('time')}
          />

        </div>


        {/* LOCATION */}

        <div className="field field-full">

          <label>
            Location
          </label>

          <input
            type="text"
            value={form.location}
            onChange={set('location')}
            placeholder="Venue or address"
          />

        </div>


        {/* DESCRIPTION */}

        <div className="field field-full">

          <label>
            Description
          </label>

          <textarea
            value={form.description}
            onChange={set('description')}
            placeholder="Tell attendees what this event is about..."
            rows="5"
          />

        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="form-error">

          <AlertCircle size={16} />

          <span>
            {error}
          </span>

        </div>
      )}


      {/* ACTIONS */}

      <div className="event-form-actions">

        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="btn btn-primary"
        >

          {initial
            ? 'Save Changes'
            : 'Create Event'}

        </button>

      </div>

    </form>
  );
}