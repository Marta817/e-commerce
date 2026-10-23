
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
  {
    icon: "👕",
    name: "Pakaian",
    description: "Gaya harian",
  },
  {
    icon: "🧥",
    name: "Outerwear",
    description: "Look modern",
  },
  {
    icon: "👟",
    name: "Sepatu",
    description: "Nyaman dipakai",
  },
  {
    icon: "👜",
    name: "Tas",
    description: "Praktis & stylish",
  },
  {
    icon: "🕶️",
    name: "Aksesori",
    description: "Lengkapi gayamu",
  },
  {
    icon: "✨",
    name: "Pilihan",
    description: "Favorit Storeku",
  },
];

function App() {
  return (
    <>
      <Header />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <section className="search-area">
            <div className="address-card">
              <span className="address-icon">⌖</span>

              <div>
                <small>Alamat kirim:</small>
                <strong>
                  Jl. Kebon Sirih Desa Dukuhwaluh,
                  Kabupaten Banyumas
                </strong>
              </div>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Cari produk (tas, sepatu, kaos, jaket, dll)..."
              />
              <button type="button">Cari</button>
            </div>
          </section>

          <Hero />

          <section className="category-section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">
                  KATEGORI
                </span>
                <h2>Pilih Sesuai Gayamu</h2>
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

          <section className="product-section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">
                  KOLEKSI PILIHAN
                </span>
                <h2>Produk Favorit</h2>
              </div>

              <a href="#produk" className="view-all">
                Lihat Semua →
              </a>
            </div>

            <div className="product-grid" id="produk">
              {products.map((product, index) => (
                <ProductCard
                  key={product.name}
                  product={product}
                  favorite={index === 0}
                />
              ))}
            </div>
          </section>

          <PromoSection />

          <BenefitSection />
        </main>
      </div>
    </>
  );
}

export default App;
