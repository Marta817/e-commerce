function PromoProduct({ product, onClick }) {
  return (
    <article
      className="promo-product-card"
      onClick={() => onClick && onClick(product)}
    >
      <div className="promo-image-wrapper">
        <img src={product.image} alt={product.name} />

        <span className="promo-badge">
          -{product.discount}
        </span>
      </div>

      <div className="promo-product-info">
        <span className="promo-category">{product.category}</span>

        <h3>{product.name}</h3>

        <div className="promo-price">
          <span className="promo-old-price">{product.oldPrice}</span>
          <strong>{product.price}</strong>
        </div>

        <button
          type="button"
          className="promo-detail-button"
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick(product);
          }}
        >
          Lihat Produk
        </button>
      </div>
    </article>
  );
}

export default PromoProduct;