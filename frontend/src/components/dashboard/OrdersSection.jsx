export default function OrdersSection({ 
  orders,
  statusColors
}) {

  return (
    <>
      <h2>Historial de Compras</h2>

      {orders.length === 0 && (
        <p>No tienes compras todavía.</p>
      )}

      {orders.map(order => (
        <div key={order.id} className="card mb-3 p-3">

          <div className="d-flex justify-content-between">
            <strong>Orden #{order.id}</strong>
            <span>${order.total}</span>
          </div>

          <small className="text-muted">
            {new Date(order.created_at).toLocaleString()}
          </small>

          <div className={`badge bg-${statusColors[order.status] || 'secondary'}`}>
            {order.status}
          </div>

          <div className="mt-2">
            {order.items.map(item => (
              <div key={item.id}
                   className="d-flex align-items-center gap-2">

                {item.images?.[0] && (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: 'contain'
                    }}
                  />
                )}

                <div>
                  {item.name} x{item.quantity}
                </div>

              </div>
            ))}
          </div>

        </div>
      ))}
    </>
  );
}
