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
import { translations } from "./utils/translations";

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
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Language State
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem("storeku_lang");
      return saved === "en" ? "en" : "id";
    } catch {
      return "id";
    }
  });

  const t = translations[language] || translations.id;

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem("storeku_lang", newLang);
  };

  // Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("storeku_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) {
          return {
            name: parsed.name,
            phone: parsed.phone || "0812-3456-7890",
            address: parsed.address || "Jl. Merdeka No. 45, Jakarta Selatan",
          };
        }
      }
      const initial = {
        name: "Marta",
        phone: "0812-3456-7890",
        address: "Jl. Merdeka No. 45, Jakarta Selatan",
      };
      localStorage.setItem("storeku_user", JSON.stringify(initial));
      return initial;
    } catch {
      return {
        name: "Marta",
        phone: "0812-3456-7890",
        address: "Jl. Merdeka No. 45, Jakarta Selatan",
      };
    }
  });

  // Profile Form State
  const [profileName, setProfileName] = useState(() => currentUser?.name || "Marta");
  const [profilePhone, setProfilePhone] = useState(() => currentUser?.phone || "0812-3456-7890");
  const [profileAddress, setProfileAddress] = useState(() => currentUser?.address || "Jl. Merdeka No. 45, Jakarta Selatan");
  const [profileSuccessMessage, setProfileSuccessMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || "");
      setProfilePhone(currentUser.phone || "");
      setProfileAddress(currentUser.address || "");
    }
  }, [currentUser]);

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
    setShowHelpModal(false);
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

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    const updated = {
      name: profileName.trim() || "Marta",
      phone: profilePhone.trim() || "0812-3456-7890",
      address: profileAddress.trim() || "Jl. Merdeka No. 45, Jakarta Selatan",
    };
    setCurrentUser(updated);
    localStorage.setItem("storeku_user", JSON.stringify(updated));
    setOrderAddress(updated.address);
    setProfileSuccessMessage("Data akun berhasil disimpan!");
    setTimeout(() => {
      setProfileSuccessMessage("");
    }, 3500);
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("storeku_user", JSON.stringify(userData));
    setShowLogin(false);
    setActivePage("akun");
  };

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data akun dari browser?")) {
      setCurrentUser(null);
      localStorage.removeItem("storeku_user");
      setProfileName("");
      setProfilePhone("");
      setProfileAddress("");
      setProfileSuccessMessage("Data akun telah dibersihkan.");
      setTimeout(() => setProfileSuccessMessage(""), 3000);
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
        t={t}
      />

      <div className="app-body">
        <Sidebar
          activePage={activePage}
          onPageChange={handlePageChange}
          t={t}
          language={language}
          onLanguageChange={handleLanguageChange}
          onOpenHelp={() => setShowHelpModal(true)}
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
                      placeholder={t.searchPlaceholder}
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
                    <span>{t.comfortableShopping}</span>
                  </div>
                </section>

                <Hero onExploreClick={() => handlePageChange("produk")} t={t} />

                <section className="section-block">
                  <div className="section-heading">
                    <div>
                      <span className="section-kicker">{t.categoriesTitle}</span>
                      <h2>{t.categoriesHeading}</h2>
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
                        {t.featuredTitle}
                      </span>
                      <h2>{t.featuredHeading}</h2>
                    </div>

                    <button
                      type="button"
                      className="see-all-button"
                      onClick={() => handlePageChange("produk")}
                    >
                      {t.seeAll}
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

                <PromoSection onShopClick={() => handlePageChange("promo")} t={t} />
                <BenefitSection t={t} />
              </>
            )}

          {/* ================= PRODUK (KATALOG MURNI BELANJA) ================= */}
          {activePage === "produk" && !selectedProduct && !showLogin && (
            <section className="page-section">
              <div className="page-header">
                <span className="section-kicker">{t.catalogKicker}</span>
                <h1>{t.catalogTitle}</h1>
                <p>{t.catalogDesc}</p>
              </div>

              <div className="product-toolbar" style={{ flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span>{t.showing} <strong>{displayedProducts.length}</strong> {t.productsWord}</span>
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
                    <option value="Semua">{t.allCategories}</option>
                    {CATEGORIES_LIST.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ padding: "6px 10px", fontSize: "13px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                  >
                    <option value="terbaru">{t.sortNewest}</option>
                    <option value="termurah">{t.sortCheapest}</option>
                    <option value="termahal">{t.sortExpensive}</option>
                  </select>
                </div>
              </div>

              {displayedProducts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
                  <p style={{ fontSize: "18px", fontWeight: "600" }}>{t.noProducts}</p>
                  <button
                    type="button"
                    className="primary-page-button"
                    style={{ marginTop: "12px" }}
                    onClick={() => {
                      setSearchKeyword("");
                      setSelectedCategoryFilter("Semua");
                    }}
                  >
                    {t.resetFilter}
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
                {t.backToProducts}
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
                    {selectedProduct.description || t.defaultProductDesc}
                  </p>

                  <div style={{ marginTop: "14px" }}>
                    <button
                      type="button"
                      className="primary-page-button"
                      onClick={() => handleOpenOrderModal(selectedProduct)}
                    >
                      {t.orderProductNow}
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
                    {t.orderFormTitle}
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
                      {t.buyQuantity} <span style={{ color: "#ef4444" }}>*</span>
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
                      {t.shippingAddress} <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder={t.shippingAddressPlaceholder}
                      value={orderAddress}
                      onChange={(e) => setOrderAddress(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                    />
                  </div>

                  <div style={{ marginBottom: "18px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                      {t.notes}
                    </label>
                    <input
                      type="text"
                      placeholder={t.notesPlaceholder}
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
                      {t.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingOrder}
                      className="primary-page-button"
                      style={{ padding: "8px 20px" }}
                    >
                      {isSubmittingOrder ? t.submittingOrder : t.submitOrder}
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
                <span className="section-kicker">{t.promoPageKicker}</span>
                <h1>{t.promoPageTitle}</h1>
                <p>{t.promoPageDesc}</p>
              </div>

              <PromoSection onShopClick={() => handlePageChange("produk")} t={t} />

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
                        {t.viewProductDetail}
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
                <span className="section-kicker">{t.accountKicker}</span>
                <h1>{t.accountTitle}</h1>
                <p>{t.accountDesc}</p>
              </div>

              <div className="account-card">
                <div className="account-avatar">👤</div>

                <div className="account-info">
                  <span>{t.accountDataTag}</span>
                  {currentUser ? (
                    <>
                      <h2>{t.hello}, {currentUser.name}!</h2>
                      <p>
                        {t.noHp}: <strong>{currentUser.phone}</strong>
                      </p>
                      <p style={{ marginTop: "4px" }}>
                        {t.address}: <strong>{currentUser.address}</strong>
                      </p>
                      <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          className="primary-page-button"
                          onClick={() => handlePageChange("informasi-akun")}
                        >
                          {t.editAccountData}
                        </button>
                        <button
                          type="button"
                          className="primary-page-button"
                          style={{ backgroundColor: "#ef4444", borderColor: "#ef4444" }}
                          onClick={handleLogout}
                        >
                          {t.clearLogout}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2>{t.noAccountYet}</h2>
                      <p>{t.fillAccountPrompt}</p>
                      <button
                        type="button"
                        className="primary-page-button"
                        onClick={() => handlePageChange("informasi-akun")}
                      >
                        {t.fillAccountData}
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
                    <strong>{t.menuInfoAkunTitle}</strong>
                    <small>{t.menuInfoAkunDesc}</small>
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
                    <strong>{t.menuOrdersTitle}</strong>
                    <small>{t.menuOrdersDesc}</small>
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
                    <strong>{t.menuSettingsTitle}</strong>
                    <small>{t.menuSettingsDesc}</small>
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
                {t.backToAccount}
              </button>

              <div className="page-header">
                <span className="section-kicker">{t.infoAkunKicker}</span>
                <h1>{t.infoAkunTitle}</h1>
                <p>{t.infoAkunDesc}</p>
              </div>

              {profileSuccessMessage && (
                <div
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "#f0fdf4",
                    color: "#166534",
                    border: "1px solid #bbf7d0",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>✓</span>
                  <span>{profileSuccessMessage}</span>
                </div>
              )}

              <div className="account-detail-card" style={{ maxWidth: "600px" }}>
                <div className="account-detail-avatar">👤</div>

                <form onSubmit={handleSaveProfile} style={{ flex: 1 }}>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#374151" }}>
                      {t.fullName} <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Marta"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        fontSize: "14px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#374151" }}>
                      {t.phoneWhatsapp} <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 0812-3456-7890"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        fontSize: "14px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "18px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#374151" }}>
                      {t.fullAddress} <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Contoh: Jl. Merdeka No. 45, Jakarta Selatan"
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        fontSize: "14px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                      type="submit"
                      className="primary-page-button"
                      style={{ padding: "10px 22px" }}
                    >
                      {t.saveAccountData}
                    </button>

                    <button
                      type="button"
                      className="primary-page-button"
                      style={{ backgroundColor: "#f3f4f6", borderColor: "#d1d5db", color: "#374151" }}
                      onClick={() => {
                        if (currentUser) {
                          setProfileName(currentUser.name || "");
                          setProfilePhone(currentUser.phone || "");
                          setProfileAddress(currentUser.address || "");
                        } else {
                          setProfileName("Marta");
                          setProfilePhone("0812-3456-7890");
                          setProfileAddress("Jl. Merdeka No. 45, Jakarta Selatan");
                        }
                      }}
                    >
                      {t.resetForm}
                    </button>
                  </div>
                </form>
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
                {t.backToAccount}
              </button>

              <div className="page-header">
                <span className="section-kicker">{t.settingsKicker}</span>
                <h1>{t.settingsTitle}</h1>
                <p>{t.settingsDesc}</p>
              </div>

              <div className="settings-card">
                <div className="settings-item">
                  <div>
                    <strong>{t.promoNotifTitle}</strong>
                    <small>{t.promoNotifDesc}</small>
                  </div>

                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider" />
                  </label>
                </div>

                <div className="settings-item">
                  <div>
                    <strong>{t.orderReminderTitle}</strong>
                    <small>{t.orderReminderDesc}</small>
                  </div>

                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider" />
                  </label>
                </div>

                <div className="settings-item">
                  <div>
                    <strong>{t.displayLanguageTitle}</strong>
                    <small>{t.displayLanguageDesc}</small>
                  </div>

                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      fontWeight: "600",
                      fontSize: "14px",
                      backgroundColor: "#f9fafb",
                      cursor: "pointer",
                    }}
                  >
                    <option value="id">Indonesia</option>
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
              t={t}
            />
          )}

          {/* ================= MODAL PUSAT BANTUAN ================= */}
          {showHelpModal && (
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
              onClick={() => setShowHelpModal(false)}
            >
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  padding: "26px",
                  maxWidth: "540px",
                  width: "100%",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
                    <span className="section-kicker">STOREKU CARE</span>
                    <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: "4px 0 0" }}>
                      {t.helpCenterTitle}
                    </h2>
                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>
                      {t.helpCenterSubtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHelpModal(false)}
                    style={{
                      background: "#f1f5f9",
                      border: "none",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      fontSize: "16px",
                      cursor: "pointer",
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>💡</span> {t.faqTitle}
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                      <strong style={{ fontSize: "13px", color: "#0f172a", display: "block", marginBottom: "4px" }}>
                        🛍️ {t.faq1Q}
                      </strong>
                      <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>
                        {t.faq1A}
                      </p>
                    </div>

                    <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                      <strong style={{ fontSize: "13px", color: "#0f172a", display: "block", marginBottom: "4px" }}>
                        🔄 {t.faq2Q}
                      </strong>
                      <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>
                        {t.faq2A}
                      </p>
                    </div>

                    <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                      <strong style={{ fontSize: "13px", color: "#0f172a", display: "block", marginBottom: "4px" }}>
                        ❌ {t.faq3Q}
                      </strong>
                      <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>
                        {t.faq3A}
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ background: "#eff6ff", padding: "14px", borderRadius: "12px", border: "1px solid #bfdbfe", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1e3a8a", margin: "0 0 8px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>📞</span> {t.contactTitle}
                  </h3>
                  <div style={{ fontSize: "13px", color: "#1e40af", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div><strong>WhatsApp:</strong> +62 812-3456-7890</div>
                    <div><strong>Email:</strong> support@storeku.id</div>
                    <div style={{ fontSize: "12px", color: "#3b82f6", marginTop: "4px" }}>⏰ {t.csHours}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowHelpModal(false)}
                  className="primary-page-button"
                  style={{ width: "100%", padding: "10px" }}
                >
                  {t.closeHelp}
                </button>
              </div>
            </div>
          )}

          <footer className="store-footer">
            <div>
              <strong>STOREKU.</strong>
              <span>
                {t.footerTagline}
              </span>
            </div>

            <p>© 2026 Storeku. {t.allRightsReserved}</p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
