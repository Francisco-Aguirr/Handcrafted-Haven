"use client";

import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/legal">Terms & Legal</Link>
      </div>

      <div className="footer-social">
        <FaFacebook className="icon" />
        <FaInstagram className="icon" />
        <FaTwitter className="icon" />
      </div>

      <p className="footer-copy">© {new Date().getFullYear()} Handcrafted Haven. All Rights Reserved.</p>
    </footer>
  );
}
