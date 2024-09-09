import React, { useState } from "react";

import axios from "axios";
import { getDailyRevenue ,getWeeklyRevenue} from 'Services/revenueService'; // 
const Billing = () => {
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle search input change
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Only search if user enters 2 or more characters
    if (value.length > 1) {
      try {
        // Call API to get search results, support both name and barcode search
        const response = await axios.get(`https://localhost:7171/GetProduct?query=${value}`);
        console.log(response.data); // Log the response to verify the structure
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    } else {
      setSearchResults([]); // Clear search results if input is less than 2 characters
    }
  };

  // Handle adding a product to the billing table
  const addProductToBilling = (product) => {
    const existingProductIndex = products.findIndex((p) => p.barCode === product.barCode);

    if (existingProductIndex !== -1) {
      // If product already exists, update the quantity and amount
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex].quantity += 1;
      updatedProducts[existingProductIndex].amount =
        updatedProducts[existingProductIndex].quantity * updatedProducts[existingProductIndex].price;
      setProducts(updatedProducts);
    } else {
      // Add new product to the list
      setProducts([...products, { ...product, quantity: 1, amount: product.price }]);
    }

    // Clear search results after adding the product
    setSearchResults([]);
    setSearchTerm("");
  };

  // Handle changing quantity directly in input
  const handleQuantityChange = (index, value) => {
    const updatedProducts = [...products];
    const quantity = parseInt(value, 10) || 1; // Ensure quantity is at least 1
    updatedProducts[index].quantity = quantity;
    updatedProducts[index].amount = quantity * updatedProducts[index].price;
    setProducts(updatedProducts);
  };

  // Handle changing price directly in input
  const handlePriceChange = (index, value) => {
    const updatedProducts = [...products];

    if (value === "") {
      // Allow the field to be empty
      updatedProducts[index].price = "";
      updatedProducts[index].amount = 0; // Set amount to 0 when price is cleared
    } else {
      const price = parseFloat(value) || 0; // Ensure price is at least 0
      updatedProducts[index].price = price;
      updatedProducts[index].amount = updatedProducts[index].quantity * price;
    }

    setProducts(updatedProducts);
  };

  // Handle save operation
  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Get the logged-in user's ID
  
      if (!userId) {
        alert("User is not logged in.");
        return;
      }
  
      // Prepare the payload with all products
      const payload = products.map(product => ({
        BillingDate: new Date().toISOString(),
        Quantity: product.quantity,
        UnitPrice: product.price,
        TotalAmount: product.amount,
        PaymentAmount: product.amount,
        Status: product.amount === product.price * product.quantity ? "PAID" : "PENDING",
        UserId: userId,
        ProductId: product.id,
        PaymentId: 1, // Adjust as needed
      }));
  
      console.log("Payload:", payload); // Debug log to check payload
  
      // Send all products in a single request
      await axios.post("https://localhost:7171/api/Billing/AddBilling", payload);
  
      alert("Billing information saved successfully!");
      await getDailyRevenue();
      await getWeeklyRevenue();
    } catch (error) {
      console.error("Error saving billing information:", error);
      alert("Failed to save billing information.");
    }
  };
  
  
  return (
    <div style={styles.container}>
      {/* Search Bar */}
      <div style={styles.header}>
        <input
          type="text"
          placeholder="Search products by name, code, or barcode"
          style={styles.searchBar}
          value={searchTerm}
          onChange={handleSearchChange} // Search on input change
        />
        {/* Display search results */}
        {searchResults.length > 0 && (
          <div style={styles.searchResults}>
            {searchResults.map((product, index) => (
              <div
                key={index}
                style={styles.searchResultItem}
                onClick={() => addProductToBilling(product)} // Add product on click
              >
                {product.name} - {product.barCode} {/* Display product name and barcode */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Table */}
      <div style={styles.productContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Product Barcode</th> {/* Barcode Column */}
              <th style={styles.tableHeader}>Product Name</th>
              <th style={styles.tableHeader}>Quantity</th>
              <th style={styles.tableHeader}>Price</th>
              <th style={styles.tableHeader}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{product.barCode}</td> {/* Display Product Barcode */}
                <td style={styles.tableCell}>{product.name}</td>
                <td style={styles.tableCell}>
                  <input
                    type="number"
                    value={product.quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(index, e.target.value)} // Editable quantity
                    style={styles.smallInputField}
                  />
                </td>
                <td style={styles.tableCell}>
                  <input
                    type="number"
                    value={product.price}
                    step="0.01"
                    onChange={(e) => handlePriceChange(index, e.target.value)} // Editable price
                    style={styles.smallInputField}
                  />
                </td>
                <td style={styles.tableCell}>{product.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <button onClick={handleSave} style={styles.saveButton}>
        Save
      </button>

      {/* Totals Section */}
      <div style={styles.totalsContainer}>
        <div style={styles.totalsText}>
          <p>Subtotal: {products.reduce((acc, product) => acc + product.amount, 0).toFixed(2)}</p>
          <p>Tax: 0.00</p>
          <h2>Total: {products.reduce((acc, product) => acc + product.amount, 0).toFixed(2)}</h2>
        </div>
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
    position: "relative",
  },
  searchBar: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    borderRadius: "6px",
    backgroundColor: "#42454a",
    color: "white",
    border: "none",
    outline: "none",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
  },
  searchResults: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    backgroundColor: "#42454a",
    borderRadius: "8px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1,
  },
  searchResultItem: {
    padding: "10px",
    cursor: "pointer",
    color: "white",
    borderBottom: "1px solid #565b61",
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
    padding: "12px",
    backgroundColor: "#42454a",
    fontWeight: "bold",
    color: "white",
    borderBottom: "1px solid #565b61",
  },
  tableCell: {
    padding: "12px",
    borderBottom: "1px solid #565b61",
    color: "white",
  },
  smallInputField: {
    width: "80px",
    padding: "8px",
    borderRadius: "4px",
    border: "none",
    outline: "none",
    backgroundColor: "#42454a",
    color: "white",
  },
  saveButton: {
    padding: "12px 24px",
    backgroundColor: "#7289da",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    alignSelf: "flex-end",
    marginTop: "20px",
  },
  totalsContainer: {
    marginTop: "20px",
  },
  totalsText: {
    textAlign: "right",
  },
};

export default Billing;
