import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

function SearchResults() {
  const { query } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get(`/api/products/search/${query}`)
      .then(res => setResults(res.data))
      .catch(err => console.error('Error al buscar productos', err));
  }, [query]);

  return (
    <div className="container mt-4">
      <h2>Resultados para: "{query}"</h2>
      <div className="d-flex flex-wrap gap-3">
        {results.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
        {results.length === 0 && <p>No se encontraron productos.</p>}
      </div>
    </div>
  );
}

export default SearchResults;
