import { useState, useEffect } from "react";
import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Hero from "./components/Hero";
import CategoryCard from "./components/CategoryCard";
import ProductCard from "./components/ProductCard";
import PromoSection from "./components/PromoSection";
import BenefitSection from "./components/BenefitSection";
import OrderManagement from "./components/OrderManagement";
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

const CATEGORIES_LIST = ["Pakaian", "Outerwear", "Sepatu", "Tas", "Aksesori"];

function App() {
  const [activePage, setActivePage] = useState("beranda");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [productsList, setProductsList] = useState(products);

  // Orders State (Backend NestJS /orders - DATA UTAMA USER)
  const [ordersList, setOrdersList] = useState([]);
  const [isOrdersConnected, setIsOrdersConnected] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Modal Order Checkout (POST /orders)
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderAddress, setOrderAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

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

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/products");
      if (res.ok) {
        const data = await res.json();
        setProductsList(data);
      }
    } catch (err) {
      console.warn("Backend products offline, fallback ke data lokal.", err);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const res = await fetch("http://localhost:3000/orders");
      if (res.ok) {
        const data = await res.json();
        setOrdersList(data);
        setIsOrdersConnected(true);
      } else {
        setIsOrdersConnected(false);
      }
    } catch (err) {
      console.warn("Backend orders offline", err);
      setIsOrdersConnected(false);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const handlePageChange = (page) => {
    setActivePage(page);
    setSelectedProduct(null);
    setShowLogin(false);
    setShowOrderModal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowOrderModal(false);
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
    alert(`Selamat datang, ${userData.name}! Login berhasil.`);
  };

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari akun?")) {
      setCurrentUser(null);
      localStorage.removeItem("storeku_user");
      alert("Anda telah berhasil logout.");
    }
  };

  // ================= ORDER FLOW (USER CRUD) =================
  const handleOpenOrderModal = (product) => {
    setSelectedProduct(product);
    setOrderQuantity(1);
    setOrderAddress(currentUser?.address || "Jl. Merdeka No. 45, Jakarta Selatan");
    setOrderNotes("Ukuran L");
    setOrderError("");
    setShowOrderModal(true);
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (!orderAddress || orderAddress.trim().length < 5) {
      setOrderError("Alamat pengiriman minimal 5 karakter.");
      return;
    }

    setIsSubmittingOrder(true);
    setOrderError("");

    const numericPrice = typeof selectedProduct.price === "number"
      ? selectedProduct.price
      : parseInt(String(selectedProduct.price).replace(/\D/g, "")) || 100000;

    const payload = {
      customerName: currentUser ? currentUser.name : "Marta",
      productName: selectedProduct.name,
      price: numericPrice,
      quantity: Number(orderQuantity) || 1,
      address: orderAddress.trim(),
      notes: orderNotes.trim() || undefined,
      image: selectedProduct.image,
    };

    try {
      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setOrderError(
          Array.isArray(data.message) ? data.message.join(", ") : data.message || "Gagal membuat pesanan."
        );
        setIsSubmittingOrder(false);
        return;
      }

      alert(`Pesanan "${selectedProduct.name}" berhasil dibuat dan tersimpan di backend!`);
      setShowOrderModal(false);
      setSelectedProduct(null);
      await fetchOrders();
      handlePageChange("pemesanan");
    } catch (err) {
      setOrderError("Gagal terhubung ke server backend NestJS di http://localhost:3000.");
    } finally {
      setIsSubmittingOrder(false);
    }
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

          {/* ================= PRODUK (KATALOG MURNI BELANJA) ================= */}
          {activePage === "produk" && !selectedProduct && !showLogin && (
            <section className="page-section">
              <div className="page-header">
                <span className="section-kicker">STOREKU KATALOG</span>
                <h1>Katalog Produk</h1>
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
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    style={{ padding: "6px 10px", fontSize: "13px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                  >
                    <option value="Semua">Semua Kategori</option>
                    {CATEGORIES_LIST.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
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
                  <p style={{ fontSize: "18px", fontWeight: "600" }}>Belum ada data Produk.</p>
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

          {/* ================= DETAIL PRODUK (MURNI LIHAT & PESAN) ================= */}
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

                  <div style={{ marginTop: "14px" }}>
                    <button
                      type="button"
                      className="primary-page-button"
                      onClick={() => handleOpenOrderModal(selectedProduct)}
                    >
                      Pesan Produk Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ================= MODAL BUAT PESANAN BARU (POST /orders) ================= */}
          {showOrderModal && selectedProduct && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                padding: "16px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "14px",
                  padding: "24px",
                  maxWidth: "480px",
                  width: "100%",
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
                    Form Pemesanan Barang
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#6b7280" }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center", padding: "12px", background: "#f8fafc", borderRadius: "10px", marginBottom: "16px" }}>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                  />
                  <div>
                    <strong style={{ fontSize: "14px", display: "block" }}>{selectedProduct.name}</strong>
                    <span style={{ fontSize: "13px", color: "#ea580c", fontWeight: "700" }}>
                      {typeof selectedProduct.price === "number"
                        ? `Rp ${selectedProduct.price.toLocaleString("id-ID")}`
                        : selectedProduct.price}
                    </span>
                  </div>
                </div>

                {orderError && (
                  <div style={{ padding: "10px", borderRadius: "6px", backgroundColor: "#fef2f2", color: "#991b1b", fontSize: "13px", marginBottom: "12px" }}>
                    • {orderError}
                  </div>
                )}

                <form onSubmit={handleConfirmOrder}>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                      Jumlah Beli <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                    />
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                      Alamat Pengiriman Lengkap <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Masukkan alamat rumah / kantor kamu (minimal 5 karakter)..."
                      value={orderAddress}
                      onChange={(e) => setOrderAddress(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                    />
                  </div>

                  <div style={{ marginBottom: "18px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                      Catatan Tambahan (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Ukuran L, warna hitam / packing bubble wrap"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => setShowOrderModal(false)}
                      style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #d1d5db", background: "#f9fafb", cursor: "pointer" }}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingOrder}
                      className="primary-page-button"
                      style={{ padding: "8px 20px" }}
                    >
                      {isSubmittingOrder ? "Mengirim..." : "Kirim Pesanan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
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

          {/* ================= PEMESANAN (TERHUBUNG KE BACKEND /orders - FULL USER CRUD) ================= */}
          {activePage === "pemesanan" && !showLogin && (
            <OrderManagement
              orders={ordersList}
              onRefresh={fetchOrders}
              isConnected={isOrdersConnected}
              isLoading={isLoadingOrders}
              onNavigateToProducts={() => handlePageChange("produk")}
            />
          )}

          {/* ================= AKUN ================= */}
          {activePage === "akun" && !showLogin && (
            <section className="page-section">
              <div className="page-header">
                <span className="section-kicker">PROFIL PENGGUNA</span>
                <h1>Akun Saya</h1>
                <p>
                  Kelola data akun pembeli untuk pemesanan barang di Storeku.
                </p>
              </div>

              <div className="account-card">
                <div className="account-avatar">👤</div>

                <div className="account-info">
                  <span>DATA AKUN</span>
                  {currentUser ? (
                    <>
                      <h2>Halo, {currentUser.name}!</h2>
                      <p>
                        No. HP: <strong>{currentUser.phone}</strong>
                      </p>
                      <p style={{ marginTop: "4px" }}>
                        Alamat: <strong>{currentUser.address}</strong>
                      </p>
                      <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          className="primary-page-button"
                          onClick={() => setShowLogin(true)}
                        >
                          Ubah Data Akun
                        </button>
                        <button
                          type="button"
                          className="primary-page-button"
                          style={{ backgroundColor: "#ef4444", borderColor: "#ef4444" }}
                          onClick={handleLogout}
                        >
                          Keluar / Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2>Belum Ada Data Akun</h2>
                      <p>
                        Silakan isi data nama, no. HP, dan alamat pengiriman kamu.
                      </p>
                      <button
                        type="button"
                        className="primary-page-button"
                        onClick={() => setShowLogin(true)}
                      >
                        Isi Data Akun
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
                    <small>Lihat detail nama, no. HP, dan alamat pengiriman.</small>
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
                    <small>Lihat riwayat {ordersList.length} pesanan belanja kamu.</small>
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
                  Data identitas pembeli untuk pengiriman pesanan di Storeku.
                </p>
              </div>

              <div className="account-detail-card">
                <div className="account-detail-avatar">👤</div>

                <div className="account-detail-content">
                  <div className="account-detail-row">
                    <span>Nama</span>
                    <strong>{currentUser ? currentUser.name : "Belum diisi"}</strong>
                  </div>

                  <div className="account-detail-row">
                    <span>No. HP</span>
                    <strong>{currentUser ? currentUser.phone : "Belum diisi"}</strong>
                  </div>

                  <div className="account-detail-row">
                    <span>Alamat</span>
                    <strong>{currentUser ? currentUser.address : "Belum diisi"}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="primary-page-button"
                  onClick={() => setShowLogin(true)}
                >
                  {currentUser ? "Ubah Data Akun" : "Isi Data Akun"}
                </button>

                {currentUser && (
                  <button
                    type="button"
                    className="primary-page-button"
                    style={{ backgroundColor: "#ef4444", borderColor: "#ef4444" }}
                    onClick={handleLogout}
                  >
                    Keluar / Hapus Data
                  </button>
                )}
              </div>
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
              initialData={currentUser}
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
