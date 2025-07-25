import { useEffect, useState } from 'react';
import axios from 'axios';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener productos al cargar el componente
  useEffect(() => {
    fetchProducts();
  }, []);
  

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/products');
      console.log('Productos obtenidos:', res.data);
      setProducts(res.data);
    } catch (err) {
      console.error('Error al obtener productos', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
  };
}
