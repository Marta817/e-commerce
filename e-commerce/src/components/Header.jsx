function Header({ currentUser, onLoginClick, onLogoutClick, onLogoClick, t }) {
  return (
    <header className="header-store">
      <div className="header-left">
        <div
          className="store-logo"
          onClick={onLogoClick}
          style={{ cursor: "pointer" }}
          title={t?.home || "Kembali ke Beranda"}
        >
          STOREKU<span>.</span>
        </div>
      </div>

      <div className="header-right">
        {currentUser ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
              👋 {t?.hi || "Hai"}, <strong>{currentUser.name}</strong>
            </span>
            <button
              className="login-button"
              type="button"
              onClick={onLogoutClick}
              style={{ backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
            >
              {t?.logout || "Keluar / Logout"}
            </button>
          </div>
        ) : (
          <button
            className="login-button"
            type="button"
            onClick={onLoginClick}
          >
            {t?.login || "Masuk / Login"}
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
