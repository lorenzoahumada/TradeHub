import { useNavigate } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import { useProducts } from '../context/ProductContext';

function ProductCard({ product, width = '370px', height = '300px' }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleFavorite, favoriteIds } = useProducts();

  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="card" style={{ width }}>
      <div className="card-body">
        {product.owner_name && <p className="text-muted">{product.owner_name}</p>}
        <button
          className="btn btn-light position-absolute top-0 end-0 m-2"
          onClick={() => toggleFavorite(product.id)}
        >
          {favoriteIds.includes(product.id) ? '❤️' : '🤍'}
        </button>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title">{product.name}</h5>
          {product.stock === 0 && (
            <span className="badge bg-danger">
              Agotado
            </span>
          )}
        </div>
        <div 
          className="mb-3 d-flex justify-content-center align-items-center border border-dark"
          style={{ height, overflow: 'hidden' }}
        >
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="img-fluid"
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
          ) : (
            <span className="text-muted">Sin imagen</span>
          )}
        </div>
        <p className="card-text h4">$ {product.price}</p>
        <p className={`fw-bold ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
          {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
        </p>
        <div className="d-flex gap-2">
          <button className="btn btn-secondary" onClick={handleClick}>
            Ver más
          </button>
          <button className="btn btn-success" onClick={() => addToCart(product)} disabled={product.stock < 1}>
            🛒 Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
