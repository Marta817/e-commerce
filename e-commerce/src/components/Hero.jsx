function Hero({ onExploreClick }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-eyebrow">
          STOREKU • KOLEKSI PILIHAN
        </span>

        <h1>
          Temukan Gaya
          <br />
          Favoritmu
        </h1>

        <p>
          Pilihan fashion dan lifestyle untuk melengkapi
          kebutuhan sehari-harimu.
        </p>

        <button
          type="button"
          onClick={onExploreClick}
          className="hero-button"
          style={{ cursor: "pointer", border: "none" }}
        >
          Lihat Produk
          <span>→</span>
        </button>

        <div className="hero-note">
          <span>✓</span>
          <p>Produk pilihan dengan harga bersahabat</p>
        </div>
      </div>

      <div className="hero-image-wrap">
        <div className="hero-image-bg"></div>

        <img
          src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=900&auto=format&fit=crop"
          alt="Produk fashion Storeku"
        />

        <div className="hero-product-label">
          <small>Produk pilihan</small>
          <strong>Kaos Oversize</strong>
          <span>Rp129.000</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
