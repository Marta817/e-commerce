function BenefitSection() {
  const benefits = [
    {
      icon: "🚚",
      title: "Pengiriman Mudah",
      description: "Pesanan diproses dengan praktis.",
    },
    {
      icon: "🛡️",
      title: "Produk Pilihan",
      description: "Pilihan produk sesuai kebutuhan.",
    },
    {
      icon: "↻",
      title: "Pemesanan Praktis",
      description: "Form pemesanan mudah digunakan.",
    },
    {
      icon: "💬",
      title: "Bantuan",
      description: "Informasi akun dan pesanan tersedia.",
    },
  ];

  return (
    <section className="benefit-section">
      {benefits.map((benefit) => (
        <div className="benefit-item" key={benefit.title}>
          <div className="benefit-icon">
            {benefit.icon}
          </div>

          <div>
            <strong>{benefit.title}</strong>
            <small>{benefit.description}</small>
          </div>
        </div>
      ))}
    </section>
  );
}

export default BenefitSection;