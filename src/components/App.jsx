import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Home from "../Home";
import Events from "../Events";
import About from "../About";
import SignIn from "../SignIn";
import SignUp from "../SignUp";
import AdminSignIn from "../AdminSignIn";
import SecureAdminSetup from "../SecureAdminSetup";
import UserEvents from "../UserEvents";
import PublicLayout from "./PublicLayout";
import UserLayout from "./UserLayout";
import UserContact from "../UserContact";
import Profile from "../Profile";
import Notifications from "./Notifications";

// Components
import EventCard from '../components/EventCard';
import EventList from '../components/EventList';
import EventDetails from '../components/EventDetails';
import EventRegistration from '../components/EventRegistration';

// Admin Pages
import AdminAddEvent from '../admin/AdminAddEvent';
import AdminDashboard from '../admin/AdminDashboard';
import AdminEditEvent from '../admin/AdminEditEvent';
import AdminRegistrations from '../admin/AdminRegistrations';
import AdminFeedback from '../admin/AdminFeedback';

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
          <Route path="/admin-signin" element={<AdminSignIn />} />
          <Route path="/secure-admin-setup" element={<SecureAdminSetup />} />
          
          
        </Route>

        {/* User Routes */}
        <Route element={<UserLayout />}>
          <Route path="/userevents" element={<UserEvents />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/usercontact" element={<UserContact />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/event/:eventId" element={<EventCard />} /> 
          <Route path="/event-details/:eventId" element={<EventDetails />} />
          <Route path="/register/:eventId" element={<EventRegistration />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-event" element={<AdminAddEvent />} />
        <Route path="/admin/edit-event/:id" element={<AdminEditEvent />} />
        <Route path="/admin/registrations" element={<AdminRegistrations />} />
        <Route path="/admin/feedback" element={<AdminFeedback />} />

        {/* Event Details Route */}
        {/* <Route path="/event-details" element={<EventDetails />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
