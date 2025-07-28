import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('/api/auth/register', {
        email,
        password,
        name,
      });

      // registro exitoso → redirigimos a login
      navigate('/login');
    } catch (err) {
      setError('Error al registrar. Verificá los datos.');
      console.error(err);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center mt-5">
      <h1 className='mb-4'>Crear cuenta</h1>
      <form className='w-25' onSubmit={handleRegister}>
        <div className="mb-3">
          <label className='h4'>Nombre:</label>
          <input type="text" className="form-control"
                 value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
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
          <button type="submit" className="btn btn-primary">Registrarse</button>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
