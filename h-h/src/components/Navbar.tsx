"use client";

import Link from "next/link";
import { FaSearch, FaShoppingCart, FaUser, FaFingerprint } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <FaFingerprint className="icon" />
        <span>H/H</span>
      </div>

      <ul className="nav-links">
        <li>
          <Link href="/products">Products</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/artisans">Artisans</Link>
        </li>
      </ul>

      <div className="nav-icons">
        <FaSearch className="icon" />
        <FaShoppingCart className="icon" />
        <FaUser className="icon" />
      </div>
    </nav>
  );
}
