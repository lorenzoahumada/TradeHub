import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className='card'>
      <div className='card-body'>
        <p>Usuario</p>
        <h3 className='card-title mb-3'>{product.name}</h3>
        <img src={product.images[0]} alt="Producto" className='card-img-top border border-dark mb-3' />
        <p className='card-text h3'>$ {product.price}</p>
        <button className='btn btn-secondary' onClick={handleClick}>Ver más</button>
      </div>
    </div>
  );
}

export default ProductCard;