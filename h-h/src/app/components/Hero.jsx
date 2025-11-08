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
        <img src="/hero-image.png" alt="handmade jug" />
      </div>
    </section>
  );
}
