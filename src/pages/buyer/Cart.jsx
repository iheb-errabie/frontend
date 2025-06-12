import { useEffect, useState } from "react";
import BuyerNavbar from "../../components/common/BuyerNavbar";
import { getCart, updateCart, removeFromCart } from "../../api";
import {
  Button,
  Spinner,
  Container,
  Row,
  Col,
  Alert,
  InputGroup,
  FormControl,
  Card,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/modernDashboard.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

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
    <div className="modern-dashboard-bg min-vh-100">
      <BuyerNavbar />
      <div className="p-3 p-md-4">
        <Container fluid>
          <h2 className="fw-bold d-flex align-items-center gap-2 mb-4">
            <i className="bi bi-cart-fill text-primary"></i>
            My Cart
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <div className="d-flex align-items-center justify-content-center" style={{ height: "300px" }}>
              <Spinner animation="border" variant="primary" />
            </div>
          ) : validCart.length === 0 ? (
            <div className="modern-empty-state text-center my-5">
              <i className="bi bi-cart-x-fill text-secondary" style={{ fontSize: "3rem" }}></i>
              <div className="mt-3 fs-5 text-muted">Your cart is empty.</div>
            </div>
          ) : (
            <>
              <Row className="g-4">
                <Col md={8}>
                  {validCart.map(({ product, quantity }) => (
                    <Card className="modern-cart-card mb-3 shadow-sm" key={product._id}>
                      <Card.Body className="d-flex align-items-center gap-3">
                        {product.images && product.images.length > 0 && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            style={{
                              width: 74,
                              height: 74,
                              objectFit: "cover",
                              borderRadius: 14,
                            }}
                          />
                        )}
                        <div className="flex-grow-1">
                          <div className="fw-semibold fs-5">{product.name}</div>
                          <div className="text-muted small">{product.description?.slice(0, 70)}...</div>
                          <div className="fw-bold mt-2 text-primary">{product.price} TND</div>
                        </div>
                        <div style={{ minWidth: 120 }}>
                          <InputGroup size="sm" className="modern-qty-group">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              disabled={updating || quantity <= 1}
                              onClick={() => handleQuantityChange(product._id, quantity - 1)}
                            >
                              <i className="bi bi-dash"></i>
                            </Button>
                            <FormControl
                              value={quantity}
                              className="text-center"
                              readOnly
                              style={{ width: 38, fontWeight: 600 }}
                            />
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              disabled={updating}
                              onClick={() => handleQuantityChange(product._id, quantity + 1)}
                            >
                              <i className="bi bi-plus"></i>
                            </Button>
                          </InputGroup>
                        </div>
                        <div className="fw-bold ms-3" style={{ minWidth: 80 }}>
                          {product.price * quantity} TND
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          disabled={updating}
                          onClick={() => handleRemove(product._id)}
                          className="modern-remove-btn"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </Card.Body>
                    </Card>
                  ))}
                </Col>
                <Col md={4}>
                  <Card className="modern-summary-card shadow-sm sticky-top mt-0 mt-md-3">
                    <Card.Body>
                      <div className="fw-semibold fs-5 mb-2">Summary</div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Items</span>
                        <span>{validCart.length}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="fw-bold fs-5">Total</span>
                        <span className="fw-bold fs-4 text-primary">{total} TND</span>
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
                    </Card.Body>
                  </Card>
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