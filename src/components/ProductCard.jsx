
function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        <img
          className="product-image"
          src={product.image}
          alt={product.name}
        />
      </div>

      <div className="product-info">
        <span className="product-category">
          {product.category}
        </span>

        <h3 className="product-name">{product.name}</h3>

        <p className="product-price">{product.price}</p>
      </div>
    </article>
  );
}

export default ProductCard;
