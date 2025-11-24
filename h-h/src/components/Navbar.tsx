"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaFingerprint,
  FaBars,
  FaTimes,
} from "react-icons/fa";


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-lg h-icon">
          <Link href="/" className="text-black">
            <FaFingerprint className="w-8 h-8" />
          </Link>
          <span>H/H</span>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-8 font-semibold">
          <li><Link href="/products" className="hover:text-gray-600">Products</Link></li>
          <li><Link href="/about" className="hover:text-gray-600">About</Link></li>
          <li><Link href="/artisans" className="hover:text-gray-600">Artisans</Link></li>
        </ul>

        {/* Desktop Icons */}
        <div className="hidden md:flex gap-6 text-xl">
          <Link href="/search" className="hover:text-gray-600"><FaSearch /></Link>
          <Link href="/cart" className="hover:text-gray-600"><FaShoppingCart /></Link>
          <Link href="/login" className="hover:text-gray-600"><FaUser /></Link>
        </div>

        {/* Hamburger Button (mobile/tablet) */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(true)}
        >
          <FaBars />
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden"
             onClick={() => setMenuOpen(false)}
        />
      )}

      {/* MOBILE SLIDE-OUT MENU */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg py-6 px-6 transform transition-transform duration-300 md:hidden
        ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >

        {/* Close Button */}
        <button
          className="text-2xl absolute top-4 right-4"
          onClick={() => setMenuOpen(false)}
        >
          <FaTimes />
        </button>

        <ul className="flex flex-col gap-6 mt-10 text-lg font-semibold">
          <li><Link href="/products" onClick={() => setMenuOpen(false)}>Products</Link></li>
          <li><Link href="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
          <li><Link href="/artisans" onClick={() => setMenuOpen(false)}>Artisans</Link></li>
        </ul>

        <div className="flex gap-6 text-xl mt-10">
          <Link href="/search" className="hover:text-gray-600"><FaSearch /></Link>
          <Link href="/cart" className="hover:text-gray-600"><FaShoppingCart /></Link>
          <Link href="/login" className="hover:text-gray-600"><FaUser /></Link>
        </div>
      </div>
    </nav>
  );
}
