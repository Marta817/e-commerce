import { useState } from "react";
import { Edit3, Trash2, RefreshCw, CheckCircle2, AlertCircle, ShoppingBag, MapPin, FileText } from "lucide-react";

const API_ORDERS_URL = "http://localhost:3000/orders";

export default function OrderManagement({
  orders,
  onRefresh,
  isConnected,
  isLoading,
  onNavigateToProducts,
}) {
  const [editingOrder, setEditingOrder] = useState(null);
  const [editAddress, setEditAddress] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const handleOpenEdit = (order) => {
    setEditingOrder(order);
    setEditAddress(order.address || "");
    setEditNotes(order.notes || "");
    setFormErrors([]);
  };

  const handleCloseEdit = () => {
    setEditingOrder(null);
    setEditAddress("");
    setEditNotes("");
    setFormErrors([]);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;

    setIsSubmitting(true);
    setFormErrors([]);

    try {
      const response = await fetch(`${API_ORDERS_URL}/${editingOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: editAddress.trim(),
          notes: editNotes.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.message)) {
          setFormErrors(data.message);
        } else if (data.message) {
          setFormErrors([data.message]);
        } else {
          setFormErrors(["Gagal memperbarui pesanan."]);
        }
        setIsSubmitting(false);
        return;
      }

      setFeedback({
        type: "success",
        message: `Pesanan #${editingOrder.id} (${editingOrder.productName}) berhasil diperbarui!`,
      });

      handleCloseEdit();
      if (onRefresh) onRefresh();
    } catch (err) {
      setFormErrors(["Gagal terhubung ke server backend NestJS."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOrder = async (order) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin membatalkan pesanan #${order.id} (${order.productName})?`
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_ORDERS_URL}/${order.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok) {
        setFeedback({
          type: "success",
          message: data.message || `Pesanan #${order.id} berhasil dibatalkan.`,
        });
        if (onRefresh) onRefresh();
      } else {
        setFeedback({
          type: "error",
          message: data.message || "Gagal membatalkan pesanan.",
        });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        message: "Gagal terhubung ke backend. Pastikan server NestJS aktif.",
      });
    }
  };

  return (
    <section className="page-section">
      <div className="page-header" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span className="section-kicker">STATUS BELANJA</span>
            <h1>Pemesanan Saya</h1>
            <p>
              Kelola dan pantau pesanan belanja Anda di Storeku (Lihat status, ubah alamat/catatan, atau batalkan pesanan).
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              type="button"
              onClick={onRefresh}
              className="see-all-button"
              style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
              title="Refresh Data Pesanan"
            >
              <RefreshCw size={16} className={isLoading ? "spin-icon" : ""} />
              Refresh Pesanan
            </button>

            <button
              type="button"
              onClick={onNavigateToProducts}
              className="primary-page-button"
            >
              + Pesan Produk Lain
            </button>
          </div>
        </div>

        {/* Status Koneksi Backend */}
        <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
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
              ? "● Data Pesanan Terhubung ke Backend NestJS (http://localhost:3000/orders)"
              : "○ Backend Terputus / Offline (Pastikan backend berjalan di port 3000)"}
          </small>
        </div>
      </div>

      {/* Feedback Toast */}
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

      {/* Konten Pesanan */}
      {orders.length === 0 ? (
        <div className="order-empty">
          <div className="order-empty-icon">🛍️</div>
          <h2>Belum Ada Pesanan</h2>
          <p>
            Kamu belum memiliki pesanan aktif. Yuk, pilih produk yang kamu suka di katalog!
          </p>
          <button
            type="button"
            className="primary-page-button"
            onClick={onNavigateToProducts}
          >
            Mulai Belanja
          </button>
        </div>
      ) : (
        <div className="order-list" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {orders.map((order) => {
            const formattedTotal = typeof order.totalPrice === "number"
              ? `Rp ${order.totalPrice.toLocaleString("id-ID")}`
              : typeof order.price === "number"
                ? `Rp ${order.price.toLocaleString("id-ID")}`
                : order.price;

            const formattedDate = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Baru saja";

            return (
              <div
                key={order.id}
                style={{
                  background: "#ffffff",
                  borderRadius: "14px",
                  border: "1px solid #e5e7eb",
                  padding: "20px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                  display: "grid",
                  gridTemplateColumns: "80px 1fr auto",
                  gap: "20px",
                  alignItems: "center",
                }}
              >
                {/* Gambar Produk */}
                <img
                  src={order.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"}
                  alt={order.productName}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "10px",
                    objectFit: "cover",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #f1f5f9",
                  }}
                />

                {/* Detail Pesanan */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#6b7280" }}>
                      PESANAN #{order.id}
                    </span>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: "600",
                        backgroundColor:
                          order.status === "Selesai"
                            ? "#dcfce7"
                            : order.status === "Dikirim"
                              ? "#e0e7ff"
                              : "#fef3c7",
                        color:
                          order.status === "Selesai"
                            ? "#15803d"
                            : order.status === "Dikirim"
                              ? "#4338ca"
                              : "#b45309",
                      }}
                    >
                      ● {order.status || "Diproses"}
                    </span>
                  </div>

                  <h3 style={{ margin: "0 0 6px 0", fontSize: "17px", fontWeight: "700", color: "#111827" }}>
                    {order.productName}
                  </h3>

                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "13px", color: "#4b5563" }}>
                    <span>
                      Jumlah: <strong>{order.quantity || 1} barang</strong>
                    </span>
                    <span>
                      Total: <strong style={{ color: "#ea580c" }}>{formattedTotal}</strong>
                    </span>
                    <span>
                      Pemesan: <strong>{order.customerName || "Marta"}</strong>
                    </span>
                  </div>

                  {/* Alamat & Catatan */}
                  <div style={{ marginTop: "8px", fontSize: "12px", color: "#6b7280", display: "flex", flexDirection: "column", gap: "3px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <MapPin size={13} style={{ color: "#9ca3af" }} />
                      <span>Alamat: <strong>{order.address}</strong></span>
                    </div>
                    {order.notes && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <FileText size={13} style={{ color: "#9ca3af" }} />
                        <span>Catatan: <em>{order.notes}</em></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tombol Aksi (Ubah & Batalkan) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "140px" }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(order)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "#f9fafb",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#374151",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      transition: "all 0.2s",
                    }}
                  >
                    <Edit3 size={14} /> Ubah Alamat
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteOrder(order)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #fecaca",
                      backgroundColor: "#fef2f2",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#dc2626",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      transition: "all 0.2s",
                    }}
                  >
                    <Trash2 size={14} /> Batalkan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Edit Alamat / Catatan Pesanan */}
      {editingOrder && (
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
                Ubah Alamat / Catatan Pesanan #{editingOrder.id}
              </h2>
              <button
                type="button"
                onClick={handleCloseEdit}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#6b7280" }}
              >
                ✕
              </button>
            </div>

            {formErrors.length > 0 && (
              <div
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#991b1b",
                  marginBottom: "14px",
                  fontSize: "13px",
                }}
              >
                {formErrors.map((err, idx) => (
                  <div key={idx}>• {err}</div>
                ))}
              </div>
            )}

            <form onSubmit={handleSaveEdit}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                  Alamat Pengiriman Baru <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Masukkan alamat pengiriman baru (minimal 5 karakter)..."
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px" }}
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                  Catatan untuk Penjual (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Titip di satpam / ganti ukuran XL"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={handleCloseEdit}
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
                  style={{ padding: "8px 20px", fontSize: "14px" }}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

