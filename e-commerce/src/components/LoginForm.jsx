import { useState } from "react";

function LoginForm({ onBack, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    const displayName = name.trim() || email.split("@")[0];
    const user = {
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      email: email.trim(),
      phone: "0812-3456-7890",
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
          <p>Masuk untuk mengelola akun, pesanan, dan profil kamu.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Nama Lengkap (Opsional)</label>
            <input
              id="name"
              type="text"
              placeholder="Contoh: Marta"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email <span style={{ color: "red" }}>*</span></label>
            <input
              id="email"
              type="email"
              placeholder="Masukkan alamat email kamu"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Masuk / Login
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
