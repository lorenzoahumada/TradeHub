import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../store/useProductStore';

function Home() {
  const [producto, setProducto] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const { products } = useProducts();

  const productosVisibles = products.slice(startIndex, startIndex + 3);

  const handleNext = () => {
    if (startIndex + 1 < products.length - 2) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  function buscar(e) {
    setProducto(e.target.value);
  }

  return (
    <div className="container mt-4">
      <h1>Bienvenido a TradeHub</h1>
      <div className='d-flex justify-content-center align-items-center gap-2'>
        <input
          type="text"
          className="form-control"
          placeholder="Ingrese un producto"
          value={producto}
          onChange={buscar}
        />
        <button className="btn btn-primary" onClick={buscar}>Buscar</button>
      </div>

      <div className='mt-4'>
        <h2 className='mb-3'>Productos destacados</h2>
        <div className='d-flex align-items-center justify-content-center gap-3'>
          <button className="btn btn-link fs-3" onClick={handlePrev} disabled={startIndex === 0}>
            &#8592; {/* <-- */}
          </button>

          <div className='d-flex flex-row gap-3 justify-content-center flex-wrap' style={{ maxWidth: '100%' }}>
            {productosVisibles.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <button
            className="btn btn-link fs-3"
            onClick={handleNext}
            disabled={startIndex + 3 >= products.length}
          >
            &#8594; {/* --> */}
          </button>
        </div>
      </div>

      <div className='mt-4'>
        <h2 className='mb-3'>Se busca...</h2>
        <div className='d-flex flex-row gap-3'></div>
      </div>
    </div>
  );
}

export default Home;
