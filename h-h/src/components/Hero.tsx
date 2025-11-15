"use client";
import Image from "next/image";


export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h2>Unic</h2>
        <h1>Handcrafted<br />Products</h1>
        <div className="buttons">
          <button className="btn-primary">Buy Now</button>
          <button className="btn-secondary">Shop All</button>
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
