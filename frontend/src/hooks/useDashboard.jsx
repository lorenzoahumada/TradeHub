import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useDashboard() {

  const [productos, setProductos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [nuevoProducto, setNuevoProducto] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    images: '',
    categories: [],
    newCategories: [],
    brand: ''
  });

  const statusColors = {
    pending: 'secondary',
    shipped: 'warning',
    delivered: 'success',
    cancelled: 'danger'
  };

  const token = localStorage.getItem('token');

  // -------- LOAD DATA --------

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
        window.location.href = '/login';
      }
    });
  }, []);

  useEffect(() => {
    axios.get('/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error al cargar categorías', err));
  }, []);

  useEffect(() => {
    axios.get('/api/orders/mine', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => setOrders(res.data))
    .catch(err => console.error('Error al cargar órdenes', err));
  }, []);

  useEffect(() => {
    axios.get('/api/orders/sales', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => setSales(res.data))
    .catch(err => console.error('Error al cargar ventas', err));
  }, []);

  // -------- HANDLERS --------

  const handleChange = (e) => {
    setNuevoProducto({
      ...nuevoProducto,
      [e.target.name]: e.target.value
    });
  };

  const handleCategoryToggle = (catId) => {
    setNuevoProducto(prev => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter(id => id !== catId)
        : [...prev.categories, catId]
    }));
  };

  const handleNewCategoryChange = (e) => {
    setNuevoProducto({
      ...nuevoProducto,
      newCategories: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
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
      setNuevoProducto({ name: '', description: '', price: '', images: '', categories: [], newCategories: [], brand: '' });
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

  const handleIncrease = (productId) => {
    axios.post(`/api/products/${productId}/increase-stock`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      setProductos(prev => prev.map(p => p.id === productId ? { ...p, stock: p.stock + 1 } : p));
    })
    .catch(err => console.error('Error al aumentar stock', err));
  };

  const handleDecrease = (productId) => {
    axios.post(`/api/products/${productId}/decrease-stock`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      setProductos(prev => prev.map(p => p.id === productId ? { ...p, stock: p.stock - 1 } : p));
    })
    .catch(err => console.error('Error al decrementar stock', err));
  };

  const updateStatus = (orderId, newStatus) => {
    axios.put(`/api/orders/${orderId}/status`, { status: newStatus },{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      setSales(prev => prev.map(s => s.order_id === orderId ? { ...s, status: newStatus } : s));
    })
    .catch(err => console.error('Error al actualizar estado de orden', err));
  };

  // ---------- SALES STATS ----------

  const totalRevenue = sales.reduce(
    (acc, s) => acc + s.item_price * s.quantity,
    0
  );

  const totalSold = sales.reduce(
    (acc, s) => acc + s.quantity,
    0
  );

  const totalOrders = new Set(
    sales.map(s => s.order_id)
  ).size;

  return {
    productos,
    categories,
    orders,
    sales,
    showModal,
    setShowModal,
    nuevoProducto,
    setNuevoProducto,
    handleAgregar,
    handleEliminar,
    handleIncrease,
    handleDecrease,
    handleChange,
    handleCategoryToggle,
    handleNewCategoryChange,
    updateStatus,
    totalRevenue,
    totalSold,
    totalOrders,
    statusColors
  };
}
