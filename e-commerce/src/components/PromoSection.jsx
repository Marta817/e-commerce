function PromoSection({ onShopClick, t }) {
  return (
    <section className="promo-section">
      <div className="promo-content">
        <span className="promo-kicker">{t?.promoBannerTag || "SPECIAL FOR YOU"}</span>

        <h2>
          {t?.promoBannerTitle || "Diskon Belanja Hingga 30%"}
        </h2>

        <p>
          {t?.promoBannerDesc || "Dapatkan produk fashion dan aksesoris terbaik dengan harga lebih hemat."}
        </p>

        <button
          type="button"
          onClick={onShopClick}
          className="promo-button"
          style={{ cursor: "pointer", border: "none" }}
        >
          {t?.promoBannerBtn || "Belanja Sekarang →"}
        </button>
      </div>

      <div className="promo-decoration">
        <span>STOREKU</span>
        <strong>STYLE</strong>
      </div>
    </section>
  );
}

export default PromoSection;
