function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          e-commerce
        </div>

        <div className="nav-menu">
          <a href="#home">Beranda</a>
          <a href="#products">Produk</a>
          <a href="#about">Tentang</a>
        </div>

        <button className="cart-button">
          🛒 Keranjang
        </button>
      </div>
    </nav>
  );
}

export default Navbar;