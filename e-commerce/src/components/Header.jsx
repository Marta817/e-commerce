function Header() {
  return (
    <header className="header-store">
      <div className="header-left">
        <div className="store-logo">
          STOREKU<span>.</span>
        </div>
      </div>

      <div className="header-right">
        <button className="login-button" type="button">
          Masuk / Login
        </button>
      </div>
    </header>
  );
}

export default Header;