import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { cart } = useCart();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/">TradeHub</Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav gap-2 ms-auto align-items-center">
          <li className="nav-item">
            <Link to="/favorites" className="btn btn-outline-light ms-2">
              ❤️
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link position-relative" to="/cart">
              🛒
              {cart.length > 0 && (
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                  {cart.reduce((sum, p) => sum + p.quantity, 0)}
                </span>
              )}
            </Link>
          </li>
          {token ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={handleLogout}>Cerrar sesión</button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link className="btn btn-outline-primary" to="/login">Iniciar sesión</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;


