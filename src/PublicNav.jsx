import { Link } from "react-router-dom";

export default function PublicNav() {
  return (
    <nav className="navbar">
      <div className="nav-center">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/events">Events</Link>
        <Link to="/signin">Login</Link>
        <Link to="/join">Sign Up</Link>
      </div>
    </nav>
  );
} 

