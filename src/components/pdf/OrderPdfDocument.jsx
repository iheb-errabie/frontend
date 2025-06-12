import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  header: { marginBottom: 20, textAlign: 'center', fontSize: 18 },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: { flexDirection: "row" },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    backgroundColor: '#f0f0f0'
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5
  }
});

const OrderPdfDocument = ({ orders }) => (
  <Document>
    {orders.map((order, index) => (
      <Page key={index} style={styles.page}>
        <Text style={styles.header}>Order Invoice</Text>
        <Text>Order ID: {order._id?.slice(-6).toUpperCase()}</Text>
        <Text>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
        
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text>Item</Text></View>
            <View style={styles.tableColHeader}><Text>Qty</Text></View>
            <View style={styles.tableColHeader}><Text>Price</Text></View>
            <View style={styles.tableColHeader}><Text>Total</Text></View>
          </View>
          
          {order.items?.map((item, idx) => (
            <View style={styles.tableRow} key={idx}>
              <View style={styles.tableCol}>
                <Text>{item.product?.name || 'N/A'}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{item.quantity}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{(item.product?.price || 0).toFixed(2)} TND</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{((item.quantity || 0) * (item.product?.price || 0)).toFixed(2)} TND</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={{ marginTop: 20 }}>
          Order Total: {order.total?.toFixed(2)} TND
        </Text>
      </Page>
    ))}
  </Document>
);

export default OrderPdfDocument;