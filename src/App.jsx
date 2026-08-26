import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <div className="app-shell">

      <Navbar />

      <main className="app-main">

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/events"
            element={<Events />}
          />

          <Route
            path="/events/:id"
            element={<EventDetails />}
          />

          <Route
            path="/events/:id/register"
            element={<Register />}
          />

          <Route
            path="/admin"
            element={<Admin />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

        </Routes>

      </main>

      <Footer />

    </div>
  );
}