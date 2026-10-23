function Hero() {
  return (
    <section className="storeku-hero">
      <div className="hero-copy">
        <span className="hero-eyebrow">
          STOREKU • KOLEKSI PILIHAN
        </span>

        <h1>
          Temukan Gaya
          <br />
          Favoritmu
        </h1>

        <p>
          Temukan pakaian, sepatu, tas, dan aksesori pilihan
          dengan tampilan yang nyaman, modern, dan tetap sesuai
          gaya kamu.
        </p>

        <button className="hero-button">
          Lihat Katalog Produk
        </button>

        <div className="hero-note">
          <span>Belanja mudah</span>
          <b>•</b>
          <span>Harga transparan</span>
          <b>•</b>
          <span>Produk pilihan</span>
        </div>
      </div>

      <div className="hero-image-wrap">
        <img
          src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=900&auto=format&fit=crop"
          alt="Produk pilihan Storeku"
        />

        <div className="hero-product-label">
          <small>Produk pilihan</small>
          <strong>Kaos Oversize Minimalis</strong>
        </div>
      </div>
    </section>
  );
}

export default Hero;