import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Spinner, Container, Row, Col, Card, Carousel, Badge, 
  Button, Form, Modal, OverlayTrigger, Tooltip 
} from "react-bootstrap";
import { Star, StarFill } from "react-bootstrap-icons";
import api, { getProductById, fetchReviews, addReview, updateReview, addToWishlist, removeFromWishlist, addToCart } from "../../api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/modernDashboard.css";
import Sidebar from "../../components/common/Sidebar";
import { toast } from 'react-toastify';
// Mock getUserById (replace with actual implementation in your api module)
const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/users/${userId}`);
    return response.data; // Expecting { _id, username }
  } catch (err) {
    console.error(`Failed to fetch user ${userId}:`, err);
    return null;
  }
};

const ProductPageVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userNames, setUserNames] = useState({}); // New state to store userId -> username mapping
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [editReviewId, setEditReviewId] = useState(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const videoRefs = useRef([]);
  const token = localStorage.getItem("token") || getCookie("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await getProductById(id);
        const reviewsRes = await fetchReviews(id);
        
        if (!productRes.data || !reviewsRes.data) {
          throw new Error("Failed to load product data");
        }

        setProduct(productRes.data);
        const reviewsArray = Array.isArray(reviewsRes.data.reviews) ? reviewsRes.data.reviews : [];
        setReviews(reviewsArray);

        // Fetch usernames for reviews
        const userIds = [...new Set(reviewsArray.map(review => review.user?._id).filter(id => id))];
        const userPromises = userIds.map(async (userId) => {
          const user = await getUserById(userId);
          console.log(`Fetched user ${userId}:`, user);
          return { userId, username: user?.username || "Anonymous" };
        });
        const userResults = await Promise.all(userPromises);
        const userNameMap = userResults.reduce((acc, { userId, username }) => {
          acc[userId] = username;
          return acc;
        }, {});
        setUserNames(userNameMap);

        console.log("Reviews fetched:", reviewsRes.data.reviews);
      
      } catch (err) {
        setError(err.message || "Failed to load product");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isLoggedIn]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return navigate("/login");
    
    try {
      const reviewData = { 
        rating: Number(rating),
        comment: reviewText 
      };

      if (editReviewId) {
        await updateReview(id, editReviewId, reviewData);
      } else {
        await addReview(id, reviewData);
      }

      // Refresh data
      const [productRes, reviewsRes] = await Promise.all([
        getProductById(id),
        fetchReviews(id)
      ]);

      setProduct(productRes.data);
      const reviewsArray = Array.isArray(reviewsRes.data.reviews) ? reviewsRes.data.reviews : [];
      setReviews(reviewsArray);

      // Refresh usernames
      const userIds = [...new Set(reviewsArray.map(review => review.user?._id).filter(id => id) )];
      const userPromises = userIds.map(async (userId) => {
        const user = await getUserById(userId);
        return { userId, username: user?.username || "Anonymous" };
      });
      const userResults = await Promise.all(userPromises);
      const userNameMap = userResults.reduce((acc, { userId, username }) => {
        acc[userId] = username;
        return acc;
      }, {});
      setUserNames(userNameMap);

      setReviewText("");
      setRating(5);
      setEditReviewId(null);
      toast.success(editReviewId ? "Response to review updated successfully!" : "Response to review submitted successfully!");
    } catch (err) {
      console.error("Review submission failed:", err);
      setError("Failed to submit review. Please try again.");
    }
  };

  const handleMediaSlide = (index) => {
    videoRefs.current.forEach(video => video?.pause());
    setActiveMediaIndex(index);
    if (product?.media?.[index]?.type === "video") {
      videoRefs.current[index]?.play();
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center mt-5">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  if (error || !product) return (
    <div className="text-center mt-5">
      <h2>{error || "Product not found"}</h2>
      <Button variant="primary" onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </div>
  );

  const media = [
    ...(product.images?.map(img => ({ type: "image", src: img })) || []),
    ...(product.video ? [{ type: "video", src: product.video }] : [])
  ];

  const userReview = isLoggedIn && reviews.find(r => 
    r.user?._id === JSON.parse(atob(token.split('.')[1])).userId
  );

  return (
        <div className="d-flex">
      <Sidebar role="vendor" />

      <div className="content flex-grow-1 p-4">
      <Container className="py-5">
        <Button variant="outline-primary" onClick={() => navigate(-1)} className="mb-4">
          ← Back to Products
        </Button>

        <Row className="g-5">
          {/* Media Section */}
          <Col lg={7}>
            <Card className="shadow-sm">
              <Carousel activeIndex={activeMediaIndex} onSelect={handleMediaSlide} interval={null}>
                {media.map((mediaItem, idx) => (
                  <Carousel.Item key={idx}>
                    {mediaItem.type === "image" ? (
                      <img
                        className="d-block w-100 cursor-zoom"
                        src={mediaItem.src}
                        alt={`Product media ${idx + 1}`}
                        style={{ maxHeight: "600px", objectFit: "contain" }}
                        onClick={() => setShowMediaModal(true)}
                      />
                    ) : (
                      <video
                        controls
                        className="d-block w-100"
                        ref={el => videoRefs.current[idx] = el}
                        style={{ maxHeight: "600px" }}
                      >
                        <source src={mediaItem.src} type="video/mp4" />
                      </video>
                    )}
                  </Carousel.Item>
                ))}
              </Carousel>
            </Card>
          </Col>

          {/* Product Details */}
          <Col lg={5}>
            <Card className="shadow-sm p-4">
              <h1 className="mb-3">{product.name}</h1>
              <div className="d-flex align-items-center gap-3 mb-4">
                <h2 className="text-primary mb-0">{product.price} TND</h2>
                <Badge bg="light" text="dark" className="fs-6">{product.category}</Badge>
              </div>
              
              <div className="d-flex gap-2 mb-4">
                <OverlayTrigger
                  overlay={<Tooltip>{isLoggedIn ? "Add to Cart" : "Login to add to cart"}</Tooltip>}
                >
                  <Button
                    variant="primary"
                    onClick={() => isLoggedIn && addToCart(product._id)}
                    disabled={!isLoggedIn}
                  >
                    <i className="bi bi-cart-plus me-2"></i>Add to Cart
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger
                  overlay={<Tooltip>
                    {isLoggedIn 
                      ? (wishlist.includes(product._id) 
                        ? "Remove from Wishlist" 
                        : "Add to Wishlist")
                      : "Login to manage wishlist"}
                  </Tooltip>}
                >
                  <Button
                    variant={wishlist.includes(product._id) ? "danger" : "outline-danger"}
                    onClick={() => {
                      if (!isLoggedIn) return;
                      wishlist.includes(product._id)
                        ? removeFromWishlist(product._id).then(() => 
                            setWishlist(w => w.filter(id => id !== product._id))
                          )
                        : addToWishlist(product._id).then(() => 
                            setWishlist(w => [...w, product._id])
                          );
                    }}
                  >
                    <i className={`bi bi-heart${wishlist.includes(product._id) ? "-fill" : ""}`}></i>
                  </Button>
                </OverlayTrigger>
              </div>

              <div className="mb-4">
                <h4 className="mb-3">Product Details</h4>
                <p className="text-secondary">{product.description}</p>
              </div>

              <div className="ratings-section">
                <h4 className="mb-3">
                  {product.averageRating?.toFixed(1) || 0}/5.0 
                  <span className="text-warning ms-2">
                    {[...Array(5)].map((_, i) => (
                      i < Math.floor(product.averageRating || 0) ? 
                      <StarFill key={i} /> : <Star key={i} />
                    ))}
                  </span>
                  <span className="text-muted ms-2">({product.reviewCount} reviews)</span>
                </h4>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Reviews Section */}
        <Row className="mt-5">
          <Col>
            <Card className="shadow-sm p-4">
              <h3 className="mb-4">Customer Reviews</h3>
              
              {isLoggedIn && (
                <Form onSubmit={handleAddReview} className="mb-5">
                  <Form.Group className="mb-3">
                    <Form.Label>Your response to reviews</Form.Label>
                    <div>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Write your response..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    {editReviewId ? "Update Response" : "Submit Response"}
                  </Button>
                  {editReviewId && (
                    <Button
                      variant="outline-secondary"
                      className="ms-2"
                      onClick={() => {
                        setEditReviewId(null);
                        setReviewText("");
                        setRating(5);
                        }}
                      >
                        Cancel
                      </Button>
                      )}
                    </Form>
                    )}

                    {reviews.length === 0 ? (
                    <div className="text-center text-muted py-4">
                      No reviews yet. Be the first to review!
                    </div>
                    ) : (
                    reviews.map(review => (
                      <Card key={review._id} className="mb-3 border-0 bg-light">
                      <Card.Body>
                        <div className="d-flex justify-content-between">
                        <div>
                          <h5>{userNames[review.user?._id] || "Anonymous"}</h5>
                          {(!isLoggedIn || review.user?._id !== JSON.parse(atob(token.split('.')[1]))?.userId) && (
                          <div className="text-warning mb-2">
                            {[...Array(5)].map((_, i) => (
                            i < review.rating ? 
                            <StarFill key={i} /> : <Star key={i} />
                            ))}
                          </div>
                          )}
                          <p className="mb-0">{review.comment}</p>
                        </div>
                        {isLoggedIn && review.user?._id === JSON.parse(atob(token.split('.')[1]))?.userId && (
                          <Button
                          variant="link"
                          onClick={() => {
                              setEditReviewId(review._id);
                              setRating(review.rating);
                              setReviewText(review.comment);
                            }}
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                      <small className="text-muted">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </small>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card>
          </Col>
        </Row>

        {/* Media Modal */}
        <Modal show={showMediaModal} onHide={() => setShowMediaModal(false)} centered size="xl">
          <Modal.Body className="p-0">
            <Carousel activeIndex={activeMediaIndex} onSelect={handleMediaSlide} interval={null}>
              {media.map((mediaItem, idx) => (
                <Carousel.Item key={idx}>
                  {mediaItem.type === "image" ? (
                    <img
                      className="d-block w-100"
                      src={mediaItem.src}
                      alt={`Product media ${idx + 1}`}
                      style={{ maxHeight: "80vh", objectFit: "contain" }}
                    />
                  ) : (
                    <video
                      controls
                      className="d-block w-100"
                      ref={el => videoRefs.current[idx] = el}
                      style={{ maxHeight: "80vh" }}
                    >
                      <source src={mediaItem.src} type="video/mp4" />
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

export default ProductPageVendor;