import { useEffect, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import { fetchVendors, approveVendor, deleteUser } from "../../api";
import { Table, Button, Spinner, Alert, Container } from "react-bootstrap";

const ManageVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVendors()
      .then(res => setVendors(res.data))
      .catch(() => setError("Failed to fetch vendors"))
      .finally(() => setLoading(false));
  }, []);

 // handle approve vendor
  const handleApprove = async (id) => {
    try {
      const res = await approveVendor(id);
      if (res.status === 200) {
        setVendors(vendors.map(v => v._id === id ? { ...v, approved: true } : v));
      } else {
        setError("Failed to approve vendor");
      }
    } catch (err) {
      setError("Failed to approve vendor");
    }
  }

  const handleDelete = async (id) => {
    await deleteUser(id);
    setVendors(vendors.filter(v => v._id !== id));
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <div className="flex-grow-1 p-4">
        <Container>
          <h2>Manage Vendors</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? <Spinner /> : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th><th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(v => (
                  <tr key={v._id}>
                    <td>{v.username}</td>
                    <td>{v.email}</td>
                    <td>{v.approved == true ? "Approved" : "Pending"}</td>
                    <td>
                      {v.approved == false && (
                        <Button size="sm" variant="success" onClick={() => handleApprove(v._id)}>Approve</Button>
                      )}
                      <Button size="sm" variant="danger" className="ms-2" onClick={() => handleDelete(v._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Container>
      </div>
    </div>
  );
};

export default ManageVendors;