import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Home from "../Home";
import Events from "../Events";
import About from "../About";
import SignIn from "../SignIn";
import SignUp from "../SignUp";
import UserEvents from "../UserEvents";
import PublicLayout from "./PublicLayout";
import UserLayout from "./UserLayout";
import UserContact from "../UserContact";
import Profile from "../Profile";

// Components
import EventCard from '../components/eventcard';
import EventList from '../components/EventList';
import EventDetails from '../components/EventDetails';

// Admin Pages
import AdminAddEvent from '../admin/AdminAddEvent';
import AdminDashboard from '../admin/AdminDashboard';
import AdminEditEvent from '../admin/AdminEditEvent';

// Firebase config
import '../firebaseConfig';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route path="/join" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          
          
          
        </Route>

        {/* User Routes */}
        <Route element={<UserLayout />}>
          <Route path="/userevents" element={<UserEvents />} />
          <Route path="/EventCard" element={<EventCard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/usercontact" element={<UserContact />} />
            <Route path="/event/:eventId" element={<EventCard />} /> 
        <Route path="/event-details/:eventId" element={<EventDetails />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-event" element={<AdminAddEvent />} />
        <Route path="/admin/edit-event/:id" element={<AdminEditEvent />} />

        {/* Event Details Route */}
        {/* <Route path="/event-details" element={<EventDetails />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
