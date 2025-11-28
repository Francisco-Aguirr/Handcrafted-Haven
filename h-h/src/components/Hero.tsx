"use client";
import Image from "next/image";
import Link from "next/link";


export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h2>Unic</h2>
        <h1>Handcrafted<br />Products</h1>
        <div className="buttons">
          
          <Link href="/artisans" className="btn-primary">
            Meet Artisans
          </Link>

          <Link href="/products" className="btn-primary text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 rounded-base px-4 py-2.5 text-center leading-5">
            View Store
          </Link>
        </div>
      </div>

      <div className="hero-image">
        <Image
          src="/hero-image.png"
          alt="handmade jug"
          width={500}
          height={500}
          priority
        />
      </div>
    </section>
  );
}
