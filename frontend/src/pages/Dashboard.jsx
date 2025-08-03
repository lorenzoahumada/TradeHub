import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [nuevoProducto, setNuevoProducto] = useState({
    name: '',
    description: '',
    price: '',
    images: ''
  });

  useEffect(() => {
    axios.get('/api/products/mine', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => setProductos(res.data))
    .catch(err => { 
      console.error('Error al cargar productos del usuario', err);

      if (err.response && err.response.status === 403) {
        localStorage.removeItem('token');
        window.location.href = '/login'; // o redirigir a login
      }
    });
  }, []);

  const handleChange = (e) => {
    setNuevoProducto({
      ...nuevoProducto,
      [e.target.name]: e.target.value
    });
  };

  const handleAgregar = () => {
    const productoAEnviar = {
      ...nuevoProducto,
      images: nuevoProducto.images.split(' ').map(url => url.trim())
    };

    axios.post('/api/products', productoAEnviar, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => {
      setProductos([...productos, res.data]);
      setShowModal(false);
      setNuevoProducto({ name: '', description: '', price: '', images: '' });
    })
    .catch(err => console.error('Error al agregar producto', err));
  };

  const handleEliminar = (id) => {
  if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;

  axios.delete(`/api/products/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(() => {
    setProductos(productos.filter(p => p.id !== id));
  })
  .catch(err => console.error('Error al eliminar producto', err));
};




  return (
    
    <div className="container mt-5">
      <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      <h1>Panel de Usuario</h1>

      <div className="d-flex align-items-center gap-3 mb-4">
        <h2>Productos Publicados</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+</button>
      </div>

      <ul className="list-group">
        {productos.map(prod => (
          <li key={prod.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{prod.name}</strong> - <span className="text-success">$ {prod.price}</span>
            </div>
            <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(prod.id)}>
              <i className="fas fa-trash"></i>
            </button>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" onClick={() => setShowModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nuevo Producto</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input name="name" className="form-control mb-2" placeholder="Nombre" value={nuevoProducto.name} onChange={handleChange} />
                <input name="price" className="form-control mb-2" placeholder="Precio" type="number" value={nuevoProducto.price} onChange={handleChange} />
                <textarea name="description" className="form-control mb-2" placeholder="Descripción" value={nuevoProducto.description} onChange={handleChange}></textarea>
                <input name="images" className="form-control mb-2" placeholder="URLs de imágenes separadas por coma" value={nuevoProducto.images} onChange={handleChange} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleAgregar}>Agregar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

