import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

function SearchResults() {
  const { query } = useParams();
  const [results, setResults] = useState([]);

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('');

  const fetchProducts = () => {
    axios.get(`/api/products/search/${query}`, {
      params: { minPrice, maxPrice, brand, type, sort }
    })
    .then(res => setResults(res.data))
    .catch(err => console.error('Error al buscar productos', err));
  };

  useEffect(() => {
    fetchProducts();
  }, [query]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Resultados para: "{query}"</h2>

      <div className="row">
        {/* Columna izquierda - Filtros */}
        <div className="col-md-3 mb-4">
          <div className="card p-3">
            <h5 className="mb-3">Filtros</h5>
            <input type="number" placeholder="Precio mínimo" className="form-control mb-2"
              value={minPrice} onChange={e => setMinPrice(e.target.value)} />
            <input type="number" placeholder="Precio máximo" className="form-control mb-2"
              value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
            <input type="text" placeholder="Marca" className="form-control mb-2"
              value={brand} onChange={e => setBrand(e.target.value)} />
            <input type="text" placeholder="Tipo" className="form-control mb-2"
              value={type} onChange={e => setType(e.target.value)} />
            <select className="form-select mb-3" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="">Ordenar por</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
            </select>
            <button className="btn btn-primary w-100" onClick={fetchProducts}>
              Aplicar filtros
            </button>
          </div>
        </div>

        {/* Columna derecha - Productos */}
        <div className="col-md-9">
          <div className="d-flex flex-wrap gap-3">
            {results.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                width="310px" 
                height="250px"
              />
            ))}
            {results.length === 0 && <p>No se encontraron productos.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResults;

