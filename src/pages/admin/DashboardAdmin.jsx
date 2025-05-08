import React, { useEffect, useState } from "react";
import Sidebar from '../../components/common/Sidebar';
import api from "../../api";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const DashboardAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({ clients: 0, vendors: 0 });
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState([]);
  const [error, setError] = useState("");

  const role = "admin";

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Get user stats (clients, vendors)
        const usersRes = await api.get("/admin/user-stats"); // You must implement this endpoint!
        setUserStats(usersRes.data);

        // Get product count
        const prodRes = await api.get("/admin/product-stats"); // You must implement this endpoint!
        setProductCount(prodRes.data.count);

        // Get order count
        const orderRes = await api.get("/admin/order-stats"); // You must implement this endpoint!
        setOrderCount(orderRes.data.count);

        // Get recent users
        const recentUsersRes = await api.get("/admin/recent-users"); // You must implement this endpoint!
        setRecentUsers(recentUsersRes.data);
      } catch (err) {
        setError("Failed to load admin dashboard stats.");
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
            <i className="bi bi-bar-chart-fill text-primary"></i>
            Admin Dashboard
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <div className="d-flex align-items-center justify-content-center" style={{ height: "300px" }}>
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <Row className="mb-4 g-4">
                <Col md={3}>
                  <Card className="shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-people-fill fs-2 text-success me-3"></i>
                        <div>
                          <div className="fs-5 fw-semibold">{userStats.clients}</div>
                          <div className="text-muted">Clients</div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-shop fs-2 text-warning me-3"></i>
                        <div>
                          <div className="fs-5 fw-semibold">{userStats.vendors}</div>
                          <div className="text-muted">Vendors</div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-box-seam fs-2 text-primary me-3"></i>
                        <div>
                          <div className="fs-5 fw-semibold">{productCount}</div>
                          <div className="text-muted">Products</div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-bag-check-fill fs-2 text-danger me-3"></i>
                        <div>
                          <div className="fs-5 fw-semibold">{orderCount}</div>
                          <div className="text-muted">Orders</div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <h4 className="fw-bold mb-3 mt-5">Recent Users</h4>
              {recentUsers.length === 0 ? (
                <div className="text-muted">No recent users.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover bg-white shadow-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user._id}>
                          <td>{user.name || user.username || "N/A"}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge bg-${user.role === "client" ? "success" : user.role === "vendor" ? "warning" : "secondary"}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
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

export default DashboardAdmin;