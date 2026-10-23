function CategoryCard({ icon, name, description }) {
  return (
    <a href="#" className="category-card">
      <div className="category-icon">{icon}</div>

      <span className="category-name">{name}</span>

      <small>{description}</small>
    </a>
  );
}

export default CategoryCard;