import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchFavorites();
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

  const fetchFavorites = async () => {
    try {
      const res = await axios.get('/api/favorites/ids', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFavoriteIds(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async (productId) => {
    try {
      const res = await axios.post(`/api/favorites/${productId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.data.favorited) {
        setFavoriteIds(prev => [...prev, productId]);
      } else {
        setFavoriteIds(prev => prev.filter(id => id !== productId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        favoriteIds,
        toggleFavorite,
        loading
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);