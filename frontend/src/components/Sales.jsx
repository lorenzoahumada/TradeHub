import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Sales() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    axios.get('/api/orders/sales', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => setSales(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Mis Ventas</h2>

      {sales.length === 0 && <p>No tienes ventas aún</p>}

      {sales.map(sale => (
        <div key={`${sale.order_id}-${sale.product_id}`} className="sale-card">

          <h3>{sale.product_name}</h3>

          {sale.images?.[0] && (
            <img src={sale.images[0]} alt="" width="120" />
          )}

          <p>Cantidad: {sale.quantity}</p>
          <p>Precio: ${sale.item_price}</p>
          <p>Comprador: {sale.buyer_name}</p>
          <p>Email: {sale.buyer_email}</p>

          <p>Método entrega: {sale.shipping_method}</p>
          <p>Método pago: {sale.payment_method}</p>

          <p>Estado: {sale.status}</p>

          <small>
            Fecha: {new Date(sale.created_at).toLocaleString()}
          </small>

        </div>
      ))}
    </div>
  );
}
