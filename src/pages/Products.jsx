import { useEffect, useState } from "react";
import Sidebar from "../components/common/Sidebar";
import api from "../api";
import { getWishlist, addToWishlist, removeFromWishlist } from "../api";
import { Card, Spinner, Form, InputGroup, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
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

  // Wishlist handlers (sync with backend)
  const handleAddToWishlist = async (productId) => {
    await addToWishlist(productId);
    setWishlist((prev) => prev.includes(productId) ? prev : [...prev, productId]);
  };

  const handleRemoveFromWishlist = async (productId) => {
    await removeFromWishlist(productId);
    setWishlist((prev) => prev.filter(id => id !== productId));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
          <i className="bi bi-box-seam-fill text-blue-600"></i> All Products
        </h1>

        {/* FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <InputGroup className="flex-1">
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="focus:ring-blue-500"
            />
          </InputGroup>
          <Form.Select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="max-w-xs"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </Form.Select>
          <Form.Control
            type="number"
            placeholder="Min Price"
            value={minPrice}
            min={0}
            onChange={e => setMinPrice(e.target.value)}
            className="max-w-[120px]"
          />
          <Form.Control
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            min={0}
            onChange={e => setMaxPrice(e.target.value)}
            className="max-w-[120px]"
          />
          {(search || category || minPrice || maxPrice) && (
            <Button
              variant="secondary"
              onClick={() => { setSearch(""); setCategory(""); setMinPrice(""); setMaxPrice(""); }}
              className="flex-none"
            >
              <i className="bi bi-x-circle"></i> Clear
            </Button>
          )}
        </div>

        {/* PRODUCTS GRID */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            <i className="bi bi-emoji-frown text-4xl"></i>
            <p className="mt-2">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayed.map((product) => (
              <Card key={product._id} className="shadow-lg hover:shadow-2xl transition">
                {product.image && (
                  <Card.Img variant="top" src={product.image} alt={product.name} style={{maxHeight:220, objectFit:"cover"}} />
                )}
                <Card.Body>
                  <Card.Title className="truncate">{product.name}</Card.Title>
                  <Card.Text className="text-gray-700">{product.description?.slice(0, 80)}...</Card.Text>
                  <div className="font-semibold text-blue-600 text-lg mb-2">
                    {product.price} TND
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {product.category}
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-primary flex-1">
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
                        className={`btn btn-outline-danger ${wishlist.includes(product._id) ? "active" : ""}`}
                        onClick={() =>
                          wishlist.includes(product._id)
                            ? handleRemoveFromWishlist(product._id)
                            : handleAddToWishlist(product._id)
                        }
                        style={{ minWidth: "44px" }}
                      >
                        <i className={wishlist.includes(product._id) ? "bi bi-heart-fill" : "bi bi-heart"}></i>
                      </button>
                    </OverlayTrigger>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;