"use client";
import { FaSearch, FaShoppingCart, FaUser, FaFingerprint } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <FaFingerprint className="icon" />
        <span>H/H</span>
      </div>
{/* It is necesary change from <a> to <Link> to improve navigation */}

      <ul className="nav-links">
        <li><a href="../products">Products</a></li>
        <li><a href="../about">About</a></li>
        <li><a href="../artisans">Artisans</a></li>
      </ul>

      <div className="nav-icons">
        <FaSearch className="icon" />
        <FaShoppingCart className="icon" />
        <FaUser className="icon" />
      </div>
    </nav>
  );
}
