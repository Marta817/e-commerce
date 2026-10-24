
import { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Hero from "./components/Hero";
import CategoryCard from "./components/CategoryCard";
import ProductCard from "./components/ProductCard";
import PromoSection from "./components/PromoSection";
import BenefitSection from "./components/BenefitSection";

import products from "./data/product";

const categories = [
  { icon: "👕", name: "Pakaian", description: "T-Shirt, kemeja, celana" },
  { icon: "👟", name: "Sepatu", description: "Sneakers dan casual" },
  { icon: "👜", name: "Tas", description: "Backpack dan tote bag" },
  { icon: "⌚", name: "Aksesori", description: "Jam, kacamata, dan lainnya" },
];

const promoProducts = [
  {
    name: "Sneakers",
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
    name: "Backpack",
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

  return (
    <div className="storeku-app">
      <Header />

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
                      placeholder="Cari produk favoritmu..."
                    />
                  </div>

                  <div className="top-bar-info">
                    <span>✨</span>
                    <span>Belanja nyaman di Storeku</span>
                  </div>
                </section>

                <Hero />

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
                    {products.slice(0, 8).map((product) => (
                      <ProductCard
                        key={`${product.name}-${product.image}`}
                        product={product}
                        onClick={handleProductClick}
                      />
                    ))}
                  </div>
                </section>

                <PromoSection />
                <BenefitSection />
              </>
            )}

          {/* ================= PRODUK ================= */}
          {activePage === "produk" && !selectedProduct && (
            <section className="page-section">
              <div className="page-header">
                <span className="section-kicker">STOREKU</span>
                <h1>Produk</h1>
                <p>
                  Temukan berbagai produk fashion dan lifestyle
                  pilihan Storeku.
                </p>
              </div>

              <div className="product-toolbar">
                <span>Menampilkan {products.length} produk</span>

                <select defaultValue="terbaru">
                  <option value="terbaru">Produk Terbaru</option>
                  <option value="termurah">Harga Terendah</option>
                  <option value="termahal">Harga Tertinggi</option>
                </select>
              </div>

              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard
                    key={`${product.name}-${product.image}`}
                    product={product}
                    onClick={handleProductClick}
                  />
                ))}
              </div>
            </section>
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
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                  />
                </div>

                <div className="product-detail-info">
                  <span className="section-kicker">
                    {selectedProduct.category}
                  </span>

                  <h1>{selectedProduct.name}</h1>
                  <p className="product-detail-price">
                    {selectedProduct.price}
                  </p>

                  <p className="product-detail-description">
                    Produk pilihan Storeku dengan kualitas terbaik
                    dan cocok untuk kebutuhan sehari-hari.
                  </p>

                  <button
                    type="button"
                    className="primary-page-button"
                    onClick={() => handlePageChange("pemesanan")}
                  >
                    Pesan Produk
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ================= PROMO ================= */}
          {activePage === "promo" &&
            !selectedProduct &&
            !showLogin && (
              <section className="page-section">
                <div className="page-header">
                  <span className="section-kicker">STOREKU</span>
                  <h1>Promo</h1>
                  <p>
                    Nikmati berbagai penawaran menarik dengan harga
                    spesial dari Storeku.
                  </p>
                </div>

                <PromoSection />

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
                          Lihat Produk
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
                <span className="section-kicker">STOREKU</span>
                <h1>Pemesanan</h1>
                <p>
                  Kelola dan lihat pesanan yang kamu lakukan di
                  Storeku.
                </p>
              </div>

              <div className="order-empty">
                <div className="order-empty-icon">🛍️</div>
                <h2>Belum Ada Pesanan</h2>
                <p>
                  Kamu belum memiliki pesanan. Yuk, pilih produk
                  yang kamu suka!
                </p>

                <button
                  type="button"
                  className="primary-page-button"
                  onClick={() => handlePageChange("produk")}
                >
                  Mulai Belanja
                </button>
              </div>
            </section>
          )}

          {/* ================= AKUN ================= */}
          {activePage === "akun" && !showLogin && (
            <section className="page-section">
              <div className="page-header">
                <span className="section-kicker">STOREKU</span>
                <h1>Akun</h1>
                <p>
                  Kelola informasi akun dan preferensi kamu.
                </p>
              </div>

              <div className="account-card">
                <div className="account-avatar">👤</div>

                <div className="account-info">
                  <span>AKUN STOREKU</span>
                  <h2>Selamat Datang!</h2>
                  <p>
                    Silakan masuk untuk mengelola akun, pesanan,
                    dan informasi pribadi kamu.
                  </p>

                  <button
                    type="button"
                    className="primary-page-button"
                    onClick={() => setShowLogin(true)}
                  >
                    Masuk / Login
                  </button>
                </div>
              </div>

              <div className="account-menu">
                <button
                  type="button"
                  className="account-menu-item"
                  onClick={() =>
                    handlePageChange("informasi-akun")
                  }
                >
                  <span className="account-menu-icon">👤</span>
                  <span className="account-menu-text">
                    <strong>Informasi Akun</strong>
                    <small>
                      Lihat informasi dan detail akun kamu.
                    </small>
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
                    <small>
                      Lihat status dan riwayat pesanan kamu.
                    </small>
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
                    <small>
                      Atur preferensi tampilan dan notifikasi.
                    </small>
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
                <span className="section-kicker">AKUN STOREKU</span>
                <h1>Informasi Akun</h1>
                <p>
                  Informasi dasar akun yang digunakan di Storeku.
                </p>
              </div>

              <div className="account-detail-card">
                <div className="account-detail-avatar">👤</div>

                <div className="account-detail-content">
                  <div className="account-detail-row">
                    <span>Nama</span>
                    <strong>Pengguna Storeku</strong>
                  </div>

                  <div className="account-detail-row">
                    <span>Email</span>
                    <strong>Belum ditambahkan</strong>
                  </div>

                  <div className="account-detail-row">
                    <span>Nomor Telepon</span>
                    <strong>Belum ditambahkan</strong>
                  </div>

                  <div className="account-detail-row">
                    <span>Status Akun</span>
                    <strong>Belum login</strong>
                  </div>
                </div>
              </div>

              <p className="account-note">
                Informasi ini masih berupa tampilan contoh. Data
                akun belum tersimpan ke database.
              </p>

              <button
                type="button"
                className="primary-page-button"
                onClick={() => setShowLogin(true)}
              >
                Masuk ke Akun
              </button>
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
                <span className="section-kicker">AKUN STOREKU</span>
                <h1>Pengaturan</h1>
                <p>
                  Sesuaikan preferensi penggunaan Storeku.
                </p>
              </div>

              <div className="settings-card">
                <div className="settings-item">
                  <div>
                    <strong>Notifikasi Promo</strong>
                    <small>
                      Izinkan tampilan notifikasi penawaran dan promo.
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
                      Aktifkan pengingat untuk informasi pesanan.
                    </small>
                  </div>

                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider" />
                  </label>
                </div>

                <div className="settings-item">
                  <div>
                    <strong>Bahasa</strong>
                    <small>
                      Pilih bahasa yang digunakan pada tampilan.
                    </small>
                  </div>

                  <select defaultValue="id">
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <p className="account-note">
                Pengaturan ini masih berlaku pada tampilan halaman
                dan belum disimpan secara permanen.
              </p>
            </section>
          )}

          {/* ================= LOGIN ================= */}
          {showLogin && (
            <section className="login-page">
              <div className="login-card">
                <div className="login-header">
                  <span className="section-kicker">STOREKU</span>
                  <h1>Masuk ke Akun</h1>
                  <p>
                    Masuk untuk mengelola akun dan pesanan kamu.
                  </p>
                </div>

                <form
                  className="login-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert(
                      "Form login ini belum terhubung ke sistem autentikasi."
                    );
                  }}
                >
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Masukkan email"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Masukkan password"
                      autoComplete="current-password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="primary-page-button"
                  >
                    Masuk / Login
                  </button>
                </form>

                <button
                  type="button"
                  className="back-button"
                  onClick={() => setShowLogin(false)}
                >
                  ← Kembali ke Akun
                </button>
              </div>
            </section>
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
