function PromoSection({ onShopClick }) {
  return (
    <section className="promo-section">
      <div className="promo-content">
        <span className="promo-kicker">SPECIAL FOR YOU</span>

        <h2>
          Lengkapi Gaya
          <br />
          Tanpa Ribet.
        </h2>

        <p>
          Temukan berbagai pilihan produk Storeku untuk
          melengkapi kebutuhan fashion dan lifestyle kamu.
        </p>

        <button
          type="button"
          onClick={onShopClick}
          className="promo-button"
          style={{ cursor: "pointer", border: "none" }}
        >
          Belanja Sekarang
          <span>→</span>
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
