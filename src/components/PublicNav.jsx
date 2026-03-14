// src/components/PublicNav.jsx
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import './PublicNav.css';

export default function PublicNav() {
  const [hideNav, setHideNav] = useState(false);
  let lastScrollY = window.scrollY;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setHideNav(true); // scrolling down
      } else {
        setHideNav(false); // scrolling up
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`public-tab-nav ${hideNav ? "hide" : ""}`}>
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/events">Events</NavLink>
      <NavLink to="/about">About Us</NavLink>
      <NavLink to="/join">Join</NavLink>
    </nav>
  );
}
