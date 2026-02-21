export default function ProductsSection({
  productos,
  onIncrease,
  onDecrease,
  onDelete,
  onAddClick
}) {
  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-4">
        <h2>Productos Publicados</h2>
        <button className="btn btn-primary" onClick={onAddClick}>+</button>
      </div>

      <ul className="list-group">
        {productos.map(prod => (
          <li key={prod.id}
              className="list-group-item d-flex justify-content-between align-items-center">

            <div>
              <strong>{prod.name}</strong> -
              <span className="text-success"> $ {prod.price}</span>
            </div>

            <div className="d-flex align-items-center gap-2">

              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => onDecrease(prod.id)}
                disabled={prod.stock < 1}
              >
                −
              </button>

              <span>{prod.stock}</span>

              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => onIncrease(prod.id)}
              >
                +
              </button>

              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDelete(prod.id)}
              >
                🗑
              </button>

            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
