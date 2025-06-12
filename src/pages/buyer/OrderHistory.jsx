import React, { useEffect, useState } from "react";
import BuyerNavbar from "../../components/common/BuyerNavbar";
import api from "../../api";
import { Container, Table, Spinner, Alert, Button, ButtonGroup } from "react-bootstrap";
import * as XLSX from "xlsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { PDFDownloadLink } from '@react-pdf/renderer';
import OrderPdfDocument from "../../components/pdf/OrderPdfDocument.jsx";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    api.get("/users/orders")
      .then(res => setOrders(res.data))
      .catch(() => setError("Failed to fetch orders"))
      .finally(() => setLoading(false));
  }, []);

  const toggleDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleDownloadExcel = () => {
    try {
      const flattenedData = orders.flatMap(order =>
        order.items.map(item => ({
          "Order ID": order._id.slice(-6).toUpperCase(),
          Date: new Date(order.createdAt).toLocaleDateString(),
          "Item Name": item.product?.name || 'N/A',
          Quantity: item.quantity || 0,
          "Price (TND)": item.product?.price?.toFixed(2) || '0.00',
          "Total (TND)": ((item.quantity || 0) * (item.product?.price || 0))?.toFixed(2),
          "Order Total (TND)": order.total?.toFixed(2) || '0.00'
        }))
      );

      const worksheet = XLSX.utils.json_to_sheet(flattenedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Order History");
      XLSX.writeFile(workbook, "order_history.xlsx");
    } catch (error) {
      setError("Failed to generate Excel file");
    }
  };

  const handleDownloadPDF = () => {
  try {
    const doc = new jsPDF();
    
    orders.forEach((order, index) => {
      if (index !== 0) doc.addPage();

      // Add order header
      doc.setFontSize(12);
      doc.text(`Order ID: ${order._id.slice(-6).toUpperCase()}`, 10, 20);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 10, 30);

      // Use the autoTable function directly from the imported module
      autoTable(doc, {
        startY: 40,
        head: [['Item Name', 'Quantity', 'Price (TND)', 'Total (TND)']],
        body: order.items.map(item => [
          item.product?.name || 'N/A',
          item.quantity,
          (item.product?.price || 0).toFixed(2),
          ((item.quantity || 0) * (item.product?.price || 0)).toFixed(2)
        ]),
        theme: 'grid',
        styles: { fontSize: 10 }
      });

      // Add total below table
      doc.setFontSize(12);
      doc.text(`Order Total: ${order.total?.toFixed(2)} TND`, 
        10, 
        doc.lastAutoTable.finalY + 10
      );
    });

    doc.save("order_history.pdf");
  } catch (error) {
    setError("Failed to generate PDF file");
    console.error('PDF Generation Error:', error);
  }
};

  return (
    <div className="modern-dashboard-bg min-vh-100">
      <BuyerNavbar />
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0 text-primary">Order History</h2>
          <ButtonGroup>
            <Button variant="outline-success" onClick={handleDownloadExcel}>
              <i className="bi bi-file-earmark-excel me-2"></i>
              Excel
            </Button>
            <PDFDownloadLink 
              document={<OrderPdfDocument orders={orders} />} 
              fileName="order_history.pdf"
            >
              {({ loading }) => (
                <Button variant="outline-danger" disabled={loading}>
                  <i className="bi bi-file-earmark-pdf me-2"></i>
                  {loading ? 'Generating...' : 'PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          </ButtonGroup>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table striped bordered hover responsive className="order-table">
            <thead className="bg-primary text-white">
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total (TND)</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <React.Fragment key={order._id}>
                  <tr>
                    <td>{order._id.slice(-6).toUpperCase()}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.items.length}</td>
                    <td>{order.total?.toFixed(2) || '0.00'}</td>
                    <td>
                      <Button 
                        variant="link" 
                        onClick={() => toggleDetails(order._id)}
                        className="p-0 text-decoration-none"
                      >
                        {expandedOrderId === order._id ? (
                          <>
                            <i className="bi bi-chevron-up me-2"></i>
                            Hide
                          </>
                        ) : (
                          <>
                            <i className="bi bi-chevron-down me-2"></i>
                            View
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                  
                  {expandedOrderId === order._id && (
                    <tr>
                      <td colSpan={5} className="p-4 bg-light">
                        <Table bordered className="nested-table">
                          <thead>
                            <tr>
                              <th>Item Name</th>
                              <th>Quantity</th>
                              <th>Price (TND)</th>
                              <th>Total (TND)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, index) => (
                              <tr key={index}>
                                <td>{item.product?.name || 'N/A'}</td>
                                <td>{item.quantity || 0}</td>
                                <td>{item.product?.price?.toFixed(2) || '0.00'}</td>
                                <td>{((item.quantity || 0) * (item.product?.price || 0))?.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        )}
      </Container>

      <style>{`
        .modern-dashboard-bg {
          background-color: #f8f9fa;
        }
        .order-table {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
        }
        .nested-table {
          background-color: #fff;
          margin: 0;
        }
        .table thead th {
          border-bottom: 2px solid #dee2e6;
        }
      `}</style>
    </div>
  );
};

export default OrderHistory;