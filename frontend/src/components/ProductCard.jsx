import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className='card' style={{ width: '370px' }}>
      <div className='card-body'>
        <p>{product.owner_name}</p>
        <h3 className='card-title mb-3'>{product.name}</h3>
        <div className="mb-3 d-flex justify-content-center align-items-center border border-dark" style={{ height: '300px', overflow: 'hidden' }}>
          <img
            src={product.images[0]}
            alt="Producto"
            className="img-fluid"
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
          />
        </div>
        <p className='card-text h3'>$ {product.price}</p>
        <button className='btn btn-secondary' onClick={handleClick}>Ver más</button>
      </div>
    </div>
  );
}

export default ProductCard;