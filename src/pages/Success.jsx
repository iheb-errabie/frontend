import { useEffect } from "react";
import api from "../api"; // or fetch, as you use above
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Call backend to confirm and create the order
    api.post("/users/orders/confirm")
      .then(() => {
        toast.success("Order placed successfully!");
        // Optionally clear cart in frontend state if needed
      })
      .catch(() => {
        toast.error("Order creation failed, please contact support.");
      });
  }, []);

  return (
    <div className="text-center mt-5">
      <h2>Thank you for your purchase!</h2>
      <p>Your order is being processed. You can see it in your order history.</p>
      <button className="btn btn-primary mt-3" onClick={() => navigate("/orders")}>
        View My Orders
      </button>
    </div>
  );
};

export default Success;