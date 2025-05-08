import React, { useEffect, useState } from "react";
import Sidebar from "../components/common/Sidebar";
import { getWishlist, removeFromWishlist } from "../api"; // Adjust path if needed
import { Container } from "react-bootstrap";

function Wishlist() {
  // Get role from localStorage, context, or default to 'client'
  const role = localStorage.getItem("role") || "buyer";

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
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      <Sidebar role={role} />
      <div className="flex-grow-1 p-4">
        <Container fluid>
          <div style={{ marginTop: "2rem" }}>
            <h2 className="mb-4">My Wishlist</h2>
            {loading ? (
              <div>Loading wishlist...</div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : wishlist.length === 0 ? (
              <div className="alert alert-info">Your wishlist is empty.</div>
            ) : (
              <div className="row">
                {wishlist.map((product) => (
                  <div className="col-md-4 mb-4" key={product._id}>
                    <div className="card h-100">
                      {product.images && product.images.length > 0 && (
                        <img
                          src={`http://localhost:3000/${product.images[0]}`}
                          className="card-img-top"
                          alt={product.name}
                          style={{ objectFit: "cover", height: "200px" }}
                          onError={e => { e.target.src = "/default_product.png" }}
                        />
                      )}
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">{product.description}</p>
                        <p className="card-text fw-bold mb-2">
                          {product.price} TND
                        </p>
                        <button
                          className="btn btn-danger mt-auto"
                          onClick={() => handleRemove(product._id)}
                        >
                          Remove from Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Wishlist;