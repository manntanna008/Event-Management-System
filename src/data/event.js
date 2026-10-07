export const CATEGORIES = {
  Conference: '#FF5A45',
  Workshop: '#7C67FF',
  Concert: '#39B98A',
  Meetup: '#4C86FF',
  Seminar: '#F2A93C',
};

const defaultEvents = [
  {
    id: 1,
    title: 'React & Modern Web Workshop',
    category: 'Workshop',
    date: '2026-08-20',
    time: '10:00',
    location: 'Ahmedabad Convention Centre',
    capacity: 80,
    price: 999,
    description:
      'A practical workshop covering React components, routing, hooks and modern frontend development.',
    attendees: [],
  },

  {
    id: 2,
    title: 'Gujarat Tech Summit 2026',
    category: 'Conference',
    date: '2026-08-25',
    time: '09:30',
    location: 'Marwadi University, Rajkot',
    capacity: 150,
    price: 1499,
    description:
      'A technology conference for students, developers and startups.',
    attendees: [],
  },

  {
    id: 3,
    title: 'Gujarati Music Night',
    category: 'Concert',
    date: '2026-09-05',
    time: '19:00',
    location: 'Marwadi University, Rajkot',
    capacity: 500,
    price: 799,
    description:
      'Enjoy an unforgettable Gujarati musical evening with live performances.',
    attendees: [],
  },

  {
    id: 4,
    title: 'Startup Networking Meetup',
    category: 'Meetup',
    date: '2026-09-12',
    time: '17:00',
    location: 'Ahmedabad Innovation Hub',
    capacity: 100,
    price: 499,
    description:
      'Connect with founders, developers, students and entrepreneurs.',
    attendees: [],
  },
];


// ===============================
// GET EVENTS
// ===============================

export function getEvents() {
  const saved = localStorage.getItem('gateway_events');

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Error reading events:', error);
    }
  }

  localStorage.setItem(
    'gateway_events',
    JSON.stringify(defaultEvents)
  );

  return defaultEvents;
}


// ===============================
// SAVE EVENTS
// ===============================

export function saveEvents(events) {
  localStorage.setItem(
    'gateway_events',
    JSON.stringify(events)
  );
}


// ===============================
// ADD EVENT
// ===============================

export function addEvent(event) {
  const events = getEvents();

  const newEvent = {
    ...event,
    id: Date.now(),
    price: Number(event.price || 0),
    capacity: Number(event.capacity || 0),
    attendees: [],
  };

  const updatedEvents = [
    ...events,
    newEvent,
  ];

  saveEvents(updatedEvents);

  return newEvent;
}


// ===============================
// UPDATE EVENT
// ===============================

export function updateEvent(id, updatedData) {
  const events = getEvents();

  const updatedEvents = events.map((event) =>
    String(event.id) === String(id)
      ? {
          ...event,
          ...updatedData,
          price: Number(
            updatedData.price ??
            event.price ??
            0
          ),
          capacity: Number(
            updatedData.capacity ??
            event.capacity
          ),
        }
      : event
  );

  saveEvents(updatedEvents);

  return updatedEvents;
}


// ===============================
// DELETE EVENT
// ===============================

export function deleteEvent(id) {
  const events = getEvents();

  const updatedEvents = events.filter(
    (event) =>
      String(event.id) !== String(id)
  );

  saveEvents(updatedEvents);

  return updatedEvents;
}

// ===============================
// GET EVENT BY ID
// ===============================

export function getEventById(id) {
  const events = getEvents();

  return events.find(
    (event) => String(event.id) === String(id)
  );
}


// ===============================
// ADD ATTENDEE
// ===============================

export function addAttendee(eventId, attendee) {
  const events = getEvents();

  const event = events.find(
    (event) => String(event.id) === String(eventId)
  );

  if (!event) {
    return false;
  }

  if (!event.attendees) {
    event.attendees = [];
  }

  event.attendees.push(attendee);

  saveEvents(events);

  return true;
}