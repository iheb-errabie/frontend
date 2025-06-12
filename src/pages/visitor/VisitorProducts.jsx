import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import VisitorNavbar from "../../components/common/VisitorNavbar";
import api from "../../api";
import {
  Card,
  Spinner,
  Form,
  InputGroup,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Carousel,
  Badge,
} from "react-bootstrap";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/modernDashboard.css";

const ROLE_ROUTE_MAP = {
  admin: "/DashboardAdmin",
  vendor: "/DashboardVendor",
  client: "/DashboardBuyer",
  default: "/",
};

const VisitorProducts = () => {
  const [products, setProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMedia, setModalMedia] = useState([]);
  const videoRefs = useRef([]);
  const navigate = useNavigate();

  // --- Redirect logged-in users to their dashboard ---
  useEffect(() => {
    if (localStorage.getItem("token")) {

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role) {
      const route = ROLE_ROUTE_MAP[user.role] || "/";
      navigate(route, { replace: true });
    }
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        setProducts(res.data);
        setDisplayed(res.data);
        const cats = Array.from(
          new Set(res.data.map((p) => p.category).filter(Boolean)),
        );
        setCategories(cats);
      })
      .catch(() => {
        setProducts([]);
        setDisplayed([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = [...products];
    if (search)
      filtered = filtered.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()),
      );
    if (category) filtered = filtered.filter((p) => p.category === category);
    if (minPrice !== "")
      filtered = filtered.filter((p) => Number(p.price) >= Number(minPrice));
    if (maxPrice !== "")
      filtered = filtered.filter((p) => Number(p.price) <= Number(maxPrice));
    setDisplayed(filtered);
  }, [search, category, minPrice, maxPrice, products]);

  return (
    <div className="modern-dashboard-bg min-vh-100">
      <VisitorNavbar />
      <div className="p-3 p-md-4">
        <Container fluid>
          {/* Buyer Greeting Card */}

          <Row className="mb-4">
            <Col xs={12}>
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
                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
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
                                  boxShadow: "inset 0 0 15px rgba(0,0,0,0.05)",
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
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default VisitorProducts;
