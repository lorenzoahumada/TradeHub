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
    <div className="container mt-5">
      <h1>{product.name}</h1>
      <img src={product.images[0]} alt={product.name} className="img-fluid border border-dark mb-3" />
      <h3>$ {product.price}</h3>
      <p>{product.description}</p>
    </div>
  );
}

export default ProductDetailPage;
