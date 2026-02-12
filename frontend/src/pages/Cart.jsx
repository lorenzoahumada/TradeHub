import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function Cart() {
  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();

  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Tu carrito está vacío 🛒</h2>
        <Link to="/" className="btn btn-primary mt-3">
          Ir a comprar
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Carrito de compras 🛒</h2>

      <ul className="list-group mb-4">
        {cart.map((product) => (
          <li
            key={product.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div className="d-flex align-items-center gap-3">
              <img
                src={product.images?.[0] || "https://via.placeholder.com/80"}
                alt={product.name}
                style={{ width: "80px", height: "80px", objectFit: "contain" }}
              />
              <div>
                <h5>{product.name}</h5>
                <p className="mb-1">Precio: ${product.price}</p>
                <p className="mb-1">Cantidad: {product.quantity}</p>
              </div>
            </div>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => decreaseQuantity(product)}
            >
              −
            </button>

            <span className="mx-2">{product.quantity}</span>

            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => increaseQuantity(product)}
              disabled={product.quantity >= product.stock}
            >
              +
            </button>

            <button
              className="btn btn-danger"
              onClick={() => removeFromCart(product.id)}
            >
              ❌ Eliminar
            </button>
          </li>
        ))}
      </ul>

      <div className="d-flex justify-content-between align-items-center">
        <h4>Total: ${total.toFixed(2)}</h4>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-danger" onClick={clearCart}>
            Vaciar carrito
          </button>
          <button className="btn btn-success">Finalizar compra</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
