import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error('Error al cargar producto', err));
  }, [id]);

  if (!product) return <div className="container mt-5">Cargando...</div>;

  return (
    <div className="container bg-light text-dark mt-5">
      <h1>{product.name}</h1>
      <h5>Marca: {product.brand}</h5>
      <div 
        className="mb-3 d-flex justify-content-center align-items-center border border-dark" 
        style={{ width: '350px', height: '400px', overflow: 'hidden' }}>
        <img src={product.images[0]} 
          alt={product.name} 
          className="img-fluid mb-3"
          style={{ maxHeight: '100%', objectFit: 'contain' }}
        />
      </div>
      <h3 className='mb-4'>$ {product.price}</h3>
      <h3>Descripcion</h3>
      <p>{product.description}</p>
    </div>
  );
}

export default ProductDetailPage;
