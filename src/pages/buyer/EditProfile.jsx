import React, { useEffect, useState } from "react";
import api from "../../api";
import { Form, Button, Card, Spinner, Container, Row, Col, Alert, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import BuyerNavbar from "../../components/common/BuyerNavbar";

const EditProfile = () => {
  const [user, setUser] = useState({  email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [passwords, setPasswords] = useState({ password: "", confirm: "" });

useEffect(() => {
  setLoading(true);
  console.log(localStorage.getItem("token")); // Or wherever you store it
api.get("/users/users/me")
  .then((res) => {
    setUser({ email: res.data.email });
  })
  .catch((err) => {
    console.error("Profile load error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
    });
    setError("Failed to load profile");
  })
  .finally(() => setLoading(false));}, []);
  const handleChange = (e) => {
    setUser((u) => ({ ...u, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswords((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (passwords.password && passwords.password !== passwords.confirm) {
      setError("Passwords do not match.");
      setSaving(false);
      return;
    }

    api
      .put("/users/users/me", {
        email: user.email,
        ...(passwords.password ? { password: passwords.password } : {}),
      })
      .then(() => {
        toast.success("Profile updated successfully!");
        setPasswords({ password: "", confirm: "" });
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Failed to update profile"
        );
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className="modern-dashboard-bg min-vh-100">
      <BuyerNavbar />
      <Container style={{ maxWidth: 520 }}>
        <Row className="justify-content-center mt-5">
          <Col>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="fw-bold mb-4">
                  <i className="bi bi-person-circle text-primary me-2"></i>
                  Edit Profile
                </Card.Title>
                {error && <Alert variant="danger">{error}</Alert>}
                {loading ? (
                  <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit} autoComplete="off">
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                      />
                    </Form.Group>
                    <hr />
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>New Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="password"
                          name="password"
                          value={passwords.password}
                          onChange={handlePasswordChange}
                          placeholder="Leave blank to keep current password"
                          autoComplete="new-password"
                        />
                      </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="confirm">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirm"
                        value={passwords.confirm}
                        onChange={handlePasswordChange}
                        autoComplete="new-password"
                      />
                    </Form.Group>
                    <div className="d-grid">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <Spinner animation="border" size="sm" /> Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditProfile;