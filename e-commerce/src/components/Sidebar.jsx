import {
  House,
  ShoppingBag,
  Tag,
  ClipboardList,
  UserRound,
} from "lucide-react";

function Sidebar({ activePage, onPageChange, t, language, onLanguageChange, onOpenHelp }) {
  const menuItems = [
    {
      icon: House,
      label: t?.home || "Beranda",
      page: "beranda",
    },
    {
      icon: ShoppingBag,
      label: t?.products || "Produk",
      page: "produk",
    },
    {
      icon: Tag,
      label: t?.promo || "Promo",
      page: "promo",
    },
    {
      icon: ClipboardList,
      label: t?.orders || "Pemesanan",
      page: "pemesanan",
    },
    {
      icon: UserRound,
      label: t?.account || "Akun",
      page: "akun",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-heading">
        {t?.menuStoreku || "MENU STOREKU"}
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.page}
              type="button"
              className={`sidebar-link ${
                activePage === item.page ? "active" : ""
              }`}
              onClick={() => onPageChange(item.page)}
            >
              <Icon
                className="sidebar-icon"
                size={19}
                strokeWidth={2}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div style={{ marginBottom: "14px", padding: "0 2px" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.5px" }}>
            {t?.displayLanguageTitle || "Bahasa"}
          </label>
          <select
            value={language}
            onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
            style={{
              width: "100%",
              padding: "7px 10px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "13px",
              fontWeight: "600",
              backgroundColor: "#ffffff",
              color: "#1e293b",
              cursor: "pointer",
            }}
          >
            <option value="id">Indonesia</option>
            <option value="en">English</option>
          </select>
        </div>

        <button
          type="button"
          className="sidebar-help"
          onClick={onOpenHelp}
          style={{
            background: "none",
            border: "none",
            padding: "10px",
            textAlign: "left",
            width: "100%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            borderRadius: "10px",
            transition: "all 0.2s ease",
          }}
          title={t?.helpCenterTitle || "Pusat Bantuan"}
        >
          <span className="help-icon">?</span>

          <div>
            <strong>{t?.needHelp || "Butuh Bantuan?"}</strong>
            <small style={{ display: "block" }}>{t?.contactUs || "Hubungi kami"}</small>
          </div>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
