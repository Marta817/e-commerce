import { useState } from "react";

function LoginForm({ initialData, onBack, onLoginSuccess, t }) {
  const [name, setName] = useState(initialData?.name || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [address, setAddress] = useState(initialData?.address || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      name: name.trim() || "Marta",
      phone: phone.trim() || "0812-3456-7890",
      address: address.trim() || "Jl. Merdeka No. 45, Jakarta Selatan",
    };

    if (onLoginSuccess) {
      onLoginSuccess(user);
    }
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="section-kicker">{t?.authKicker || "STOREKU AKUN"}</span>
          <h1>{t?.authTitle || "Data Akun"}</h1>
          <p>{t?.authDesc || "Masukkan nama, no. HP, dan alamat pengiriman kamu."}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">{t?.fullName || "Nama"} <span style={{ color: "red" }}>*</span></label>
            <input
              id="name"
              type="text"
              placeholder="Contoh: Marta"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">{t?.phoneWhatsapp || "No. HP"} <span style={{ color: "red" }}>*</span></label>
            <input
              id="phone"
              type="tel"
              placeholder="Contoh: 0812-3456-7890"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">{t?.fullAddress || "Alamat"} <span style={{ color: "red" }}>*</span></label>
            <textarea
              id="address"
              rows={3}
              placeholder="Contoh: Jl. Merdeka No. 45, Jakarta Selatan"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px" }}
            />
          </div>

          <button type="submit" className="primary-page-button" style={{ width: "100%", marginTop: "10px" }}>
            {t?.saveAndLogin || "Simpan Data Akun"}
          </button>
        </form>

        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          ← {t?.cancel || "Batal"}
        </button>
      </div>
    </section>
  );
}

export default LoginForm;
