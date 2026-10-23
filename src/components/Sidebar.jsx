import {
  House,
  ShoppingBag,
  Tag,
  ClipboardList,
  UserRound,
} from "lucide-react";

function Sidebar() {
  const menuItems = [
    {
      icon: House,
      label: "Beranda",
      active: true,
    },
    {
      icon: ShoppingBag,
      label: "Produk",
    },
    {
      icon: Tag,
      label: "Promo",
    },
    {
      icon: ClipboardList,
      label: "Pemesanan",
    },
    {
      icon: UserRound,
      label: "Akun",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        MENU STOREKU
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <a
              href="#"
              key={item.label}
              className={`sidebar-link ${
                item.active ? "active" : ""
              }`}
            >
              <Icon
                className="sidebar-icon"
                size={18}
                strokeWidth={2}
              />

              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;