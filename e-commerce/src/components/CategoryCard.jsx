function CategoryCard({ icon, name, description }) {
  return (
    <a href="#products" className="category-card">
      <div className="category-icon">{icon}</div>

      <div className="category-content">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>

      <span className="category-arrow">→</span>
    </a>
  );
}

export default CategoryCard;