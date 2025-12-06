# Technology Stack - YouthInAction

This document explains all the technologies used in the YouthInAction project in a simple, easy-to-understand way.

---

## 🎨 Frontend (What Users See)

### Core Framework
- **React 18.2.0** - The main JavaScript library for building the user interface
- **Vite 5.4.20** - Fast build tool that helps develop and bundle the application

### Navigation & Routing
- **React Router DOM 6.8.1** - Handles page navigation (like going from Home to Profile page)

### User Experience
- **Framer Motion 10.16.4** - Adds smooth animations and transitions to make the app feel polished
- **React Icons 4.12.0** - Provides beautiful icons throughout the application

### Data Visualization
- **Recharts 3.2.1** - Creates charts and graphs (used in admin dashboard for statistics)

### Styling
- **CSS** - Custom stylesheets for designing the look and feel of each page

---

## ⚙️ Backend (Server-Side Logic)

### Server Framework
- **Node.js 18** - JavaScript runtime that runs the server
- **Express.js 4.18.2** - Web framework that handles HTTP requests and responses

### Utilities
- **CORS 2.8.5** - Allows the frontend to communicate with the backend securely
- **node-fetch 2.6.7** - Makes HTTP requests from the server

---

## 💾 Database & Storage (Where Data is Stored)

### Firebase Services
- **Firestore** - NoSQL database for storing:
  - User profiles
  - Events
  - Registrations
  - Admin data
- **Firebase Storage** - File storage for images and documents

### Supabase Services
- **Supabase Database** - PostgreSQL database (alternative to Firestore)
- **Supabase Storage** - Used specifically for profile images

> **Note:** The project uses both Firebase and Supabase. Firebase is the primary database, while Supabase handles profile image storage.

---

## 📧 Email Services

- **EmailJS 4.4.1** - Sends emails directly from the browser without needing a backend server
  - Used for contact forms
  - Registration confirmations
  - Event notifications

---

## 🛠️ Helper Libraries

- **Axios 1.6.0** - Makes HTTP requests easier (alternative to fetch)
- **date-fns 2.30.0** - Formats and manipulates dates (e.g., "January 15, 2024")
- **uuid 9.0.1** - Generates unique IDs for records

---

## 🚀 Deployment (Where the App Lives)

### Frontend Hosting
- **Vercel** - Hosts the main React application

### Backend Hosting
- **Railway** - Runs the Node.js/Express backend server

### Serverless Functions
- **Netlify** - Hosts serverless functions for email sending

---

## 🔧 Development Tools

- **ESLint** - Checks code for errors and enforces coding standards
- **@vitejs/plugin-react** - Vite plugin that enables React support

---

## 📋 Quick Summary

**Frontend:** React + Vite + React Router  
**Backend:** Node.js + Express  
**Database:** Firebase Firestore + Supabase  
**Storage:** Firebase Storage + Supabase Storage  
**Email:** EmailJS  
**Deployment:** Vercel (frontend) + Railway (backend) + Netlify (functions)

---

## 🎯 What Each Part Does

1. **React** - Builds all the pages and components users interact with
2. **Firebase/Supabase** - Stores all the data (users, events, registrations)
3. **Express Backend** - Handles server-side operations and email notifications
4. **Vercel/Railway** - Makes the app accessible on the internet
5. **EmailJS** - Sends emails to users automatically

---

*Last Updated: Based on current package.json files*

