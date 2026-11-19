import { useState, useEffect, useRef } from "react";
import { MessageSquare, ChevronDown, ChevronUp, Send, ArrowLeft, X, Bot, CheckCheck, Clock } from "lucide-react";

export default function HelpCenterModal({
  isOpen,
  onClose,
  currentUser,
  t,
  language,
}) {
  const [view, setView] = useState("faq"); // "faq" | "chat"
  const [activeFaqId, setActiveFaqId] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const userName = currentUser?.name || (language === "en" ? "Customer" : "Pelanggan");

  // Reset state when opened or closed
  useEffect(() => {
    if (isOpen) {
      setView("faq");
      setActiveFaqId(null);
      setSelectedTopic("");
    }
  }, [isOpen]);

  // Scroll chat to bottom
  useEffect(() => {
    if (view === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, view]);

  if (!isOpen) return null;

  const faqItems = [
    {
      id: 1,
      icon: "🛍️",
      question: t?.faq1Q || "Kendala Pemesanan / Cara Pesan Produk",
      answer: t?.faq1A || "Buka menu Produk/Katalog, pilih barang yang kamu inginkan, klik 'Pesan Produk Sekarang', lalu tentukan jumlah dan alamat pengiriman kamu.",
    },
    {
      id: 2,
      icon: "🚚",
      question: t?.faq2Q || "Estimasi Waktu & Pengiriman Barang",
      answer: t?.faq2A || "Pesanan diproses dalam 1-2 hari kerja dan langsung dikirim ke alamat kamu. Status pesanan dapat dipantau langsung di menu 'Pemesanan'.",
    },
    {
      id: 3,
      icon: "🔄",
      question: t?.faq3Q || "Cara Mengubah Alamat / Catatan Pesanan",
      answer: t?.faq3A || "Buka menu 'Pemesanan', lalu klik tombol pensil (Ubah Alamat / Catatan) pada pesanan kamu. Perubahan akan langsung tersimpan.",
    },
    {
      id: 4,
      icon: "❌",
      question: t?.faq4Q || "Cara Membatalkan Pesanan",
      answer: t?.faq4A || "Buka menu 'Pemesanan', lalu klik tombol tempat sampah merah (Batalkan Pesanan) selama status pesanan masih 'Menunggu Konfirmasi'.",
    },
  ];

  const handleToggleFaq = (id) => {
    setActiveFaqId(activeFaqId === id ? null : id);
  };

  const handleStartChat = (topicTitle = "") => {
    const topic = topicTitle || (language === "en" ? "General Issue" : "Kendala Umum");
    setSelectedTopic(topic);
    setView("chat");

    const welcomeGreeting = language === "en"
      ? `Hello ${userName}! Welcome to Storeku Customer Service. How can we help you regarding "${topic}" today?`
      : `Halo ${userName}! Selamat datang di Layanan Pelanggan Storeku. Ada yang bisa kami bantu terkait "${topic}" hari ini?`;

    setMessages([
      {
        id: "cs-init",
        sender: "cs",
        text: welcomeGreeting,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate smart CS agent response (like Shopee bot / live CS)
    setTimeout(() => {
      let replyText = "";
      const lower = text.toLowerCase();

      if (lower.includes("status") || lower.includes("cek") || lower.includes("track")) {
        replyText = language === "en"
          ? `Sure ${userName}! All your active orders are recorded in the system. You can check real-time status and delivery info in the "Orders" menu on the sidebar.`
          : `Baik kak ${userName}! Seluruh pesanan aktif kakak sudah tercatat di sistem Storeku. Kakak bisa melihat status pesanan dan rinciannya langsung di menu "Pemesanan" di sidebar ya.`;
      } else if (lower.includes("alamat") || lower.includes("address") || lower.includes("ubah")) {
        replyText = language === "en"
          ? `To update shipping address or order notes, go to the "Orders" menu and click the pencil (Edit) button on your order card.`
          : `Untuk mengubah alamat pengiriman, kakak cukup masuk ke menu "Pemesanan", lalu klik tombol pensil (Ubah Alamat / Catatan) pada kartu pesanan yang ingin diubah kak.`;
      } else if (lower.includes("batal") || lower.includes("cancel")) {
        replyText = language === "en"
          ? `You can cancel any order directly from the "Orders" menu by clicking the red trash can icon while status is still pending confirmation.`
          : `Pesanan bisa dibatalkan langsung di menu "Pemesanan" dengan menekan tombol tempat sampah merah pada kartu pesanan selama statusnya masih 'Menunggu Konfirmasi' ya kak.`;
      } else if (lower.includes("produk") || lower.includes("stok") || lower.includes("barang") || lower.includes("product")) {
        replyText = language === "en"
          ? `All products shown in our "Products" catalog are ready stock and can be ordered directly anytime.`
          : `Semua produk yang ada di menu "Produk" kami berstatus ready stock kak. Kakak bisa langsung klik 'Pesan Produk Sekarang' untuk memproses pesanan.`;
      } else {
        replyText = language === "en"
          ? `Thank you for reaching out, ${userName}! Our CS team has noted your message regarding "${text}". We are checking your issue right away.`
          : `Terima kasih infonya kak ${userName}! Pesan kakak mengenai "${text}" sudah kami terima dan tim CS Storeku siap membantu kelancaran belanja kakak. Ada hal lain yang ingin ditanyakan?`;
      }

      const csReply = {
        id: `cs-${Date.now()}`,
        sender: "cs",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, csReply]);
      setIsTyping(false);
    }, 900);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "540px",
          height: "640px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= MODAL HEADER ================= */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#ffffff",
          }}
        >
          {view === "chat" ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setView("faq")}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "#334155",
                }}
              >
                <ArrowLeft size={14} />
                <span>FAQ</span>
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "#ea580c",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "14px",
                    position: "relative",
                  }}
                >
                  <Bot size={18} />
                  <span
                    style={{
                      position: "absolute",
                      bottom: "-1px",
                      right: "-1px",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#22c55e",
                      borderRadius: "50%",
                      border: "2px solid #ffffff",
                    }}
                  />
                </div>
                <div>
                  <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", lineHeight: "1.2" }}>
                    {t?.csName || "Customer Service Storeku"}
                  </strong>
                  <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: "600" }}>
                    ● {t?.csOnline || "Online • Siap membantu"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <span className="section-kicker" style={{ fontSize: "11px", letterSpacing: "1px" }}>
                STOREKU CARE
              </span>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: "2px 0 0", color: "#0f172a" }}>
                {t?.helpCenterTitle || "Pusat Bantuan Storeku"}
              </h2>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
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
            <X size={16} />
          </button>
        </div>

        {/* ================= VIEW 1: FAQ INTERAKTIF (BISA DIKLIK) ================= */}
        {view === "faq" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#64748b", lineHeight: "1.5" }}>
              {t?.faqSubtitle || "Pilih kendala yang kamu alami di bawah ini untuk melihat solusinya atau langsung chat dengan CS:"}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {faqItems.map((item) => {
                const isExpanded = activeFaqId === item.id;
                return (
                  <div
                    key={item.id}
                    style={{
                      border: isExpanded ? "1.5px solid #ea580c" : "1px solid #e2e8f0",
                      borderRadius: "12px",
                      overflow: "hidden",
                      transition: "all 0.2s ease",
                      backgroundColor: isExpanded ? "#fffbf7" : "#ffffff",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleFaq(item.id)}
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        background: "none",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "18px" }}>{item.icon}</span>
                        <strong style={{ fontSize: "14px", color: isExpanded ? "#c2410c" : "#1e293b" }}>
                          {item.question}
                        </strong>
                      </div>
                      <span style={{ color: isExpanded ? "#ea580c" : "#94a3b8" }}>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </span>
                    </button>

                    {isExpanded && (
                      <div style={{ padding: "0 16px 16px", borderTop: "1px dashed #fed7aa" }}>
                        <p style={{ margin: "12px 0 14px", fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>
                          {item.answer}
                        </p>

                        <button
                          type="button"
                          onClick={() => handleStartChat(item.question)}
                          style={{
                            padding: "8px 14px",
                            borderRadius: "8px",
                            backgroundColor: "#ea580c",
                            color: "#ffffff",
                            border: "none",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            boxShadow: "0 2px 4px rgba(234, 88, 12, 0.2)",
                          }}
                        >
                          <MessageSquare size={13} />
                          <span>{t?.chatTopicBtn || "💬 Chat CS tentang kendala ini"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Direct Live Chat Button (Shopee Style) */}
            <div
              style={{
                backgroundColor: "#fff7ed",
                border: "1px solid #ffedd5",
                borderRadius: "14px",
                padding: "16px",
                textAlign: "center",
              }}
            >
              <h4 style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: "700", color: "#9a3412" }}>
                {t?.faqStillNeedHelp || "Kendala kamu belum terjawab?"}
              </h4>
              <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#c2410c" }}>
                Tim Customer Service kami siap melayani kamu langsung di dalam web Storeku.
              </p>
              <button
                type="button"
                onClick={() => handleStartChat(language === "en" ? "Live Assistance" : "Bantuan Langsung")}
                className="primary-page-button"
                style={{
                  width: "100%",
                  padding: "11px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "700",
                }}
              >
                <MessageSquare size={16} />
                <span>{t?.chatWithCsBtn || "💬 Chat Langsung dengan CS Storeku"}</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= VIEW 2: LIVE CHAT (SEPERTI DI SHOPEE) ================= */}
        {view === "chat" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#f8fafc", overflow: "hidden" }}>
            {/* Topic pill banner */}
            {selectedTopic && (
              <div
                style={{
                  padding: "6px 14px",
                  backgroundColor: "#fff7ed",
                  borderBottom: "1px solid #fed7aa",
                  fontSize: "12px",
                  color: "#9a3412",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>📌</span>
                <span><strong>{t?.csTopicTag || "Topik Kendala"}:</strong> {selectedTopic}</span>
              </div>
            )}

            {/* Chat Bubbles List */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isUser ? "flex-end" : "flex-start",
                      maxWidth: "85%",
                      alignSelf: isUser ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: isUser ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                        backgroundColor: isUser ? "#ea580c" : "#ffffff",
                        color: isUser ? "#ffffff" : "#1e293b",
                        fontSize: "13px",
                        lineHeight: "1.5",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                        border: isUser ? "none" : "1px solid #e2e8f0",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.text}
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#94a3b8",
                        marginTop: "3px",
                        padding: "0 4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      {msg.time} {isUser && <CheckCheck size={11} color="#ea580c" />}
                    </span>
                  </div>
                );
              })}

              {isTyping && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    alignSelf: "flex-start",
                    padding: "8px 12px",
                    borderRadius: "14px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  <Clock size={12} className="animate-spin" />
                  <span>CS Storeku sedang mengetik...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Shopee-style Question Chips */}
            <div
              style={{
                padding: "8px 14px",
                backgroundColor: "#ffffff",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                gap: "8px",
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              {[
                t?.quickPrompt1 || "Cek status pesanan saya",
                t?.quickPrompt2 || "Mau ubah alamat pengiriman",
                t?.quickPrompt3 || "Tanya ketersediaan produk",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSendMessage(chip)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "999px",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    fontSize: "11px",
                    color: "#334155",
                    cursor: "pointer",
                    fontWeight: "500",
                    flexShrink: 0,
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div
              style={{
                padding: "12px 14px",
                backgroundColor: "#ffffff",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <input
                type="text"
                placeholder={t?.chatInputPlaceholder || "Ketik pesan kendala kamu di sini..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                style={{
                  flex: 1,
                  padding: "9px 12px",
                  borderRadius: "20px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                style={{
                  backgroundColor: inputText.trim() ? "#ea580c" : "#cbd5e1",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: inputText.trim() ? "pointer" : "default",
                  transition: "background-color 0.2s",
                }}
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
