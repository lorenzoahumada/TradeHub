import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Favorites() {

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    axios.get('/api/favorites', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => setFavorites(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">

      <h2>Mis Favoritos</h2>

      {favorites.length === 0 && (
        <p>No tienes favoritos todavía.</p>
      )}

      <div className="row">
        {favorites.map(prod => (
          <div key={prod.id} className="col-md-3">

            <div className="card p-2">

              {prod.images?.[0] && (
                <img
                  src={prod.images[0]}
                  style={{ height: 150, objectFit: 'contain' }}
                />
              )}

              <div>{prod.name}</div>
              <div className="text-success">${prod.price}</div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}