import React, { useEffect, useState } from "react";
import BuyerNavbar from "../../components/common/BuyerNavbar";
import { getWishlist, removeFromWishlist } from "../../api";
import { Container, Card, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/modernDashboard.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await getWishlist();
      setWishlist(res.data);
      setError("");
    } catch (err) {
      setError("Could not fetch wishlist");
    }
    setLoading(false);
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      setError("Could not remove item");
    }
  };

  return (
    <div className="modern-dashboard-bg min-vh-100">
      <BuyerNavbar />
      <div className="p-3 p-md-4">
        <Container fluid>
          <h2 className="fw-bold d-flex align-items-center gap-2 mb-4">
            <i className="bi bi-heart-fill text-danger"></i>
            My Wishlist
          </h2>
          {loading ? (
            <div className="d-flex align-items-center justify-content-center" style={{ height: "300px" }}>
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : wishlist.length === 0 ? (
            <div className="modern-empty-state text-center my-5">
              <i className="bi bi-heartbreak text-secondary" style={{ fontSize: "3rem" }}></i>
              <div className="mt-3 fs-5 text-muted">Your wishlist is empty.</div>
            </div>
          ) : (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {wishlist.map((product) => (
                <Col key={product._id}>
                  <Card className="modern-product-card h-100 shadow-sm">
                    {product.images && product.images.length > 0 && (
                      <Card.Img
                        variant="top"
                        src={product.images[0]}
                        alt={product.name}
                        style={{ maxHeight: 170, objectFit: "cover", borderRadius: "1.1rem 1.1rem 0 0" }}
                        onError={e => { e.target.src = "/default_product.png" }}
                      />
                    )}
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="modern-product-title">{product.name}</Card.Title>
                      <Card.Text className="text-secondary modern-product-desc mb-2">
                        {product.description?.slice(0, 70)}...
                      </Card.Text>
                      <div className="fw-bold mb-2" style={{ color: "#e11d48" }}>
                        {product.price} TND
                      </div>
                      <Button
                        variant="outline-danger"
                        className="mt-auto"
                        onClick={() => handleRemove(product._id)}
                      >
                        <i className="bi bi-trash"></i> Remove
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
}

export default Wishlist;