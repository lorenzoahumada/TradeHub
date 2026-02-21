export default function ProductModal({
  show,
  onClose,
  nuevoProducto,
  categories,
  onChange,
  onCategoryToggle,
  onNewCategoryChange,
  onAdd
}) {

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Nuevo Producto</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">

            <input name="name" className="form-control mb-2"
              placeholder="Nombre"
              value={nuevoProducto.name}
              onChange={onChange}
            />

            <input name="price" type="number"
              className="form-control mb-2"
              placeholder="Precio"
              value={nuevoProducto.price}
              onChange={onChange}
            />

            <textarea name="description"
              className="form-control mb-2"
              placeholder="Descripción"
              value={nuevoProducto.description}
              onChange={onChange}
            />

            <input name="brand"
              className="form-control mb-2"
              placeholder="Marca"
              value={nuevoProducto.brand}
              onChange={onChange}
            />

            <input name="images"
              className="form-control mb-2"
              placeholder="URLs separadas por espacio"
              value={nuevoProducto.images}
              onChange={onChange}
            />

            <input type="number" name="stock"
              className="form-control mb-2"
              placeholder="Stock"
              value={nuevoProducto.stock}
              onChange={onChange}
            />

            <hr />

            <h6>Categorías</h6>

            <div className="overflow-auto" style={{ maxHeight: 145 }}>
              {categories.map(cat => (
                <div key={cat.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={nuevoProducto.categories.includes(cat.id)}
                      onChange={() => onCategoryToggle(cat.id)}
                    />
                    {' '}{cat.name}
                  </label>
                </div>
              ))}
            </div>

            <hr />

            <h6>Nuevas categorías</h6>

            <input
              className="form-control"
              placeholder="Ej: Tecnología, Gaming"
              onChange={onNewCategoryChange}
            />

          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>

            <button className="btn btn-primary" onClick={onAdd}>
              Agregar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
