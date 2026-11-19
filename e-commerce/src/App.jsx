import { useState, useEffect } from "react";
import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Hero from "./components/Hero";
import CategoryCard from "./components/CategoryCard";
import ProductCard from "./components/ProductCard";
import PromoSection from "./components/PromoSection";
import BenefitSection from "./components/BenefitSection";
import ProductManagement from "./components/ProductManagement";
import LoginForm from "./components/LoginForm";

import products from "./data/product";

const categories = [
  { icon: "👕", name: "Pakaian", description: "T-Shirt, kemeja, celana" },
  { icon: "👟", name: "Sepatu", description: "Sneakers dan casual" },
  { icon: "👜", name: "Tas", description: "Backpack dan tote bag" },
  { icon: "⌚", name: "Aksesori", description: "Jam, kacamata, dan lainnya" },
];

const promoProducts = [
  {
    name: "Sneakers Sporty",
    category: "Sepatu",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    oldPrice: "Rp499.000",
    price: "Rp349.300",
    discount: "30%",
  },
  {
    name: "Jaket Leather",
    category: "Outerwear",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop",
    oldPrice: "Rp349.000",
    price: "Rp279.200",
    discount: "20%",
  },
  {
    name: "Backpack Casual",
    category: "Tas",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
    oldPrice: "Rp219.000",
    price: "Rp186.150",
    discount: "15%",
  },
];

