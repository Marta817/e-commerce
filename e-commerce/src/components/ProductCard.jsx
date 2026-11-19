function ProductCard({ product, onClick }) {
  const formattedPrice = typeof product.price === "number"
    ? `Rp ${product.price.toLocaleString("id-ID")}`
    : product.price;

  return (
    <article
      className="product-card"
      onClick={() => onClick && onClick(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick && onClick(product);
        }
      }}
    >
      <div className="product-image-wrapper">
        <img
          className="product-image"
          src={product.image}
          alt={product.name}
        />
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{formattedPrice}</p>

        <button
          type="button"
          className="product-detail-button"
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick(product);
          }}
        >
          Lihat Detail
        </button>
      </div>
    </article>
  );
}

export default ProductCard;