import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const handleDecrease = (product) => {
    axios.post(`/api/products/${product.id}/decrease-stock`, product, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .catch(err => console.error('Error al decrementar stock', err));
  };

  const handleConfirm = async () => {
    try {
      await axios.post("/api/orders", {
        cart,
        deliveryMethod,
        paymentMethod,
        formData
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      //cart.forEach(p => handleDecrease(p));

      clearCart();
      alert("Compra realizada con éxito 🎉");
      navigate("/");
    } catch (err) {
      console.error("Error al finalizar compra", err);
    }
  };

  if (cart.length === 0) {
    return <div className="container py-5">Carrito vacío</div>;
  }

  return (
    <div className="container py-5">
      <h2>Checkout</h2>

      {/* PASO 1 */}
      {step === 1 && (
        <>
          <h4>Método de entrega</h4>
          <select
            className="form-select mb-3"
            value={deliveryMethod}
            onChange={(e) => setDeliveryMethod(e.target.value)}
          >
            <option value="">Seleccionar</option>
            <option value="shipping">Envío a domicilio</option>
            <option value="pickup">Retiro en punto</option>
          </select>
          <button
            className="btn btn-primary"
            disabled={!deliveryMethod}
            onClick={() => setStep(2)}
          >
            Continuar
          </button>
        </>
      )}

      {/* PASO 2 */}
      {step === 2 && (
        <>
          <h4>Datos personales</h4>
          <input
            className="form-control mb-2"
            placeholder="Nombre completo"
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
          <input
            className="form-control mb-2"
            placeholder="Email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            className="form-control mb-2"
            placeholder="Teléfono"
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          {deliveryMethod === "shipping" && (
            <input
              className="form-control mb-2"
              placeholder="Dirección"
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          )}

          <button className="btn btn-secondary me-2" onClick={() => setStep(1)}>
            Atrás
          </button>
          <button className="btn btn-primary" onClick={() => setStep(3)}>
            Continuar
          </button>
        </>
      )}

      {/* PASO 3 */}
      {step === 3 && (
        <>
          <h4>Método de pago</h4>
          <select
            className="form-select mb-3"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Seleccionar</option>
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
            <option value="cash">Efectivo</option>
          </select>

          <h5>Total: ${total.toFixed(2)}</h5>

          <button className="btn btn-secondary me-2" onClick={() => setStep(2)}>
            Atrás
          </button>
          <button
            className="btn btn-success"
            disabled={!paymentMethod}
            onClick={handleConfirm}
          >
            Confirmar compra
          </button>
        </>
      )}
    </div>
  );
}

export default CheckoutPage;
