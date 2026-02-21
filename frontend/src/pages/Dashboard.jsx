import { useState } from 'react';
import useDashboard from '../hooks/useDashboard';

import ProductsSection from '../components/dashboard/ProductsSection';
import OrdersSection from '../components/dashboard/OrdersSection';
import SalesSection from '../components/dashboard/SalesSection';
import ProductModal from '../components/dashboard/ProductModal';

function Dashboard() {

  const [activeTab, setActiveTab] = useState('products');

  const dashboard = useDashboard();

  return (
    <div className="container mt-5">

      <h1>Panel de Usuario</h1>

      <ul className="nav nav-tabs mb-4">

        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Mis Productos
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Compras
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => setActiveTab('sales')}
          >
            Ventas
          </button>
        </li>

      </ul>

      {activeTab === 'products' && (
        <ProductsSection
          productos={dashboard.productos}
          onIncrease={dashboard.handleIncrease}
          onDecrease={dashboard.handleDecrease}
          onDelete={dashboard.handleEliminar}
          onAddClick={() => dashboard.setShowModal(true)}
        />
      )}

      {activeTab === 'orders' && (
        <OrdersSection 
          orders={dashboard.orders}
          statusColors={dashboard.statusColors}
        />
      )}

      {activeTab === 'sales' && (
        <SalesSection
          sales={dashboard.sales}
          totalRevenue={dashboard.totalRevenue}
          totalSold={dashboard.totalSold}
          totalOrders={dashboard.totalOrders}
          updateStatus={dashboard.updateStatus}
        />
      )}

      <ProductModal
        show={dashboard.showModal}
        onClose={() => dashboard.setShowModal(false)}
        nuevoProducto={dashboard.nuevoProducto}
        categories={dashboard.categories}
        onChange={dashboard.handleChange}
        onCategoryToggle={dashboard.handleCategoryToggle}
        onNewCategoryChange={dashboard.handleNewCategoryChange}
        onAdd={dashboard.handleAgregar}
      />

    </div>
  );
}

export default Dashboard;
