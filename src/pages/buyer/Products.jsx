import { useEffect, useState, useRef } from "react";
import Sidebar from "../../components/common/Sidebar";
import api, { getWishlist, addToWishlist, removeFromWishlist, addToCart } from "../../api";
import {
  Card, Spinner, Form, InputGroup, Button, OverlayTrigger, Tooltip,
  Container, Row, Col, Modal, Carousel
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Products = () => {
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

  // Fetch products and wishlist
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
    addToWishlist(productId).catch(() => {});
  };
  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId).catch(() => {});
  };
  const handleAddToCart = (productId) => {
    addToCart(productId).catch(() => {});
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
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      <Sidebar role={role} />
      <div className="flex-grow-1 p-4">
        <Container fluid>
          <h1 className="mb-4 text-3xl fw-bold text-gray-800 d-flex align-items-center gap-2">
            <i className="bi bi-box-seam-fill text-primary"></i> All Products
          </h1>
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
                  variant="secondary"
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
            <div className="text-center text-secondary mt-5">
              <i className="bi bi-emoji-frown" style={{ fontSize: "2rem" }}></i>
              <p className="mt-2">No products found.</p>
            </div>
          ) : (
            <Row xs={1} sm={2} md={3} xl={4} className="g-4">
              {displayed.map((product) => (
                <Col key={product._id}>
                  <Card className="h-100 shadow-sm" style={{ cursor: "pointer" }} onClick={() => handleCardClick(product)}>
                    <Card.Img variant="top" src={product.images && product.images[0]} 
                      alt={product.name} style={{ maxHeight: 220, objectFit: "cover" }} />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="text-truncate">{product.name}</Card.Title>
                      <Card.Text className="text-secondary">{product.description?.slice(0, 80)}...</Card.Text>
                      <div className="fw-semibold text-primary mb-2">{product.price} TND</div>
                      <div className="small text-muted mb-2">{product.category}</div>
                      <div className="d-flex gap-2 mt-auto">
                        <button
                          className="btn btn-primary flex-grow-1"
                          onClick={e => { e.stopPropagation(); handleAddToCart(product._id); }}
                        >
                          <i className="bi bi-cart-plus"></i> Add to Cart
                        </button>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>
                              {wishlist.includes(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                            </Tooltip>
                          }
                        >
                          <button
                            className={`btn btn-outline-danger${wishlist.includes(product._id) ? " active" : ""}`}
                            style={{ minWidth: "44px" }}
                            onClick={e => {
                              e.stopPropagation();
                              wishlist.includes(product._id)
                                ? handleRemoveFromWishlist(product._id)
                                : handleAddToWishlist(product._id);
                            }}
                          >
                            <i className={wishlist.includes(product._id) ? "bi bi-heart-fill" : "bi bi-heart"}></i>
                          </button>
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
        </Container>
      </div>
    </div>
  );
};

export default Products;