function App() {
  const [activePage, setActivePage] = useState("beranda");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [productsList, setProductsList] = useState(products);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isLoadingBackend, setIsLoadingBackend] = useState(false);

  // Filter & Search & Sort State
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("Semua");
  const [sortBy, setSortBy] = useState("terbaru");

  // Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("storeku_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Orders State
  const [orders, setOrders] = useState([
    {
      id: 101,
      productName: "Kaos Oversize",
      price: 129000,
      image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop",
      date: "18 Nov 2026",
      status: "Selesai",
    },
  ]);

  const fetchProducts = async () => {
    try {
      setIsLoadingBackend(true);
      const res = await fetch("http://localhost:3000/products");
      if (res.ok) {
        const data = await res.json();
        setProductsList(data);
        setIsBackendConnected(true);
      } else {
        setIsBackendConnected(false);
      }
    } catch (err) {
      console.warn("Backend NestJS offline, menggunakan data lokal fallback.", err);
      setIsBackendConnected(false);
    } finally {
      setIsLoadingBackend(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePageChange = (page) => {
    setActivePage(page);
    setSelectedProduct(null);
    setShowLogin(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToAccount = () => {
    handlePageChange("akun");
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategoryFilter(categoryName);
    handlePageChange("produk");
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("storeku_user", JSON.stringify(userData));
    setShowLogin(false);
    setActivePage("akun");
    alert(`Selamat datang kembali, ${userData.name}! Login berhasil.`);
  };

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari akun?")) {
      setCurrentUser(null);
      localStorage.removeItem("storeku_user");
      alert("Anda telah berhasil logout.");
    }
  };

  const handleOrderProduct = (product) => {
    const newOrder = {
      id: Date.now(),
      productName: product.name,
      price: product.price,
      image: product.image,
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      status: "Diproses",
    };
    setOrders([newOrder, ...orders]);
    setSelectedProduct(null);
    setActivePage("pemesanan");
    alert(`Pesanan untuk "${product.name}" berhasil dibuat!`);
  };

  // Filtered and Sorted Products for "Produk" Page
  const displayedProducts = productsList
    .filter((p) => {
      const matchesCategory =
        selectedCategoryFilter === "Semua" || p.category === selectedCategoryFilter;
      const matchesSearch =
        !searchKeyword ||
        p.name.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const priceA = typeof a.price === "number" ? a.price : 0;
      const priceB = typeof b.price === "number" ? b.price : 0;
      if (sortBy === "termurah") return priceA - priceB;
      if (sortBy === "termahal") return priceB - priceA;
      return (b.id || 0) - (a.id || 0); // terbaru
    });

  return (
    <div className="storeku-app">
      <Header
        currentUser={currentUser}
        onLoginClick={() => setShowLogin(true)}
        onLogoutClick={handleLogout}
        onLogoClick={() => handlePageChange("beranda")}
      />

      <div className="app-body">
        <Sidebar
          activePage={activePage}
          onPageChange={handlePageChange}
        />

        <main className="main-content">
          {/* ================= BERANDA ================= */}
          {activePage === "beranda" &&
            !selectedProduct &&
            !showLogin && (
              <>
                <section className="top-bar">
                  <div className="search-box">
                    <span>⌕</span>
                    <input
                      type="text"
                      placeholder="Cari produk favoritmu (tekan Enter)..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handlePageChange("produk");
                        }
                      }}
                    />
                  </div>

                  <div className="top-bar-info">
                    <span>✨</span>
                    <span>Belanja nyaman di Storeku</span>
                  </div>
                </section>

                <Hero onExploreClick={() => handlePageChange("produk")} />

                <section className="section-block">
                  <div className="section-heading">
                    <div>
                      <span className="section-kicker">KATEGORI</span>
                      <h2>Belanja Sesuai Kebutuhan</h2>
                    </div>
                  </div>

                  <div className="category-grid">
                    {categories.map((category) => (
                      <CategoryCard
                        key={category.name}
                        {...category}
                        onClick={handleCategoryClick}
                      />
                    ))}
                  </div>
                </section>

                <section className="section-block">
                  <div className="section-heading">
                    <div>
                      <span className="section-kicker">
                        PRODUK PILIHAN
                      </span>
                      <h2>Favorit Storeku</h2>
                    </div>

                    <button
                      type="button"
                      className="see-all-button"
                      onClick={() => handlePageChange("produk")}
                    >
                      Lihat Semua →
                    </button>
                  </div>

                  <div className="product-grid">
                    {productsList.slice(0, 8).map((product) => (
                      <ProductCard
                        key={product.id || `${product.name}-${product.image}`}
                        product={product}
                        onClick={handleProductClick}
                      />
                    ))}
                  </div>
                </section>

                <PromoSection onShopClick={() => handlePageChange("promo")} />
                <BenefitSection />
              </>
            )}

          {/* ================= PRODUK ================= */}
          {activePage === "produk" && !selectedProduct && !showLogin && (
            <section className="page-section">
              <div className="page-header">
                <span className="section-kicker">STOREKU KATALOG</span>
                <h1>Produk</h1>
                <p>
                  Temukan berbagai produk fashion dan lifestyle pilihan Storeku.
                </p>
              </div>

              <div className="product-toolbar" style={{ flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span>Menampilkan <strong>{displayedProducts.length}</strong> produk</span>
                  {selectedCategoryFilter !== "Semua" && (
                    <button
                      type="button"
                      onClick={() => setSelectedCategoryFilter("Semua")}
                      style={{
                        padding: "2px 8px",
                        fontSize: "12px",
                        borderRadius: "999px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "#f3f4f6",
                        cursor: "pointer",
                      }}
                    >
                      Kategori: {selectedCategoryFilter} ✕
                    </button>
                  )}
                  {isBackendConnected && (
                    <span style={{ fontSize: "12px", color: "#059669", fontWeight: "600" }}>
                      ● Live dari Backend NestJS
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="primary-page-button"
                    style={{ padding: "6px 14px", fontSize: "13px", backgroundColor: "#4f46e5", borderColor: "#4f46e5" }}
                    onClick={() => handlePageChange("kelola-produk")}
                    title="Buka panel admin toko untuk menambah, mengedit, atau menghapus produk"
                  >
                    ⚙️ Panel Admin (CRUD Produk)
                  </button>

                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    style={{ padding: "6px 10px", fontSize: "13px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                  >
                    <option value="Semua">Semua Kategori</option>
                    <option value="Pakaian">Pakaian</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Sepatu">Sepatu</option>
                    <option value="Tas">Tas</option>
                    <option value="Aksesori">Aksesori</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ padding: "6px 10px", fontSize: "13px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                  >
                    <option value="terbaru">Produk Terbaru</option>
                    <option value="termurah">Harga Terendah</option>
                    <option value="termahal">Harga Tertinggi</option>
                  </select>
                </div>
              </div>

              {displayedProducts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
                  <p style={{ fontSize: "18px", fontWeight: "600" }}>Tidak ada produk yang cocok dengan pencarian.</p>
                  <button
                    type="button"
                    className="primary-page-button"
                    style={{ marginTop: "12px" }}
                    onClick={() => {
                      setSearchKeyword("");
                      setSelectedCategoryFilter("Semua");
                    }}
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="product-grid">
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product.id || `${product.name}-${product.image}`}
                      product={product}
                      onClick={handleProductClick}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ================= KELOLA PRODUK (CRUD NESTJS) ================= */}
          {activePage === "kelola-produk" && !selectedProduct && !showLogin && (
            <ProductManagement
              products={productsList}
              onRefresh={fetchProducts}
              isConnected={isBackendConnected}
              isLoading={isLoadingBackend}
            />
          )}

          {/* ================= DETAIL PRODUK ================= */}
          {selectedProduct && (
            <section className="product-detail-page">
              <button
                type="button"
                className="back-page-button"
                onClick={() => setSelectedProduct(null)}
              >
                ← Kembali ke Produk
              </button>

              <div className="product-detail-card">
                <div className="product-detail-image">
                  <img
                    src={selectedProduct.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"}
                    alt={selectedProduct.name}
                  />
                </div>

                <div className="product-detail-info">
                  <span className="section-kicker">
                    {selectedProduct.category}
                  </span>

                  <h1>{selectedProduct.name}</h1>
                  <p className="product-detail-price">
                    {typeof selectedProduct.price === "number"
                      ? `Rp ${selectedProduct.price.toLocaleString("id-ID")}`
                      : selectedProduct.price}
                  </p>

                  <p className="product-detail-description">
                    {selectedProduct.description ||
                      "Produk pilihan Storeku dengan kualitas terbaik dan cocok untuk kebutuhan sehari-hari."}
                  </p>

                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button
                      type="button"
                      className="primary-page-button"
                      onClick={() => handleOrderProduct(selectedProduct)}
                    >
                      Pesan Produk Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ================= PROMO ================= */}
          {activePage === "promo" && !selectedProduct && !showLogin && (
            <section className="page-section">
              <div className="page-header">
                <span className="section-kicker">STOREKU PROMOSI</span>
                <h1>Promo Spesial</h1>
                <p>
                  Nikmati berbagai penawaran menarik dengan diskon spesial dari Storeku.
                </p>
              </div>

              <PromoSection onShopClick={() => handlePageChange("produk")} />

              <div className="promo-product-grid">
                {promoProducts.map((product) => (
                  <article
                    key={product.name}
                    className="promo-product-card"
                  >
                    <div className="promo-image-wrapper">
                      <img
                        src={product.image}
                        alt={product.name}
                      />
                      <span className="promo-badge">
                        -{product.discount}
                      </span>
                    </div>

                    <div className="promo-product-info">
                      <span className="promo-category">
                        {product.category}
                      </span>

                      <h3>{product.name}</h3>

                      <span className="promo-old-price">
                        {product.oldPrice}
                      </span>

                      <strong className="promo-price">
                        {product.price}
                      </strong>

                      <button
                        type="button"
                        className="promo-detail-button"
                        onClick={() => handleProductClick(product)}
                      >
                        Lihat Detail Produk
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ================= PEMESANAN ================= */}
          {activePage === "pemesanan" && !showLogin && (
            <section className="page-section">
              <div className="page-header">
                <span className="section-kicker">STATUS BELANJA</span>
                <h1>Pemesanan Saya</h1>
                <p>
                  Daftar transaksi dan pesanan yang sedang kamu lakukan di Storeku.
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="order-empty">
                  <div className="order-empty-icon">🛍️</div>
                  <h2>Belum Ada Pesanan</h2>
                  <p>
                    Kamu belum memiliki pesanan aktif. Yuk, pilih produk yang kamu suka!
                  </p>
                  <button
                    type="button"
                    className="primary-page-button"
                    onClick={() => handlePageChange("produk")}
                  >
                    Mulai Belanja
                  </button>
                </div>
              ) : (
                <div className="order-list">
                  {orders.map((order) => {
                    const formattedOrderPrice = typeof order.price === "number"
                      ? `Rp ${order.price.toLocaleString("id-ID")}`
                      : order.price;

                    return (
                      <div className="order-item-card" key={order.id}>
                        <img
                          src={order.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"}
                          alt={order.productName}
                          className="order-thumb"
                        />
                        <div className="order-details">
                          <h3>{order.productName}</h3>
                          <p>{formattedOrderPrice}</p>
                          <small style={{ color: "#6b7280" }}>Tanggal pesan: {order.date}</small>
                        </div>
                        <span className="order-status-badge">
                          ● {order.status}
                        </span>
                      </div>
                    );
                  })}
                  <div style={{ marginTop: "20px", textAlign: "right" }}>
                    <button
                      type="button"
                      className="primary-page-button"
                      onClick={() => handlePageChange("produk")}
                    >
                      + Tambah Pesanan Lain
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ================= AKUN ================= */}
          {activePage === "akun" && !showLogin && (
            <section className="page-section">
              <div className="page-header">
                <span className="section-kicker">PROFIL PENGGUNA</span>
                <h1>Akun Saya</h1>
                <p>
                  Kelola informasi akun dan preferensi belanja kamu.
                </p>
              </div>

              <div className="account-card">
                <div className="account-avatar">👤</div>

                <div className="account-info">
                  <span>AKUN STOREKU</span>
                  {currentUser ? (
                    <>
                      <h2>Halo, {currentUser.name}!</h2>
                      <p>
                        Email: <strong>{currentUser.email}</strong> • Status: <span style={{ color: "#16a34a", fontWeight: "600" }}>Aktif</span>
                      </p>
                      <button
                        type="button"
                        className="primary-page-button"
                        style={{ backgroundColor: "#ef4444", borderColor: "#ef4444" }}
                        onClick={handleLogout}
                      >
                        Keluar / Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <h2>Selamat Datang!</h2>
                      <p>
                        Silakan masuk untuk mengelola akun, melihat riwayat pesanan, dan informasi profil kamu.
                      </p>
                      <button
                        type="button"
                        className="primary-page-button"
                        onClick={() => setShowLogin(true)}
                      >
                        Masuk / Login
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="account-menu">
                <button
                  type="button"
                  className="account-menu-item"
                  onClick={() => handlePageChange("informasi-akun")}
                >
                  <span className="account-menu-icon">👤</span>
                  <span className="account-menu-text">
                    <strong>Informasi Akun</strong>
                    <small>Lihat detail data akun yang sedang digunakan.</small>
                  </span>
                  <span className="account-menu-arrow">›</span>
                </button>

                <button
                  type="button"
                  className="account-menu-item"
                  onClick={() => handlePageChange("pemesanan")}
                >
                  <span className="account-menu-icon">🛍️</span>
                  <span className="account-menu-text">
                    <strong>Pesanan Saya</strong>
                    <small>Lihat riwayat {orders.length} pesanan belanja kamu.</small>
                  </span>
                  <span className="account-menu-arrow">›</span>
                </button>

                <button
                  type="button"
                  className="account-menu-item"
                  onClick={() => handlePageChange("pengaturan")}
                >
                  <span className="account-menu-icon">⚙️</span>
                  <span className="account-menu-text">
                    <strong>Pengaturan</strong>
                    <small>Atur preferensi tampilan dan notifikasi promo.</small>
                  </span>
                  <span className="account-menu-arrow">›</span>
                </button>
              </div>
            </section>
          )}

          {/* ================= INFORMASI AKUN ================= */}
          {activePage === "informasi-akun" && !showLogin && (
            <section className="page-section">
              <button
                type="button"
                className="back-page-button"
                onClick={handleBackToAccount}
              >
                ← Kembali ke Akun
              </button>

              <div className="page-header">
                <span className="section-kicker">DETAIL PENGGUNA</span>
                <h1>Informasi Akun</h1>
                <p>
                  Informasi profil pengguna Storeku yang sedang aktif.
                </p>
              </div>

              <div className="account-detail-card">
                <div className="account-detail-avatar">👤</div>

                <div className="account-detail-content">
                  <div className="account-detail-row">
                    <span>Nama</span>
                    <strong>{currentUser ? currentUser.name : "Tamu / Pengguna Storeku"}</strong>
                  </div>

                  <div className="account-detail-row">
                    <span>Email</span>
                    <strong>{currentUser ? currentUser.email : "Belum login"}</strong>
                  </div>

                  <div className="account-detail-row">
                    <span>Nomor Telepon</span>
                    <strong>{currentUser ? currentUser.phone : "Belum ditambahkan"}</strong>
                  </div>

                  <div className="account-detail-row">
                    <span>Status Autentikasi</span>
                    <strong style={{ color: currentUser ? "#16a34a" : "#dc2626" }}>
                      {currentUser ? "Sudah Login (Terautentikasi)" : "Belum Login"}
                    </strong>
                  </div>
                </div>
              </div>

              {currentUser ? (
                <button
                  type="button"
                  className="primary-page-button"
                  style={{ backgroundColor: "#ef4444", borderColor: "#ef4444", marginTop: "16px" }}
                  onClick={handleLogout}
                >
                  Keluar dari Akun
                </button>
              ) : (
                <button
                  type="button"
                  className="primary-page-button"
                  style={{ marginTop: "16px" }}
                  onClick={() => setShowLogin(true)}
                >
                  Masuk ke Akun Sekarang
                </button>
              )}
            </section>
          )}

          {/* ================= PENGATURAN ================= */}
          {activePage === "pengaturan" && !showLogin && (
            <section className="page-section">
              <button
                type="button"
                className="back-page-button"
                onClick={handleBackToAccount}
              >
                ← Kembali ke Akun
              </button>

              <div className="page-header">
                <span className="section-kicker">PREFERENSI</span>
                <h1>Pengaturan</h1>
                <p>
                  Sesuaikan preferensi tampilan dan notifikasi Storeku.
                </p>
              </div>

              <div className="settings-card">
                <div className="settings-item">
                  <div>
                    <strong>Notifikasi Promo</strong>
                    <small>
                      Izinkan notifikasi penawaran spesial dan diskon.
                    </small>
                  </div>

                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider" />
                  </label>
                </div>

                <div className="settings-item">
                  <div>
                    <strong>Pengingat Pesanan</strong>
                    <small>
                      Dapatkan status pembaruan transaksi pesanan kamu.
                    </small>
                  </div>

                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider" />
                  </label>
                </div>

                <div className="settings-item">
                  <div>
                    <strong>Bahasa Tampilan</strong>
                    <small>
                      Pilih bahasa aplikasi Storeku.
                    </small>
                  </div>

                  <select defaultValue="id">
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </section>
          )}

          {/* ================= MODAL / HALAMAN LOGIN ================= */}
          {showLogin && (
            <LoginForm
              onBack={() => setShowLogin(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          )}

          <footer className="store-footer">
            <div>
              <strong>STOREKU.</strong>
              <span>
                Temukan gaya terbaikmu bersama Storeku.
              </span>
            </div>

            <p>© 2026 Storeku. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
