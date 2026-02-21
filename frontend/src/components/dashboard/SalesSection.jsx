import SalesStats from './SalesStats';

export default function SalesSection({
  sales,
  totalRevenue,
  totalSold,
  totalOrders,
  updateStatus
}) {

  return (
    <>
      <h2 className="mb-4">Mis Ventas</h2>

      {sales.length === 0 && (
        <div className="alert alert-info">
          No tienes ventas todavía.
        </div>
      )}

      <SalesStats
        totalRevenue={totalRevenue}
        totalSold={totalSold}
        totalOrders={totalOrders}
      />

      {sales.map(sale => (
        <div
          key={`${sale.order_id}-${sale.product_id}`}
          className="card mb-3 shadow-sm"
        >

          <div className="card-body">

            <div className="d-flex justify-content-between">

              <div className="d-flex gap-3">

                {sale.images?.[0] && (
                  <img
                    src={sale.images[0]}
                    alt={sale.product_name}
                    style={{
                      width: 70,
                      height: 70,
                      objectFit: 'contain'
                    }}
                  />
                )}

                <div>
                  <h5>{sale.product_name}</h5>
                  <div className="text-muted small">
                    Orden #{sale.order_id}
                  </div>
                  <div>Cantidad: {sale.quantity}</div>
                  <div className="fw-bold text-success">
                    ${sale.item_price}
                  </div>
                </div>

              </div>

              <div className="text-end">

                <div className="small text-muted">
                  {new Date(sale.created_at).toLocaleString()}
                </div>

                <select
                  className="form-select form-select-sm"
                  value={sale.status || 'pending'}
                  onChange={(e) =>
                    updateStatus(sale.order_id, e.target.value)
                  }
                >
                  <option value="pending">Pendiente</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>

              </div>

            </div>

            <hr />

            <div className="row small">

              <div className="col-md-4">
                <strong>Comprador</strong><br />
                {sale.buyer_name}<br />
                {sale.buyer_email}
              </div>

              <div className="col-md-4">
                <strong>Entrega</strong><br />
                {sale.delivery_method}
              </div>

              <div className="col-md-4">
                <strong>Pago</strong><br />
                {sale.payment_method}
              </div>

            </div>

          </div>

        </div>
      ))}
    </>
  );
}
