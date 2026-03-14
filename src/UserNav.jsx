import { Link } from "react-router-dom";

export default function UserNav({ onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/events">Events</Link>
      <Link to="/recommendations">Recommendations</Link>
      <Link to="/userevents">Profile</Link>
      <button onClick={onLogout}>Logout</button>
    </nav>
  );
} 

