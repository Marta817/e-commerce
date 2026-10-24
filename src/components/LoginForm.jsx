function LoginForm({ onBack }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login berhasil!");
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="section-kicker">STOREKU</span>
          <h1>Masuk ke Akun</h1>
          <p>Masuk untuk melihat akun dan pesanan kamu.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Masukkan email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password"
              required
            />
          </div>

          <button type="submit" className="primary-page-button">
            Masuk / Login
          </button>
        </form>

        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          ← Kembali ke Akun
        </button>
      </div>
    </section>
  );
}

export default LoginForm;