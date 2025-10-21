import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from '../contexts/NotificationContext';
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
import Support from "../Support";
import News from "../News";
import Contact from "../Contact";

// Components
import EventCard from '../components/EventCard';
import EventList from '../components/EventList';
import EventDetails from '../components/EventDetails';
import EventRegistration from '../components/EventRegistration';
import EmailTest from '../components/EmailTest';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';
import AdminLockoutReset from '../components/AdminLockoutReset';
import AdminAccountCreator from '../components/AdminAccountCreator';
import UserSyncTool from '../components/UserSyncTool';
import ModalTest from '../components/ModalTest';
import RegistrationChecker from '../components/RegistrationChecker';
import AdminEventManager from '../components/AdminEventManager';
import CancelledEventsList from '../components/CancelledEventsList';

// Admin Pages
import AdminAddEvent from '../admin/AdminAddEvent';
import AdminDashboard from '../admin/AdminDashboard';
import AdminEditEvent from '../admin/AdminEditEvent';
import AdminRegistrations from '../admin/AdminRegistrations';
import AdminFeedback from '../admin/AdminFeedback';

// Firebase config
import '../firebaseConfig';

// Import final email service
import '../utils/finalEmailService';
import '../utils/directEmailTest';
import '../utils/gmailEmailService';
import '../utils/consoleTest';
import '../utils/simpleGmailTest';
import '../utils/emailNotifications';
import '../utils/autoEmailService';
import '../utils/realEmailService';
import '../utils/automatedEmailService';
import '../utils/simpleAutomatedEmail';
import '../utils/workingEmailService';
import '../utils/finalWorkingEmail';
import '../utils/advancedEmailService';
import '../utils/simpleAdvancedEmail';
import '../utils/guaranteedEmailTest';
import '../utils/allUsersEmailService';
import '../utils/debugUsersEmail';
import '../utils/workingAllUsersEmail';
import '../utils/customSenderEmail';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/join" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/admin-signin" element={<AdminSignIn />} />
          <Route path="/secure-admin-setup" element={<SecureAdminSetup />} />
          <Route path="/create-admin" element={<AdminAccountCreator />} />
          <Route path="/sync-users" element={<UserSyncTool />} />
          
          
        </Route>

        {/* User Routes */}
        <Route element={<UserLayout />}>
          <Route path="/userevents" element={<UserEvents />} />
          <Route path="/cancelled-events" element={<CancelledEventsList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/usercontact" element={<UserContact />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/event/:eventId" element={<EventCard />} /> 
          <Route path="/event-details/:eventId" element={<EventDetails />} />
          <Route path="/register/:eventId" element={<EventRegistration />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/add-event" element={
          <ProtectedAdminRoute>
            <AdminAddEvent />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/edit-event/:id" element={
          <ProtectedAdminRoute>
            <AdminEditEvent />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/registrations" element={
          <ProtectedAdminRoute>
            <AdminRegistrations />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/feedback" element={
          <ProtectedAdminRoute>
            <AdminFeedback />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/events" element={
          <ProtectedAdminRoute>
            <AdminEventManager />
          </ProtectedAdminRoute>
        } />
        
        {/* Test Routes */}
        <Route path="/test-email" element={<EmailTest />} />
        <Route path="/test-modal" element={<ModalTest />} />
        <Route path="/check-registrations" element={<RegistrationChecker />} />
        <Route path="/admin-lockout-reset" element={<AdminLockoutReset />} />

        {/* Event Details Route */}
        {/* <Route path="/event-details" element={<EventDetails />} /> */}
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
