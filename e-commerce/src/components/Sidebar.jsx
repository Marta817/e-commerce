import {
  House,
  ShoppingBag,
  ShieldCheck,
  Tag,
  ClipboardList,
  UserRound,
} from "lucide-react";

function Sidebar({ activePage, onPageChange }) {
  const buyerMenu = [
    {
      icon: House,
      label: "Beranda",
      page: "beranda",
    },
    {
      icon: ShoppingBag,
      label: "Produk",
      page: "produk",
    },
    {
      icon: Tag,
      label: "Promo",
      page: "promo",
    },
    {
      icon: ClipboardList,
      label: "Pemesanan",
      page: "pemesanan",
    },
    {
      icon: UserRound,
      label: "Akun",
      page: "akun",
    },
  ];

  const adminMenu = [
    {
      icon: ShieldCheck,
      label: "Kelola Produk (Admin)",
      page: "kelola-produk",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-heading">
        MENU PEMBELI
      </div>

      <nav className="sidebar-menu">
        {buyerMenu.map((item) => {
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

      <div className="sidebar-heading" style={{ marginTop: "24px" }}>
        PANEL ADMIN (SELLER)
      </div>

      <nav className="sidebar-menu">
        {adminMenu.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.page}
              type="button"
              className={`sidebar-link ${
                activePage === item.page ? "active" : ""
              }`}
              onClick={() => onPageChange(item.page)}
              style={activePage === item.page ? {} : { color: "#4f46e5" }}
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
        <div className="sidebar-help">
          <span className="help-icon">?</span>

          <div>
            <strong>Butuh Bantuan?</strong>
            <small>Hubungi kami</small>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
