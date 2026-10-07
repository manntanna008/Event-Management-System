import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Events */}
        <Route path="/events" element={<Events />} />

        {/* Event Details */}
        <Route path="/events/:id" element={<EventDetails />} />

        {/* Registration */}
        <Route path="/events/:id/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;