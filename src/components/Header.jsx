function Header() {
  return (
    <header className="header-store">
      <div className="header-brand">
        <button className="mobile-menu-button">☰</button>

        <div className="store-logo">
          STOREKU<span>.</span>
        </div>
      </div>

      <button className="login-button">
        Masuk / Login
      </button>
    </header>
  );
}

export default Header;