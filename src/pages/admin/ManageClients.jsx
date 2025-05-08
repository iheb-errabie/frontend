import { useEffect, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import { fetchClients, deleteUser } from "../../api";
import { Table, Button, Spinner, Alert, Container } from "react-bootstrap";

const ManageClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClients()
      .then(res => setClients(res.data))
      .catch(() => setError("Failed to fetch clients"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    await deleteUser(id);
    setClients(clients.filter(u => u._id !== id));
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <div className="flex-grow-1 p-4">
        <Container>
          <h2>Manage Clients</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? <Spinner /> : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th><th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(u => (
                  <tr key={u._id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(u._id)}>Delete</Button>
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

export default ManageClients;