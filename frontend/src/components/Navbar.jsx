import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">Home</Link>
      <div className="navbar-nav">
        <Link className="nav-link" to="/proyects">Proyects</Link>
        <Link className="nav-link" to="/contact">Contact</Link>
      </div>
    </nav>
  );
}

export default Navbar;
