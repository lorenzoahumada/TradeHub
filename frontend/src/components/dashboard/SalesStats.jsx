export default function SalesStats({
  totalRevenue,
  totalSold,
  totalOrders
}) {
  return (
    <div className="row mb-4">

      <div className="col-md-4">
        <div className="card p-3 text-center">
          <h5>Total vendido</h5>
          <h4 className="text-success">${totalRevenue}</h4>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card p-3 text-center">
          <h5>Productos vendidos</h5>
          <h4>{totalSold}</h4>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card p-3 text-center">
          <h5>Órdenes</h5>
          <h4>{totalOrders}</h4>
        </div>
      </div>

    </div>
  );
}
