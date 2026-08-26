import React, { useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  CalendarDays,
  Ticket,
  TrendingUp,
  X,
  MapPin,
  Clock,
  MoreHorizontal
} from 'lucide-react';

import EventForm from '../components/EventForm';
import { getEvents, saveEvents } from '../data/event';

export default function Admin() {
  const [events, setEvents] = useState(getEvents);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const refreshEvents = (newEvents) => {
    setEvents(newEvents);
    saveEvents(newEvents);
  };

  // CREATE EVENT
  const createEvent = (data) => {
    const newEvent = {
      ...data,
      id: Date.now().toString(),
      attendees: []
    };

    refreshEvents([...events, newEvent]);
    setShowForm(false);
  };

  // UPDATE EVENT
  const updateEvent = (data) => {
    const updated = events.map((event) =>
      event.id === editing.id
        ? {
          ...event,
          ...data
        }
        : event
    );

    refreshEvents(updated);
    setEditing(null);
  };

  // DELETE EVENT
  const deleteEvent = (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this event?'
    );

    if (!confirmDelete) return;

    refreshEvents(
      events.filter((event) => event.id !== id)
    );
  };

  // FILTER EVENTS
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        event.location
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === 'All' ||
        event.category === filter;

      return matchesSearch && matchesFilter;
    });
  }, [events, search, filter]);

  const totalRegistrations = events.reduce(
    (sum, event) => sum + event.attendees.length,
    0
  );

  const totalCapacity = events.reduce(
    (sum, event) => sum + Number(event.capacity),
    0
  );

  const averageAttendance = totalCapacity
    ? Math.round(
      (totalRegistrations / totalCapacity) * 100
    )
    : 0;

  const categories = [
    'All',
    ...new Set(events.map((event) => event.category))
  ];

  return (
    <div className="admin-page">

      {/* HEADER */}

      <div className="admin-page-header">

        <div>
          <div className="admin-kicker">
            ORGANIZER STUDIO
          </div>

          <h1>Manage your events.</h1>

          <p>
            Create, organize and monitor everything
            happening on your platform.
          </p>
        </div>

        <button
          className="admin-create-btn"
          onClick={() => {
            setShowForm(true);
            setEditing(null);
          }}
        >
          <Plus size={18} />
          Create Event
        </button>

      </div>


      {/* STATISTICS */}

      <div className="admin-stat-grid">

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <CalendarDays size={19} />
          </div>

          <div>
            <span>Total Events</span>
            <strong>{events.length}</strong>
            <small>Across all categories</small>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon green">
            <Users size={19} />
          </div>

          <div>
            <span>Registrations</span>
            <strong>{totalRegistrations}</strong>
            <small>Attendees registered</small>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon purple">
            <Ticket size={19} />
          </div>

          <div>
            <span>Total Capacity</span>
            <strong>{totalCapacity}</strong>
            <small>Available seats</small>
          </div>

        </div>


        <div className="admin-stat-card dark">

          <div className="admin-stat-icon orange">
            <TrendingUp size={19} />
          </div>

          <div>
            <span>Attendance Rate</span>
            <strong>{averageAttendance}%</strong>
            <small>Overall performance</small>
          </div>

        </div>

      </div>


      {/* CREATE / EDIT FORM */}

      {(showForm || editing) && (

        <div className="admin-form-wrapper">

          <div className="admin-form-top">

            <div>
              <span className="admin-kicker">
                {editing
                  ? 'EDIT EVENT'
                  : 'NEW EVENT'}
              </span>

              <h2>
                {editing
                  ? 'Update event details'
                  : 'Create something memorable'}
              </h2>
            </div>

            <button
              className="admin-close-btn"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
            >
              <X size={18} />
            </button>

          </div>

          <EventForm
            initial={editing || undefined}
            onSubmit={
              editing
                ? updateEvent
                : createEvent
            }
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />

        </div>

      )}


      {/* EVENTS SECTION */}

      <div className="admin-events-panel">

        <div className="admin-events-header">

          <div>
            <span className="admin-kicker">
              EVENT LIBRARY
            </span>

            <h2>Your events</h2>

            <p>
              Manage every event from one place.
            </p>
          </div>

          <div className="admin-total">
            {filteredEvents.length} events
          </div>

        </div>


        {/* SEARCH + FILTER */}

        <div className="admin-toolbar">

          <div className="admin-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search events or locations..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="admin-filter">

            {categories.map((category) => (

              <button
                key={category}
                className={
                  filter === category
                    ? 'admin-filter-btn active'
                    : 'admin-filter-btn'
                }
                onClick={() =>
                  setFilter(category)
                }
              >
                {category}
              </button>

            ))}

          </div>

        </div>


        {/* EVENT TABLE */}

        <div className="admin-event-table">

          <div className="admin-table-heading">

            <span>EVENT</span>
            <span>DATE</span>
            <span>LOCATION</span>
            <span>ATTENDEES</span>
            <span>STATUS</span>
            <span>ACTION</span>

          </div>


          {filteredEvents.map((event) => {

            const percentage = event.capacity
              ? Math.round(
                (event.attendees.length /
                  event.capacity) *
                100
              )
              : 0;

            const isFull =
              event.attendees.length >=
              event.capacity;

            return (

              <div
                className="admin-event-row"
                key={event.id}
              >

                {/* EVENT */}

                <div className="admin-event-name">

                  <small className="admin-price">
                    {Number(event.price ?? 0) === 0
                      ? 'FREE'
                      : `₹${Number(event.price).toLocaleString('en-IN')}`}
                  </small>

                  <div className="admin-event-symbol">
                    ✦
                  </div>

                  <div>

                    <strong>
                      {event.title}
                    </strong>

                    <small>
                      {event.category}
                    </small>

                  </div>

                </div>


                {/* DATE */}

                <div className="admin-event-date">

                  <CalendarDays size={14} />

                  {event.date}

                  <small>
                    <Clock size={11} />
                    {event.time}
                  </small>

                </div>


                {/* LOCATION */}

                <div className="admin-location">

                  <MapPin size={14} />

                  <span>
                    {event.location}
                  </span>

                </div>


                {/* ATTENDEES */}

                <div className="admin-attendees">

                  <div className="admin-progress">

                    <div
                      style={{
                        width: `${percentage}%`
                      }}
                    />

                  </div>

                  <span>
                    {event.attendees.length}/
                    {event.capacity}
                  </span>

                </div>


                {/* STATUS */}

                <div>

                  <span
                    className={
                      isFull
                        ? 'status-badge sold'
                        : percentage >= 70
                          ? 'status-badge hot'
                          : 'status-badge published'
                    }
                  >

                    {isFull
                      ? 'Sold Out'
                      : percentage >= 70
                        ? 'Almost Full'
                        : 'Published'}

                  </span>

                </div>


                {/* ACTION */}

                <div className="admin-actions">

                  <button
                    title="View attendees"
                    onClick={() =>
                      setSelectedEvent(event)
                    }
                  >
                    <Users size={15} />
                  </button>

                  <button
                    title="Edit event"
                    onClick={() => {
                      setEditing(event);
                      setShowForm(false);
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      });
                    }}
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    title="Delete event"
                    className="danger"
                    onClick={() =>
                      deleteEvent(event.id)
                    }
                  >
                    <Trash2 size={15} />
                  </button>

                </div>

              </div>

            );
          })}


          {filteredEvents.length === 0 && (

            <div className="admin-empty">

              <Search size={32} />

              <h3>No events found</h3>

              <p>
                Try another search or category.
              </p>

            </div>

          )}

        </div>

      </div>


      {/* ATTENDEE MODAL */}

      {selectedEvent && (

        <div
          className="admin-modal-overlay"
          onClick={() =>
            setSelectedEvent(null)
          }
        >

          <div
            className="admin-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <span className="admin-kicker">
                  ATTENDEE LIST
                </span>

                <h2>
                  {selectedEvent.title}
                </h2>

                <p>
                  {selectedEvent.attendees.length}
                  {' '}registered attendees
                </p>

              </div>

              <button
                className="admin-close-btn"
                onClick={() =>
                  setSelectedEvent(null)
                }
              >
                <X size={18} />
              </button>

            </div>


            <div className="admin-attendee-list">

              {selectedEvent.attendees.length ===
                0 ? (

                <div className="admin-empty">
                  <Users size={30} />
                  <h3>No registrations yet</h3>
                  <p>
                    Attendees will appear here
                    after registration.
                  </p>
                </div>

              ) : (

                selectedEvent.attendees.map(
                  (attendee) => (

                    <div
                      className="admin-attendee"
                      key={attendee.id}
                    >

                      <div className="attendee-avatar">
                        {attendee.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <strong>
                          {attendee.name}
                        </strong>

                        <span>
                          {attendee.email}
                        </span>

                      </div>

                      <MoreHorizontal
                        size={17}
                      />

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}