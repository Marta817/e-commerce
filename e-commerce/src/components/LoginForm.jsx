import { useState } from "react";

function LoginForm({ onBack, onLoginSuccess }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const displayName = name.trim() || "Marta";
    const user = {
      name: displayName,
      address: address.trim() || "Jl. Merdeka No. 45, Jakarta Selatan",
      phone: phone.trim() || "0812-3456-7890",
      status: "Aktif",
    };

    if (onLoginSuccess) {
      onLoginSuccess(user);
    }
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="section-kicker">STOREKU AUTENTIKASI</span>
          <h1>Masuk ke Akun</h1>
          <p>Lengkapi identitas untuk memudahkan pengiriman pesanan kamu.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Nama Lengkap <span style={{ color: "red" }}>*</span></label>
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
            <label htmlFor="address">Alamat Pengiriman Lengkap <span style={{ color: "red" }}>*</span></label>
            <textarea
              id="address"
              rows={2}
              placeholder="Contoh: Jl. Merdeka No. 45, Jakarta Selatan"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px" }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Nomor Telepon / WhatsApp</label>
            <input
              id="phone"
              type="tel"
              placeholder="Contoh: 0812-3456-7890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password <span style={{ color: "red" }}>*</span></label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="primary-page-button" style={{ width: "100%", marginTop: "10px" }}>
            Masuk / Simpan Profil
          </button>
        </form>

        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          ← Kembali
        </button>
      </div>
    </section>
  );
}

export default LoginForm;
