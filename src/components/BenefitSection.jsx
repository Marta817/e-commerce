function BenefitSection() {
  const benefits = [
    {
      icon: "🚚",
      title: "Pengiriman Mudah",
      description: "Pesanan diproses dengan cepat.",
    },
    {
      icon: "✓",
      title: "Produk Pilihan",
      description: "Pilihan produk untuk kebutuhanmu.",
    },
    {
      icon: "♡",
      title: "Belanja Nyaman",
      description: "Tampilan sederhana dan mudah digunakan.",
    },
    {
      icon: "🔒",
      title: "Aman & Terpercaya",
      description: "Pengalaman belanja yang nyaman.",
    },
  ];

  return (
    <section className="benefit-section">
      <div className="benefit-heading">
        <span className="section-kicker">KENAPA STOREKU?</span>

        <h2>
          Belanja Lebih
          <br />
          Nyaman.
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
