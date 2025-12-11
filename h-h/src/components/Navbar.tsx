"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaFingerprint,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
import { lusitana } from '@/app/ui/fonts';

// Logout Confirmation Modal Component
function LogoutModal({ isOpen, onConfirm, onCancel }: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl transform animate-fade-in">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Confirm Logout</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to log out of your account?</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

// User Dropdown Component
function UserDropdown() {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
    setDropdownOpen(false);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await signOut({ callbackUrl: "/" });
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  // Not logged in - show login link
  if (!session) {
    return (
      <Link href="/login" className="hover:text-gray-600">
        <FaUser />
      </Link>
    );
  }

  // Logged in - show dropdown
  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 hover:text-gray-600 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
            {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="font-semibold text-gray-800 truncate">
                {session.user?.name || "User"}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {session.user?.email}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                href="/dashboard"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaCog className="text-gray-400" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
              >
                <FaSignOutAlt className="text-red-400" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}

// Mobile User Menu Component
function MobileUserMenu({ onClose }: { onClose: () => void }) {
  const { data: session, status } = useSession();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    onClose();
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (!session) {
    return (
      <Link href="/login" className="hover:text-gray-600" onClick={onClose}>
        <FaUser />
      </Link>
    );
  }

  return (
    <>
      <div className="w-full border-t border-gray-200 pt-4 mt-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold">
            {session.user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{session.user?.name || "User"}</p>
            <p className="text-sm text-gray-500">{session.user?.email}</p>
          </div>
        </div>
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex items-center gap-3 py-2 text-gray-700 hover:text-gray-900"
        >
          <FaCog />
          <span>Dashboard</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 py-2 text-red-600 hover:text-red-700 w-full"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}

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
          <span className={`${lusitana.className}`}>H/H</span>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-8 font-semibold">
          <li><Link href="/products" className="hover:text-gray-600">Products</Link></li>
          <li><Link href="/about" className="hover:text-gray-600">About</Link></li>
          <li><Link href="/artisans" className="hover:text-gray-600">Artisans</Link></li>
        </ul>

        {/* Desktop Icons */}
        <div className="hidden md:flex gap-6 text-xl items-center">
          <Link href="/search" className="hover:text-gray-600"><FaSearch /></Link>
          <Link href="/cart" className="hover:text-gray-600"><FaShoppingCart /></Link>
          <UserDropdown />
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
          <Link href="/search" className="hover:text-gray-600" onClick={() => setMenuOpen(false)}><FaSearch /></Link>
          <Link href="/cart" className="hover:text-gray-600" onClick={() => setMenuOpen(false)}><FaShoppingCart /></Link>
        </div>

        {/* Mobile User Menu */}
        <MobileUserMenu onClose={() => setMenuOpen(false)} />
      </div>
    </nav>
  );
}
