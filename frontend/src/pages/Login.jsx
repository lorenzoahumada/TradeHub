import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const token = res.data.token;
      localStorage.setItem('token', token);
      navigate('/'); // o la ruta protegida que desees
    } catch (err) {
      setError('Credenciales incorrectas');
      console.error(err);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center mt-5">
      <h1 className='mb-4'>Iniciar sesión</h1>
      <form className='w-25' onSubmit={handleLogin}>
        <div className="mb-3">
          <label className='h4'>Email:</label>
          <input type="email" className="form-control"
                 value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className='h4'>Contraseña:</label>
          <input type="password" className="form-control"
                 value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className='d-flex justify-content-center'>
          <button type="submit" className="btn btn-primary">Ingresar</button>
        </div>
      </form>
      <div className="mt-3">
        <p>¿No tenés una cuenta? <Link to="/register">Registrate acá</Link></p>
      </div>
    </div>
  );
}

export default Login;
