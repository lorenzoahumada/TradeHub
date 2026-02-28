import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

function ProductDetailPage() {

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { addToCart } = useCart();
  const { toggleFavorite, favoriteIds } = useProducts();

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error('Error al cargar producto', err));
  }, [id]);

  useEffect(() => {
    axios.get(`/api/reviews/${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    axios.get(`/api/products/${id}/related`)
      .then(res => setRelatedProducts(res.data))
      .catch(err => console.error('Error al cargar relacionados', err));
  }, [id]);

  if (!product) return <div className="container mt-5">Cargando...</div>;

  const isFavorite = favoriteIds.includes(product.id);
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity
    });
  };

  const handleReviewSubmit = () => {
    axios.post(`/api/reviews/${id}`, {
      rating: newRating,
      comment: newComment
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      return axios.get(`/api/reviews/${id}`);
    })
    .then(res => {
      setReviews(res.data);
      setNewComment('');
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="container mt-4">
      <div className="row g-4">

        {/* ================= IMÁGENES ================= */}

        <div className="col-md-6">
          <div className="border rounded p-3 text-center bg-white">

            {product.images?.length > 0 && (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="img-fluid"
                style={{ maxHeight: 400, objectFit: 'contain' }}
              />
            )}

          </div>

          {/* Miniaturas */}
          <div className="d-flex gap-2 mt-3 flex-wrap">

            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="thumb"
                onClick={() => setSelectedImage(index)}
                style={{
                  width: 70,
                  height: 70,
                  objectFit: 'contain',
                  cursor: 'pointer',
                  border: selectedImage === index ? '2px solid blue' : '1px solid #ccc',
                  borderRadius: 6,
                  padding: 4
                }}
              />
            ))}
          </div>
        </div>

        {/* ================= INFO PRODUCTO ================= */}

        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">

              {/* Marca */}
              <div className="text-muted small mb-1">
                Marca: {product.brand}
              </div>

              {/* Nombre */}
              <h2>{product.name}</h2>

              {/* Favorito */}
              <button
                className="btn btn-light position-absolute top-0 end-0 m-3"
                onClick={() => toggleFavorite(product.id)}
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>

              {/* Precio */}
              <h2 className="text-success fw-bold mt-3">
                $ {product.price}
              </h2>

              {/* Stock */}
              <div className="mb-3">

                {product.stock > 0 ? (
                  <span className="badge bg-success">
                    Stock disponible: {product.stock}
                  </span>
                ) : (
                  <span className="badge bg-danger">
                    Sin stock
                  </span>
                )}

              </div>

              {/* Cantidad */}
              <div className="mb-3">

                <label className="form-label">Cantidad</label>

                <input
                  type="number"
                  className="form-control"
                  value={quantity}
                  min={1}
                  max={product.stock}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  style={{ width: 120 }}
                />

              </div>

              {/* Botones */}
              <div className="d-flex gap-2 mb-3">

                <button
                  className="btn btn-success flex-grow-1"
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                >
                  🛒 Agregar al carrito
                </button>

                <button
                  className="btn btn-primary flex-grow-1"
                  disabled={product.stock === 0}
                >
                  Comprar ahora
                </button>

              </div>
              <hr />
              {/* Info vendedor */}
              <div className="small">

                <strong>Vendido por:</strong><br />
                {product.owner_name || 'Usuario'}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DESCRIPCIÓN ================= */}

      <div className="card mt-4 shadow-sm">
        <div className="card-body">

          <h4>Descripción</h4>
          <p>{product.description}</p>

        </div>
      </div>

      {/* ================= REVIEWS PLACEHOLDER ================= */}

      <div className="card mt-4 shadow-sm">
        <div className="card-body">

          <h4>
            Opiniones ⭐ {averageRating} ({reviews.length})
          </h4>

          {/* Mostrar reviews */}
          {reviews.map(review => (
            <div key={review.id} className="border rounded p-3 mb-3">
              <strong>{review.user_name}</strong>
              <div>
                {'⭐'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </div>
              <p className="mb-0">{review.comment}</p>
            </div>
          ))}

          <hr />

          <h5>Dejar una opinión</h5>

          <div className="mb-2">
            <label>Rating</label>
            <select
              className="form-select"
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              style={{ width: 150 }}
            >
              {[1,2,3,4,5].map(n => (
                <option key={n} value={n}>{n} ⭐</option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <textarea
              className="form-control"
              placeholder="Escribí tu comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handleReviewSubmit}
          >
            Enviar review
          </button>

        </div>
      </div>

      {/* ================= PRODUCTOS RELACIONADOS ================= */}

      <div>
        {relatedProducts.length > 0 && (
          <div className="mt-5">

            <h4 className="mb-3">Productos relacionados</h4>

            <div className="d-flex gap-3 flex-wrap">

              {relatedProducts.map(prod => (
                <div key={prod.id} style={{ width: '250px' }}>
                  <ProductCard product={prod} width="250px" height="200px" />
                </div>
              ))}

            </div>

          </div>
        )}
      </div>

    </div>
  );
}

export default ProductDetailPage;
