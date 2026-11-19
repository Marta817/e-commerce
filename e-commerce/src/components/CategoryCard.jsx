function CategoryCard({ icon, name, description, onClick }) {
  return (
    <div
      className="category-card"
      onClick={() => onClick && onClick(name)}
      role="button"
      tabIndex={0}
      style={{ cursor: "pointer" }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick && onClick(name);
        }
      }}
    >
      <div className="category-icon">{icon}</div>

      <div className="category-content">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>

      <span className="category-arrow">→</span>
    </div>
  );
}

export default CategoryCard;
