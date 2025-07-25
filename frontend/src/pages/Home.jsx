import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../store/useProductStore';

function Home() {
  const [producto, setProducto] = useState('');
  const {products } = useProducts();

  function buscar(e) {
    setProducto(e.target.value);
  }
  
  return (
    <div className="container mt-4">
      <h1>Bienvenido a TradeHub</h1>
      <div className='d-flex justify-content-center align-items-center gap-2'>
        <input type="text" className="form-control" id="floatingInputValue" placeholder="Ingrese un producto" value={producto} onChange={buscar}></input>
        <button className="btn btn-primary" onClick={buscar}>Buscar</button>
      </div>
      <div className='mt-4'>
        <h2 className='mb-3'>Productos destacados</h2>
        <div className='d-flex flex-row gap-3'>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <div className='mt-4'>
        <h2 className='mb-3'>Se busca...</h2>
        <div className='d-flex flex-row gap-3'>
          
        </div>
      </div>
    </div>
  );
}

export default Home;
