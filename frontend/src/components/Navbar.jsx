import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/">TradeHub</Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          {token ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Inicio</Link>
              </li>
              <li className="nav-item ml-4">
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

