import {
  House,
  ShoppingBag,
  Tag,
  ClipboardList,
  UserRound,
} from "lucide-react";

function Sidebar({ activePage, onPageChange }) {
  const menuItems = [
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

  return (
    <aside className="sidebar">
      <div className="sidebar-heading">
        MENU STOREKU
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