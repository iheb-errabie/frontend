import { useEffect, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import { getCart, updateCart, removeFromCart } from "../../api";
import {
  Button,
  Table,
  Spinner,
  Container,
  Row,
  Col,
  Alert,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const role = "buyer"; // or get from localStorage etc.

  // Only keep cart items with a valid product object
  const validCart = cart.filter(
    (item) => item.product && typeof item.product.price === "number"
  );

  const fetchCart = () => {
    setLoading(true);
    getCart()
      .then((res) => setCart(res.data || []))
      .catch(() => setError("Failed to load cart"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    setUpdating(true);
    try {
      await updateCart(productId, quantity);
      fetchCart();
    } catch {
      setError("Could not update quantity.");
    }
    setUpdating(false);
  };

  const handleRemove = async (productId) => {
    setUpdating(true);
    try {
      await removeFromCart(productId);
      fetchCart();
    } catch {
      setError("Could not remove product.");
    }
    setUpdating(false);
  };

  const handleCheckout = async () => {
    setUpdating(true);
    try {
      // Call your backend Stripe session creator
      const response = await fetch(
        "http://localhost:3000/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart: validCart }),
        }
      );

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        setError("Could not initiate payment.");
      }
    } catch {
      setError("Could not initiate payment.");
    }
    setUpdating(false);
  };

  const total = validCart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div
      className="d-flex"
      style={{ minHeight: "100vh", background: "#f3f4f6" }}
    >
      <Sidebar role={role} />
      <div className="flex-grow-1 p-4">
        <Container fluid>
          <h1 className="mb-4 text-3xl fw-bold text-gray-800 d-flex align-items-center gap-2">
            <i className="bi bi-cart-fill text-primary"></i> My Cart
          </h1>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ height: "300px" }}
            >
              <Spinner animation="border" variant="primary" />
            </div>
          ) : validCart.length === 0 ? (
            <div className="text-center text-secondary mt-5">
              <i
                className="bi bi-emoji-frown"
                style={{ fontSize: "2rem" }}
              ></i>
              <p className="mt-2">Your cart is empty.</p>
            </div>
          ) : (
            <>
              <Table responsive bordered hover className="bg-white shadow-sm">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th className="text-center">Price</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-center">Subtotal</th>
                    <th className="text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {validCart.map(({ product, quantity }) => (
                    <tr key={product._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {product.images &&
                            product.images.length > 0 && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                style={{
                                  width: 60,
                                  height: 60,
                                  objectFit: "cover",
                                  borderRadius: 8,
                                }}
                              />
                            )}
                          <span>{product.name}</span>
                        </div>
                      </td>
                      <td className="text-center">{product.price} TND</td>
                      <td className="text-center">
                        <InputGroup
                          size="sm"
                          style={{ maxWidth: 110, margin: "0 auto" }}
                        >
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            disabled={updating || quantity <= 1}
                            onClick={() =>
                              handleQuantityChange(product._id, quantity - 1)
                            }
                          >
                            <i className="bi bi-dash"></i>
                          </Button>
                          <FormControl
                            value={quantity}
                            className="text-center"
                            readOnly
                            style={{ width: 42 }}
                          />
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            disabled={updating}
                            onClick={() =>
                              handleQuantityChange(product._id, quantity + 1)
                            }
                          >
                            <i className="bi bi-plus"></i>
                          </Button>
                        </InputGroup>
                      </td>
                      <td className="text-center fw-semibold">
                        {product.price * quantity} TND
                      </td>
                      <td className="text-center">
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={updating}
                          onClick={() => handleRemove(product._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Row>
                <Col xs={12} md={6} className="ms-auto">
                  <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded shadow-sm">
                    <span className="fw-bold fs-5">Total:</span>
                    <span className="fw-bold fs-4 text-primary">
                      {total} TND
                    </span>
                  </div>
                  <Button
                    className="mt-3 w-100"
                    size="lg"
                    variant="success"
                    disabled={updating || validCart.length === 0}
                    onClick={handleCheckout}
                  >
                    <i className="bi bi-credit-card"></i> Confirm Order
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
    </div>
  );
};

export default Cart;  