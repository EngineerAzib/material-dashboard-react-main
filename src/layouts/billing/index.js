import React, { useState } from "react";

// Main Component
const Billing = () => {
  const [products, setProducts] = useState([
    { name: "Pant 29 inch", quantity: 1, price: 1080.0, amount: 1080.0 },
  ]);

  return (
    <div style={styles.container}>
      {/* Search Bar */}
      <div style={styles.header}>
        <input
          type="text"
          placeholder="🔍 Search products by name, code or barcode"
          style={styles.searchBar}
        />
      </div>

      {/* Product Table */}
      <div style={styles.productContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Product Name</th>
              <th style={styles.tableHeader}>Quantity</th>
              <th style={styles.tableHeader}>Price</th>
              <th style={styles.tableHeader}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{product.name}</td>
                <td style={styles.tableCell}>{product.quantity}</td>
                <td style={styles.tableCell}>{product.price.toFixed(2)}</td>
                <td style={styles.tableCell}>{product.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div style={styles.totalsContainer}>
        <div style={styles.totalsText}>
          <p>Subtotal: 1,080.00</p>
          <p>Tax: 0.00</p>
          <h2>Total: 1,080.00</h2>
        </div>
      </div>

      {/* Payment & Actions */}
      <div style={styles.actionSection}>
        <div style={styles.actionLeft}>
          <button style={styles.greenButton}>F10 Payment</button>
          <button style={styles.redButton}>Void Order</button>
        </div>

        <div style={styles.actionRight}>
          <button style={styles.blueButton}>Cash</button>
          <button style={styles.blueButton}>Bank</button>
          <button style={styles.blueButton}>Check</button>
        </div>
      </div>

      {/* Side Actions */}
      <div style={styles.sideActions}>
        <button style={styles.sideButton}>F2 Discount</button>
        <button style={styles.sideButton}>Comment</button>
        <button style={styles.sideButton}>Customer</button>
        <button style={styles.sideButton}>Cash Drawer</button>
      </div>
    </div>
  );
};

// Enhanced Styles
const styles = {
  container: {
    backgroundColor: "#2c2f33",
    height: "100vh",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    marginBottom: "20px",
  },
  searchBar: {
    width: "100%",
    padding: "15px",
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "#42454a",
    color: "white",
    border: "none",
    outline: "none",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
  },
  productContainer: {
    flex: 1,
    backgroundColor: "#36393f",
    borderRadius: "8px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  tableHeader: {
    padding: "15px",
    backgroundColor: "#42454a",
    fontWeight: "bold",
    color: "white",
    borderBottom: "1px solid #565b61",
  },
  tableCell: {
    padding: "15px",
    borderBottom: "1px solid #565b61",
    color: "#d7d7d7",
  },
  totalsContainer: {
    marginTop: "20px",
    textAlign: "right",
    color: "#d7d7d7",
  },
  totalsText: {
    paddingRight: "20px",
  },
  actionSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
  },
  actionLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  actionRight: {
    display: "flex",
    gap: "15px",
  },
  greenButton: {
    padding: "15px 25px",
    backgroundColor: "#4caf50",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
    transition: "background-color 0.3s",
  },
  redButton: {
    padding: "15px 25px",
    backgroundColor: "#f44336",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
    transition: "background-color 0.3s",
  },
  blueButton: {
    padding: "15px 25px",
    backgroundColor: "#2196f3",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
    transition: "background-color 0.3s",
  },
  sideActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  sideButton: {
    flex: 1,
    padding: "15px",
    backgroundColor: "#565b61",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 10px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
    transition: "background-color 0.3s",
  },
};

export default Billing;
