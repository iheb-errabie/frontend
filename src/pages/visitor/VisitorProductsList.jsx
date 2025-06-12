import { useEffect, useState, useRef } from "react";
import BuyerNavbar from "../../components/common/BuyerNavbar";
import api, { getWishlist, addToWishlist, removeFromWishlist, addToCart } from "../../api";
import {
  Card, Spinner, Form, InputGroup, Button, OverlayTrigger, Tooltip,
  Container, Row, Col, Modal, Carousel, Badge
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/modernDashboard.css";
import { Link } from "react-router-dom";
import VisitorNavbar from "../../components/common/VisitorNavbar";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const VisitorProductsList = () => {
  const token = localStorage.getItem("token") || getCookie("token");
  const isLoggedIn = !!token;

  const [products, setProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMedia, setModalMedia] = useState([]);
  const videoRefs = useRef([]);

  useEffect(() => {
    api.get("/products")
      .then((res) => {
        setProducts(res.data);
        setDisplayed(res.data);
        const cats = Array.from(new Set(res.data.map(p => p.category).filter(Boolean)));
        setCategories(cats);
      })
      .catch(() => {
        setProducts([]);
        setDisplayed([]);
      })
      .finally(() => setLoading(false));

    getWishlist()
      .then((res) => setWishlist(res.data.map((p) => p._id)))
      .catch(() => setWishlist([]));
  }, []);

  useEffect(() => {
    let filtered = [...products];
    if (search)
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    if (category)
      filtered = filtered.filter(p => p.category === category);
    if (minPrice !== "")
      filtered = filtered.filter(p => Number(p.price) >= Number(minPrice));
    if (maxPrice !== "")
      filtered = filtered.filter(p => Number(p.price) <= Number(maxPrice));
    setDisplayed(filtered);
  }, [search, category, minPrice, maxPrice, products]);

  const handleAddToWishlist = (productId) => {
    addToWishlist(productId)
      .then(() => {
        setWishlist((w) => [...w, productId]);
        toast.success("Added to wishlist!", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .catch(() => {
        toast.error("Failed to add to wishlist", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId)
      .then(() => {
        setWishlist((w) => w.filter((id) => id !== productId));
        toast.success("Removed from wishlist!", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .catch(() => {
        toast.error("Failed to remove from wishlist", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

  const handleAddToCart = (productId) => {
    addToCart(productId)
      .then(() => {
        toast.success("Product added to cart!", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .catch(() => {
        toast.error("Failed to add to cart", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

  const role = "buyer";

  // Modal logic
  const handleCardClick = (product) => {
    const media = [
      ...(product.images || []).map(img => ({ type: "image", src: img })),
      ...(product.video ? [{ type: "video", src: product.video }] : [])
    ];
    setModalMedia(media);
    setShowModal(true);
  };

  const handleSlideChange = (eventKey) => {
    videoRefs.current.forEach(video => {
      if (video) video.pause();
    });
    const currentMedia = modalMedia[eventKey];
    if (currentMedia && currentMedia.type === "video") {
      const videoElement = videoRefs.current[eventKey];
      if (videoElement) videoElement.play();
    }
  };

  return (
    <div className="modern-dashboard-bg min-vh-100">
      <VisitorNavbar />
      <div className="flex-grow-1 p-3 p-md-4">
        <Container fluid>
          <h2 className="fw-bold d-flex align-items-center gap-2 mb-4">
            <i className="bi bi-box-seam-fill text-primary"></i>
            All Products
          </h2>
          {/* FILTER BAR */}
          <Row className="g-3 mb-4">
            <Col xs={12} md={4} lg={3}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by name..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col xs={12} md={3} lg={2}>
              <Form.Select
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={6} md={2} lg={2}>
              <Form.Control
                type="number"
                placeholder="Min Price"
                value={minPrice}
                min={0}
                onChange={e => setMinPrice(e.target.value)}
              />
            </Col>
            <Col xs={6} md={2} lg={2}>
              <Form.Control
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                min={0}
                onChange={e => setMaxPrice(e.target.value)}
              />
            </Col>
            <Col xs={12} md="auto">
              {(search || category || minPrice || maxPrice) && (
                <Button
                  variant="outline-secondary"
                  onClick={() => { setSearch(""); setCategory(""); setMinPrice(""); setMaxPrice(""); }}
                  className="w-100"
                >
                  <i className="bi bi-x-circle"></i> Clear
                </Button>
              )}
            </Col>
          </Row>
          {/* PRODUCTS GRID */}
          {loading ? (
            <div className="d-flex align-items-center justify-content-center" style={{ height: "300px" }}>
              <Spinner animation="border" variant="primary" />
            </div>
          ) : displayed.length === 0 ? (
            <div className="modern-empty-state text-center my-5">
              <i className="bi bi-emoji-frown" style={{ fontSize: "2.5rem" }}></i>
              <div className="mt-3 fs-5 text-muted">No products found.</div>
            </div>
          ) : (
            <Row xs={1} sm={2} md={3} xl={4} className="g-4">
              {displayed.map((product) => (
                <Col key={product._id}>
                  <Card className="modern-product-card h-100 shadow-sm clickable" onClick={() => handleCardClick(product)}>
                    <div style={{ overflow: "hidden", borderRadius: "1.1rem 1.1rem 0 0" }}>
                      <Card.Img
                        variant="top"
                        src={product.images && product.images[0]}
                        alt={product.name}
                        style={{ maxHeight: 190, objectFit: "cover" }}
                      />
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <Card.Title className="modern-product-title text-truncate mb-0">
                          
                            <span className="text-truncate d-inline-block align-middle">
                              {product.name}
                            </span>
                            <i className="bi bi-box-arrow-up-right ms-2 align-middle" style={{ fontSize: '0.8rem' }}></i>
                          
                        </Card.Title>
                        {product.category && (
                          <Badge bg="light" text="dark" className="modern-cat-badge">{product.category}</Badge>
                        )}
                      </div>
                      <Card.Text className="text-secondary modern-product-desc mb-2">
                        {product.description?.slice(0, 60)}...
                      </Card.Text>
                      <div className="fw-semibold text-primary mb-2">{product.price} TND</div>
                      <div className="d-flex gap-2 mt-auto">
                        <OverlayTrigger
                          overlay={<Tooltip>{isLoggedIn ? "Add to Cart" : "Login to add to cart"}</Tooltip>}
                        >
                          <span className="d-inline-block w-100">
                            <Button
                              variant="primary"
                              className="flex-grow-1 w-100"
                              onClick={e => {
                                e.stopPropagation();
                                if (isLoggedIn) handleAddToCart(product._id);
                              }}
                              disabled={!isLoggedIn}
                            >
                              <i className="bi bi-cart-plus"></i> Add to Cart
                            </Button>
                          </span>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>
                              {isLoggedIn 
                                ? (wishlist.includes(product._id) 
                                  ? "Remove from Wishlist" 
                                  : "Add to Wishlist")
                                : "Login to manage wishlist"}
                            </Tooltip>
                          }
                        >
                          <span className="d-inline-block">
                            <Button
                              variant={wishlist.includes(product._id) ? "danger" : "outline-danger"}
                              style={{ minWidth: "44px" }}
                              onClick={e => {
                                e.stopPropagation();
                                if (isLoggedIn) {
                                  wishlist.includes(product._id)
                                    ? handleRemoveFromWishlist(product._id)
                                    : handleAddToWishlist(product._id);
                                }
                              }}
                              disabled={!isLoggedIn}
                            >
                              <i className={wishlist.includes(product._id) ? "bi bi-heart-fill" : "bi bi-heart"}></i>
                            </Button>
                          </span>
                        </OverlayTrigger>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          {/* MODAL for images and video */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Body>
              <Carousel interval={null} onSlide={handleSlideChange}>
                {modalMedia.map((media, idx) => (
                  <Carousel.Item key={idx}>
                    {media.type === "image" ? (
                      <img src={media.src} alt={`media-${idx}`} className="d-block w-100" />
                    ) : (
                      <video
                        controls
                        className="d-block w-100"
                        ref={el => videoRefs.current[idx] = el}
                        onClick={e => e.stopPropagation()}
                        style={{ maxHeight: 400 }}
                      >
                        <source src={media.src} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </Carousel.Item>
                ))}
              </Carousel>
            </Modal.Body>
          </Modal>
          <ToastContainer />
        </Container>
      </div>
    </div>
  );
};

export default VisitorProductsList;