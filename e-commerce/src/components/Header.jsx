function Header({ currentUser, onLoginClick, onLogoutClick, onLogoClick }) {
  return (
    <header className="header-store">
      <div className="header-left">
        <div
          className="store-logo"
          onClick={onLogoClick}
          style={{ cursor: "pointer" }}
          title="Kembali ke Beranda"
        >
          STOREKU<span>.</span>
        </div>
      </div>

      <div className="header-right">
        {currentUser ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
              👋 Hai, <strong>{currentUser.name}</strong>
            </span>
            <button
              className="login-button"
              type="button"
              onClick={onLogoutClick}
              style={{ backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
            >
              Keluar / Logout
            </button>
          </div>
        ) : (
          <button
            className="login-button"
            type="button"
            onClick={onLoginClick}
          >
            Masuk / Login
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
