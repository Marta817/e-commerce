import { useState } from "react";
import { Plus, Edit2, Trash2, RefreshCw, CheckCircle2, AlertCircle, Package } from "lucide-react";

const CATEGORIES = ["Pakaian", "Outerwear", "Sepatu", "Tas", "Aksesori"];
const API_URL = "http://localhost:3000/products";

export default function ProductManagement({
  products,
  onRefresh,
  isConnected,
  isLoading,
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Pakaian",
    stock: "",
    description: "",
    image: "",
    isAvailable: true,
  });

  const [formErrors, setFormErrors] = useState([]);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "Pakaian",
      stock: "",
      description: "",
      image: "",
      isAvailable: true,
    });
    setEditingProduct(null);
    setFormErrors([]);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      price: product.price !== undefined ? product.price : "",
      category: product.category || "Pakaian",
      stock: product.stock !== undefined ? product.stock : "",
      description: product.description || "",
      image: product.image || "",
      isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
    });
    setFormErrors([]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors([]);
    setFeedback(null);
    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price),
      category: formData.category,
      stock: Number(formData.stock),
      description: formData.description.trim() || undefined,
      image: formData.image.trim() || undefined,
      isAvailable: Boolean(formData.isAvailable),
    };

    try {
      let response;
      if (editingProduct) {
        // PATCH update
        response = await fetch(`${API_URL}/${editingProduct.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // POST create
        response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors or conflict exceptions
        if (Array.isArray(data.message)) {
          setFormErrors(data.message);
        } else if (data.message) {
          setFormErrors([data.message]);
        } else {
          setFormErrors(["Terjadi kesalahan saat memproses data ke backend."]);
        }
        setIsSubmitting(false);
        return;
      }

      // Sukses
      setFeedback({
        type: "success",
        message: editingProduct
          ? `Produk "${data.name}" berhasil diperbarui!`
          : `Produk "${data.name}" berhasil ditambahkan!`,
      });

      handleCloseModal();
      if (onRefresh) onRefresh();
    } catch (err) {
      setFormErrors([
        "Gagal terhubung ke backend NestJS di http://localhost:3000. Pastikan backend sedang aktif.",
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus produk "${product.name}"?`
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${product.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok) {
        setFeedback({
          type: "success",
          message: data.message || `Produk "${product.name}" berhasil dihapus.`,
        });
        if (onRefresh) onRefresh();
      } else {
        setFeedback({
          type: "error",
          message: data.message || "Gagal menghapus produk.",
        });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        message: "Gagal terhubung ke backend. Pastikan server NestJS aktif.",
      });
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory =
      selectedCategory === "Semua" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="page-section">
      <div className="page-header" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span className="section-kicker">PANEL ADMIN TOKO • BACKEND NESTJS</span>
            <h1>Kelola Produk (Admin CRUD)</h1>
            <p>
              Halaman khusus pengelola toko / admin untuk mengelola katalog (Tambah, Ubah, dan Hapus data produk yang tersinkronisasi ke backend NestJS).
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              type="button"
              onClick={onRefresh}
              className="see-all-button"
              style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
              title="Refresh Data dari Backend"
            >
              <RefreshCw size={16} className={isLoading ? "spin-icon" : ""} />
              Refresh
            </button>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="primary-page-button"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Plus size={18} />
              Tambah Produk Baru
            </button>
          </div>
        </div>

        {/* Backend status indicator */}
        <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: isConnected ? "#10b981" : "#ef4444",
            }}
          />
          <small style={{ color: isConnected ? "#059669" : "#dc2626", fontWeight: "600" }}>
            {isConnected
              ? "● Backend NestJS Terhubung (http://localhost:3000/products)"
              : "○ Backend Terputus / Offline (Jalankan: npm run start:dev di folder backend)"}
          </small>
        </div>
      </div>

      {/* Feedback Toast / Alert */}
      {feedback && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: feedback.type === "success" ? "#ecfdf5" : "#fef2f2",
            border: `1px solid ${feedback.type === "success" ? "#a7f3d0" : "#fecaca"}`,
            color: feedback.type === "success" ? "#065f46" : "#991b1b",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: "bold" }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Toolbar */}
      <div className="product-toolbar" style={{ flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
        <span>Total: <strong>{filteredProducts.length}</strong> produk</span>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Cari nama produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
            }}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
            }}
          >
            <option value="Semua">Semua Kategori</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div style={{ overflowX: "auto", background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "12px 16px" }}>ID</th>
              <th style={{ padding: "12px 16px" }}>Gambar</th>
              <th style={{ padding: "12px 16px" }}>Nama Produk</th>
              <th style={{ padding: "12px 16px" }}>Kategori</th>
              <th style={{ padding: "12px 16px" }}>Harga</th>
              <th style={{ padding: "12px 16px" }}>Stok</th>
              <th style={{ padding: "12px 16px" }}>Status</th>
              <th style={{ padding: "12px 16px", textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: "32px", textAlign: "center", color: "#6b7280" }}>
                  <Package size={32} style={{ margin: "0 auto 8px auto", opacity: 0.5 }} />
                  <p>Tidak ada data produk ditemukan.</p>
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const formattedPrice = typeof p.price === "number"
                  ? `Rp ${p.price.toLocaleString("id-ID")}`
                  : p.price;

                return (
                  <tr key={p.id || `${p.name}-${p.price}`} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "12px 16px", fontWeight: "600", color: "#6b7280" }}>#{p.id || "-"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <img
                        src={p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"}
                        alt={p.name}
                        style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "6px" }}
                      />
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <strong>{p.name}</strong>
                      {p.description && (
                        <div style={{ fontSize: "12px", color: "#6b7280", maxWidth: "240px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.description}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          borderRadius: "999px",
                          backgroundColor: "#f3f4f6",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {p.category}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: "600", color: "#111827" }}>
                      {formattedPrice}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontWeight: "500", color: p.stock > 0 ? "#111827" : "#ef4444" }}>
                        {p.stock !== undefined ? p.stock : "-"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "500",
                          backgroundColor: p.isAvailable ? "#dcfce7" : "#fee2e2",
                          color: p.isAvailable ? "#15803d" : "#b91c1c",
                        }}
                      >
                        {p.isAvailable ? "Tersedia" : "Kosong"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          style={{
                            padding: "6px 10px",
                            backgroundColor: "#f3f4f6",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "12px",
                            color: "#374151",
                          }}
                          title="Ubah Produk"
                        >
                          <Edit2 size={13} /> Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(p)}
                          style={{
                            padding: "6px 10px",
                            backgroundColor: "#fef2f2",
                            border: "1px solid #fecaca",
                            borderRadius: "6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "12px",
                            color: "#dc2626",
                          }}
                          title="Hapus Produk"
                        >
                          <Trash2 size={13} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah / Edit Produk */}
      {showModal && (
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
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "540px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
                {editingProduct ? `Edit Produk #${editingProduct.id}` : "Tambah Produk Baru"}
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#6b7280" }}
              >
                ✕
              </button>
            </div>

            {/* Validation Errors Alert */}
            {formErrors.length > 0 && (
              <div
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#991b1b",
                  marginBottom: "16px",
                  fontSize: "13px",
                }}
              >
                <strong style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <AlertCircle size={15} /> Gagal memproses request (Validation / Conflict Error):
                </strong>
                <ul style={{ margin: "0 0 0 16px", padding: 0 }}>
                  {formErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                  Nama Produk <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kemeja Flanel Kotak"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px" }}
                />
                <small style={{ color: "#6b7280", fontSize: "11px" }}>Minimal 3 karakter (validasi @MinLength(3))</small>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                    Harga (Rp) <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    placeholder="Contoh: 199000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px" }}
                  />
                  <small style={{ color: "#6b7280", fontSize: "11px" }}>Min. Rp 1.000 (@Min(1000))</small>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                    Kategori <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px" }}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <small style={{ color: "#6b7280", fontSize: "11px" }}>Validasi @IsIn()</small>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                    Stok <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="Contoh: 20"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px" }}
                  />
                  <small style={{ color: "#6b7280", fontSize: "11px" }}>Min. 0 (@Min(0), @IsInt())</small>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                    Status Ketersediaan
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px", fontSize: "14px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    />
                    Produk Tersedia
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                  URL Gambar Produk (Opsional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px" }}
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                  Deskripsi Produk (Opsional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan deskripsi singkat mengenai produk..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "#f9fafb",
                    color: "#374151",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="primary-page-button"
                  style={{
                    padding: "8px 20px",
                    fontSize: "14px",
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                >
                  {isSubmitting ? "Menyimpan..." : editingProduct ? "Simpan Perubahan" : "Tambah Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

