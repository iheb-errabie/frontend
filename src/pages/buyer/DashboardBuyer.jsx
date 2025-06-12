import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyerNavbar from "../../components/common/BuyerNavbar";
import api from "../../api";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
  Badge,
  Carousel,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/modernDashboard.css";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const getProductById = (id) => {
  return api.get(`/products/${id}`).then((res) => res.data);
};


const DashboardBuyer = () => {
  const token = localStorage.getItem("token") || getCookie("token");
  const isLoggedIn = !!token;

  const [products, setProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState("");
  const [buyer, setBuyer] = useState({ name: "Buyer", avatar: "" });
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [advertisements, setAdvertisements] = useState([]);
  const [adsLoading, setAdsLoading] = useState(true);

  // In your products useEffect
  useEffect(() => {
    setLoading(true); // Add loading state for products
    api
      .get("/products")
      .then((res) => {
        setProducts(res.data);
        setDisplayed(res.data);
        console.log("API response:", res.data);
      })
      .catch(() => {
        setProducts([]);
        setDisplayed([]);
      })
      .finally(() => {
        setLoading(false); // Update loading state here
        setIsInitialLoad(false);
      });
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch wishlist
        const wishlistRes = await api.get("/users/wishlist");
        setWishlistCount(wishlistRes.data.length);

        // Fetch cart
        const cartRes = await api.get("/cart");
        setCartCount(cartRes.data.length);

        // Fetch orders
        const ordersRes = await api.get("/users/orders");
        setOrderCount(ordersRes.data.length);
        setRecentOrders(ordersRes.data.slice(0, 5)); // Show 5 most recent
      } catch (err) {
        setError("Failed to load dashboard stats.");
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  useEffect(() => {
  const fetchAdvertisements = async () => {
    try {
      const response = await api.get("/advertisements");
      setAdvertisements(response.data);
    } catch (err) {
      setError("Failed to load advertisements");
    } finally {
      setAdsLoading(false);
    }
  };
  
  fetchAdvertisements();
}, []);
  

  return (
    <div className="modern-dashboard-bg min-vh-100">
      <BuyerNavbar />
      <div className="p-3 p-md-4">
        <Container fluid>
          {/* Buyer Greeting Card */}

    <Row className="mb-4">
      <Col xs={12}>
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-3">
            <h4 className="fw-bold mb-3">
              <i className="bi bi-megaphone-fill text-primary me-2"></i>
              Featured Promotions
            </h4>
            {adsLoading ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : advertisements.length > 0 ? (
              <Carousel 
                indicators={false}
                interval={2500}
                className="modern-carousel"
              >
                {advertisements.map((ad) => (
                  <Carousel.Item key={ad._id}>
                    <div className="d-flex align-items-center" style={{ height: "500px" }}>
                      <img
                        className="d-block w-50 h-100 object-cover"
                        src={ad.product?.images?.[0] || "https://res.cloudinary.com/dolq2esig/image/upload/v1747958377/products/1747958247647-zbanda9.webp?w=300&h=300&fit=crop"}
                        alt={ad.title}
                      />
                      <div className="w-50 p-4 bg-light h-100 d-flex flex-column justify-content-center">
                        <h3 className="text-primary">{ad.title}</h3>
                        <p className="text-muted">{ad.description}</p>
                        {ad.product && (
                          <Button
                            variant="outline-primary"
                            onClick={() => navigate(`/products/${ad.product._id}`)}
                          >
                            View Product <i className="bi bi-arrow-right ms-2"></i>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <div className="text-muted text-center py-3">
                No current promotions available
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>

          <Row className="mb-4">
            <Col xs={12}>
              {isLoggedIn ? (
                <Row>
                  <Col md={8} lg={6}>
                    <Card className="modern-profile-card shadow-sm border-0">
                      <Card.Body className="d-flex align-items-center gap-3">
                        <img
                          src={
                            buyer.avatar ||
                            "https://ui-avatars.com/api/?name=Buyer"
                          }
                          alt="avatar"
                          className="modern-avatar me-2"
                        />
                        <div>
                          <div className="fw-bold fs-5 mb-1">
                            Welcome back,{" "}
                            <span style={{ color: "#3b82f6" }}>
                              {buyer.name}
                            </span>{" "}
                            👋
                          </div>
                          <div className="text-muted small">
                            Ready to shop? Your latest stats are here!
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4} lg={6} className="mt-3 mt-md-0">
                    <Card className="modern-tip-card border-0">
                      <Card.Body>
                        <span className="modern-tip-text">
                          <i className="bi bi-lightbulb-fill text-warning me-2"></i>
                          Tip: Check your wishlist for discounts!
                        </span>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              ) : (
                <Card
                  className="border-0 shadow-lg overflow-hidden position-relative"
                  style={{ height: "500px", overflowY: "hidden" }}
                >
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2 className="fw-bold mb-0 text-primary">
                        <i className="bi bi-stars me-2"></i>
                        Featured Collection
                      </h2>
                      <Badge pill bg="light" className="text-muted fs-6 border">
                        <i className="bi bi-lock-fill me-2"></i>
                        Login to Interact
                      </Badge>
                    </div>

                    <div
                      className="preview-products-container position-relative"
                      style={{
                        height: "380px",
                        perspective: "1000px",
                        overflowX: "auto",
                        paddingBottom: "20px",
                      }}
                    >
                      <div
                        className="d-flex h-100"
                        style={{ gap: "1.5rem", padding: "0 2rem" }}
                      >
                        {products.slice(0, 6).map((product, index) => (
                          <div
                            key={product._id}
                            className="product-card position-relative shadow"
                            style={{
                              flex: "0 0 280px",
                              transition:
                                "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                              transform: `rotate(${index % 2 === 0 ? 2 : -2}deg) 
                                        translateY(${index * 4}px) 
                                        scale(${1 - index * 0.03})`,
                              zIndex: `${10 - index}`,
                              opacity: `${1 - index * 0.1}`,
                            }}
                          >
                            <Card className="h-100 border-0 overflow-hidden">
                              <div
                                style={{
                                  overflow: "hidden",
                                  height: "220px",
                                  position: "relative",
                                  background: `linear-gradient(45deg, #f8f9fa, #e9ecef)`,
                                }}
                              >
                                <Card.Img
                                  variant="top"
                                  src={
                                    product.images?.[0] ||
                                    "https://via.placeholder.com/300x200"
                                  }
                                  alt={product.name}
                                  style={{
                                    objectFit: "cover",
                                    width: "100%",
                                    height: "100%",
                                    transition: "transform 0.3s ease",
                                    transform: "scale(0.98)",
                                  }}
                                />
                                <div
                                  className="position-absolute top-0 start-0 end-0 bottom-0"
                                  style={{
                                    boxShadow:
                                      "inset 0 0 15px rgba(0,0,0,0.05)",
                                    pointerEvents: "none",
                                  }}
                                ></div>
                              </div>
                              <Card.Body className="py-3 bg-white">
                                <div className="d-flex justify-content-between align-items-center">
                                  <h6 className="text-truncate mb-0 fw-semibold">
                                    {product.name}
                                  </h6>
                                  <span className="text-success fw-bold fs-5">
                                    {product.price} TND
                                  </span>
                                </div>
                                {product.category && (
                                  <Badge
                                    bg="light"
                                    text="dark"
                                    className="mt-2 border"
                                  >
                                    {product.category}
                                  </Badge>
                                )}
                              </Card.Body>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fixed Login Button */}
                    <div className="position-absolute bottom-0 start-0 end-0 p-4 bg-white border-top">
                      <Button
                        variant="primary"
                        size="lg"
                        className="fw-bold w-100 rounded-pill shadow-lg py-3"
                        onClick={() => navigate("/login")}
                        style={{
                          background:
                            "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                          border: "none",
                          fontSize: "1.1rem",
                          letterSpacing: "0.5px",
                        }}
                      >
                        <i className="bi bi-unlock-fill me-2"></i>
                        Login to Explore Full Collection
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>

          {/* Stats Cards */}
          {isLoggedIn && (
            <>
              <Row className="mb-4 g-3 modern-stat-row">
                <Col xs={12} sm={4}>
                  <Card
                    className="modern-stat-card gradient-green shadow-sm border-0 h-100 clickable"
                    onClick={() => navigate("/orders")}
                  >
                    <Card.Body>
                      <div className="modern-stat-icon-bg">
                        <i className="bi bi-bag-check-fill modern-stat-icon text-white"></i>
                      </div>
                      <div className="modern-stat-content">
                        <div className="modern-stat-value">{orderCount}</div>
                        <div className="modern-stat-label">Total Orders</div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} sm={4}>
                  <Card
                    className="modern-stat-card gradient-pink shadow-sm border-0 h-100 clickable"
                    onClick={() => navigate("/wishlist")}
                  >
                    <Card.Body>
                      <div className="modern-stat-icon-bg">
                        <i className="bi bi-heart-fill modern-stat-icon text-white"></i>
                      </div>
                      <div className="modern-stat-content">
                        <div className="modern-stat-value">{wishlistCount}</div>
                        <div className="modern-stat-label">Wishlist</div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} sm={4}>
                  <Card
                    className="modern-stat-card gradient-blue shadow-sm border-0 h-100 clickable"
                    onClick={() => navigate("/cart")}
                  >
                    <Card.Body>
                      <div className="modern-stat-icon-bg">
                        <i className="bi bi-cart-fill modern-stat-icon text-white"></i>
                      </div>
                      <div className="modern-stat-content">
                        <div className="modern-stat-value">{cartCount}</div>
                        <div className="modern-stat-label">In Cart</div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {error && (
                <Alert variant="danger" className="my-3">
                  {error}
                </Alert>
              )}
              {loading ? (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ height: "300px" }}
                >
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
                    <h4 className="fw-bold mb-0">Recent Orders</h4>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate("/orders")}
                      className="modern-history-btn"
                    >
                      View All Orders
                    </Button>
                  </div>
                  {recentOrders.length === 0 ? (
                    <div className="text-muted">You have no recent orders.</div>
                  ) : (
                    <div className="table-responsive modern-table-responsive">
                      <table className="table modern-table table-hover bg-white shadow-sm">
                        <thead className="table-light">
                          <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total (TND)</th>
                            <th>Status</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((order) => (
                            <tr key={order._id}>
                              <td>{order._id.slice(-6).toUpperCase()}</td>
                              <td>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td>{order.items?.length || 0}</td>
                              <td>
                                {order.items
                                  ?.reduce(
                                    (sum, item) =>
                                      sum +
                                      (item.product?.price || 0) *
                                        (item.quantity || 1),
                                    0,
                                  )
                                  .toFixed(2)}
                              </td>
                              <td>
                                <span
                                  className={`modern-status-chip ${order.status === "confirmed" ? "status-success" : "status-secondary"}`}
                                >
                                  {order.status || "Pending"}
                                </span>
                              </td>
                              <td>
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  className="modern-order-view-btn"
                                  href={`/orders/${order._id}`}
                                >
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </Container>
      </div>
    </div>
  );
};

export default DashboardBuyer;
