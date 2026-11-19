function BenefitSection({ t }) {
  const benefits = [
    {
      icon: "🚚",
      title: t?.benefit1Title || "Pengiriman Mudah",
      description: t?.benefit1Desc || "Pesanan diproses dengan cepat.",
    },
    {
      icon: "✓",
      title: t?.benefit2Title || "Produk Pilihan",
      description: t?.benefit2Desc || "Pilihan produk untuk kebutuhanmu.",
    },
    {
      icon: "♡",
      title: t?.benefit3Title || "Belanja Nyaman",
      description: t?.benefit3Desc || "Tampilan sederhana dan mudah digunakan.",
    },
    {
      icon: "🔒",
      title: t?.benefit4Title || "Aman & Terpercaya",
      description: t?.benefit4Desc || "Pengalaman belanja yang nyaman.",
    },
  ];

  return (
    <section className="benefit-section">
      <div className="benefit-heading">
        <span className="section-kicker">{t?.whyStoreku || "KENAPA STOREKU?"}</span>

        <h2>
          {t?.shopComfortably || "Belanja Lebih Nyaman."}
        </h2>
      </div>

      <div className="benefit-grid">
        {benefits.map((benefit) => (
          <div className="benefit-card" key={benefit.title}>
            <div className="benefit-icon">
              {benefit.icon}
            </div>

            <h3>{benefit.title}</h3>

            <p>{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BenefitSection;
