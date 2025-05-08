import React, { useEffect, useState } from "react";
import Sidebar from '../../components/common/Sidebar';
import api from "../../api"; // Adjust the import based on your project structure
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const DashboardBuyer = () => {
  const [loading, setLoading] = useState(true);
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState("");

  const role = "buyer"; // Or fetch from context/localStorage

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


      } catch (err) {
        setError("Failed to load dashboard stats.");
      }
      setLoading(false);
    };

    fetchStats();
  }, []);


  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      <Sidebar role={role} />
      <div className="flex-grow-1 p-4">
        <Container fluid>
          <h2 className="mb-4 fw-bold d-flex align-items-center gap-2">
            <i className="bi bi-grid-fill text-primary"></i>
            Welcome to your Dashboard
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <div className="d-flex align-items-center justify-content-center" style={{ height: "300px" }}>
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <Row className="mb-4 g-4">
                <Col md={4}>
                  <Card className="shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-bag-check-fill fs-2 text-success me-3"></i>
                        <div>
                          <div className="fs-5 fw-semibold">{orderCount}</div>
                          <div className="text-muted">Total Orders</div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-heart-fill fs-2 text-danger me-3"></i>
                        <div>
                          <div className="fs-5 fw-semibold">{wishlistCount}</div>
                          <div className="text-muted">Wishlist Items</div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-cart-fill fs-2 text-primary me-3"></i>
                        <div>
                          <div className="fs-5 fw-semibold">{cartCount}</div>
                          <div className="text-muted">In Cart</div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <h4 className="fw-bold mb-3 mt-5">Recent Orders</h4>
              {recentOrders.length === 0 ? (
                <div className="text-muted">You have no recent orders.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover bg-white shadow-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total (TND)</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order._id}>
                          <td>{order._id.slice(-6).toUpperCase()}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>{order.items?.length || 0}</td>
                          <td>
                            {order.items
                              ?.reduce(
                                (sum, item) =>
                                  sum +
                                  ((item.product?.price || 0) * (item.quantity || 1)),
                                0
                              )
                              .toFixed(2)}
                          </td>
                          <td>
                            <span className={`badge bg-${order.status === "confirmed" ? "success" : "secondary"}`}>
                              {order.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </Container>
      </div>
    </div>
      );
};

export default DashboardBuyer;