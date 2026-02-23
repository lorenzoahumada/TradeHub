import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

function Home() {
  const [producto, setProducto] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const { products } = useProducts();
  const navigate = useNavigate();

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

  function buscar() {
    navigate(`/search/${producto}`);
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
          onChange={(e) => setProducto(e.target.value)}
        />
        <button className="btn btn-primary" onClick={buscar}>Buscar</button>
      </div>

      <div id="mainCarousel" className="carousel slide my-4" data-bs-ride="carousel">
        <div className="carousel-inner rounded">
          <div className="carousel-item active">
            <img 
              src="https://b2ctrendy.vtexassets.com/assets/vtex.file-manager-graphql/images/3781bcc0-bfa0-45f2-b3f1-1e8a1d22898e___a6609dc999c69004d4a9ff959af0b896.jpg"
              style={{ height: "486px", objectFit: "contain" }}
              className="d-block w-100" alt="Slide 1" />
          </div>
          <div className="carousel-item">
            <img 
              src="https://promociones-aereas.com.ar/wp-content/uploads/2019/04/01_FRIDAY.jpg "
              style={{ height: "486px", objectFit: "contain" }}
              className="d-block w-100" alt="Slide 2" />
          </div>
          <div className="carousel-item">
            <img 
              src="https://netivooregon.s3.amazonaws.com/modatexrosa2/img/logo/cyber-week-cms.gif"
              style={{ height: "486px", objectFit: "contain" }}
              className="d-block w-100" alt="Slide 3" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
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
        <h2 className='mb-3'>Explorar por categoría</h2>
        <div className='d-flex flex-wrap gap-3 justify-content-center'>
          {[
            { name: 'Electrónica', img: 'https://placehold.co/150x100?text=Electrónica' },
            { name: 'Ropa', img: 'https://placehold.co/150x100?text=Ropa' },
            { name: 'Hogar', img: 'https://placehold.co/150x100?text=Hogar' },
            { name: 'Deportes', img: 'https://placehold.co/150x100?text=Deportes' },
            { name: 'Juguetes', img: 'https://placehold.co/150x100?text=Juguetes' },
            { name: 'Gaming', img: 'https://placehold.co/150x100?text=Gaming' }
          ].map((cat) => (
            <div
              key={cat.name}
              className='card shadow-sm'
              style={{ width: '180px', cursor: 'pointer' }}
              onClick={() => navigate(`/search/${cat.name}`)}
            >
              <img src={cat.img} className='card-img-top' alt={cat.name} />
              <div className='card-body text-center'>
                <h6 className='card-title m-0'>{cat.name}</h6>
              </div>
            </div>
          ))}
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
