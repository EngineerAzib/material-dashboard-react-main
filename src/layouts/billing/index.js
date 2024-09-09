
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

import { getDailyRevenue ,getWeeklyRevenue,getYearlyRevenue} from 'Services/revenueService'; // 
const Billing = () => {
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [editableTotalAmount, setEditableTotalAmount] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState({}); 
  const [customAmounts, setCustomAmounts] = useState({});

  // Handles the search input change and product fetching logic
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 1) {
      try {
        const response = await axios.get(`https://localhost:7171/GetProduct?query=${value}`);
        setSearchResults(response.data);
      } catch (error) {
        toast.error("Error fetching product data:");
      }
    } else {
      setSearchResults([]);
    }
  };

  // Adds selected product to the billing list
  const addProductToBilling = (product) => {
    const existingProductIndex = products.findIndex((p) => p.barCode === product.barCode);

    if (existingProductIndex !== -1) {
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex].quantity += 1;
      updatedProducts[existingProductIndex].amount =
        updatedProducts[existingProductIndex].quantity * updatedProducts[existingProductIndex].price;
      setProducts(updatedProducts);
    } else {
      setProducts([...products, { ...product, quantity: 1, amount: product.price }]);
    }

    setSearchResults([]);
    setSearchTerm("");
  };

  // Handles product quantity change
  // Handles product quantity change
const handleQuantityChange = (index, value) => {
  const updatedProducts = [...products];

  if (value === "") {
    updatedProducts[index].quantity = "";
    updatedProducts[index].amount = 0; // Set amount to 0 if quantity is empty
  } else {
    const quantity = parseInt(value, 10) || 1;
    updatedProducts[index].quantity = quantity;
    updatedProducts[index].amount = quantity * updatedProducts[index].price;
  }

  setProducts(updatedProducts);
};


  // Handles product price change
  const handlePriceChange = (index, value) => {
    const updatedProducts = [...products];
    if (value === "") {
      updatedProducts[index].price = "";
      updatedProducts[index].amount = 0;
    } else {
      const price = parseFloat(value) || 0;
      updatedProducts[index].price = price;
      updatedProducts[index].amount = updatedProducts[index].quantity * price;
    }
    setProducts(updatedProducts);
  };

  // Handles product deletion
  const handleDeleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  // Opens the modal and fetches payment methods from the API
  const handleOpenModal = async () => {
    const total = products.reduce((acc, product) => acc + product.amount, 0);
    setTotalAmount(total);
    setEditableTotalAmount(total);

    try {
      const response = await axios.get("https://localhost:7171/api/Payment/Getpayment");
      const paymentMethods = response.data;
      setPaymentMethods(paymentMethods);
    } catch (error) {
      toast.error("Error fetching payment methods:");
    }

    setModalOpen(true); // Open the modal
  };

  // Handles payment method selection and custom amount visibility
  const handlePaymentClick = (methodId) => {
    setSelectedPaymentMethods(prev => ({
      ...prev,
      [methodId]: !prev[methodId] // Toggle the selected state
    }));
    setCustomAmounts(prev => ({
      ...prev,
      [methodId]: prev[methodId] || 0 // Initialize custom amount if not already set
    }));
  };

  // Handles custom amount input change
  const handleCustomAmountChange = (methodId, value) => {
    setCustomAmounts(prev => ({
      ...prev,
      [methodId]: value
    }));
  };

  // Handles the "Undo" button to delete all rows
  const handleUndo = () => {
    setProducts([]);
  };

  // Saves the billing information along with selected payment methods
  const handleSavePayment = async () => {
    if (Object.keys(selectedPaymentMethods).length === 0) {
      toast.error("Please select at least one payment method.");
      return;
    }
  
    // Calculate the total amount from custom amounts
    const totalCustomAmount = Object.keys(selectedPaymentMethods).reduce((acc, methodId) => {
      return acc + (parseFloat(customAmounts[methodId]) || 0);
    }, 0);
  
    // Check if the total custom amount is greater than the total amount
    if (totalCustomAmount > totalAmount) {
      toast.error("The total amount entered for payment methods is greater than the calculated total amount.");
      return;
    }
  
    try {
      const userId = localStorage.getItem("userId");
  
      const payload = products.flatMap(product => 
        Object.keys(selectedPaymentMethods).map(methodId => ({
          BillingDate: new Date().toISOString(),
          Quantity: product.quantity,
          UnitPrice: product.price,
          PaymentTypeAmount: customAmounts[methodId] || editableTotalAmount,
          TotalAmount: product.amount,
          PaymentAmount: customAmounts[methodId] || editableTotalAmount,
          UserId: userId,
          ProductId: product.id,
          PaymentId: methodId,
        }))
      );
  
  
      await axios.post("https://localhost:7171/api/Billing/AddBilling", payload);
  
      toast.success("Billing information saved successfully!");
      await getYearlyRevenue();
      await getDailyRevenue();
      await getWeeklyRevenue();
      // Close the modal
      setModalOpen(false);
  
      // Clear the product list to reset the billing table
      setProducts([]);
      setSelectedPaymentMethods({});
      setCustomAmounts({});
      setTotalAmount(0);
      setEditableTotalAmount(0);
  

    } catch (error) {
      toast.error("Failed to save billing information.");
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
          onChange={handleSearchChange}
        />
        {searchResults.length > 0 && (
          <div style={styles.searchResults}>
            {searchResults.map((product, index) => (
              <div
                key={index}
                style={styles.searchResultItem}
                onClick={() => addProductToBilling(product)}
              >
                {product.name} - {product.barCode}
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
              <th style={styles.tableHeader}>Product Barcode</th>
              <th style={styles.tableHeader}>Product Name</th>
              <th style={styles.tableHeader}>Quantity</th>
              <th style={styles.tableHeader}>Price</th>
              <th style={styles.tableHeader}>Amount</th>
              <th style={styles.tableHeader}>Actions</th> {/* Updated Header */}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{product.barCode}</td>
                <td style={styles.tableCell}>{product.name}</td>
                <td style={styles.tableCell}>
                  <input
                    type="number"
                    value={product.quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    style={styles.smallInputField}
                  />
                </td>
                <td style={styles.tableCell}>
                  <input
                    type="number"
                    value={product.price}
                    step="0.01"
                    onChange={(e) => handlePriceChange(index, e.target.value)}
                    style={styles.smallInputField}
                  />
                </td>
                <td style={styles.tableCell}>{product.amount.toFixed(2)}</td>
                <td style={styles.tableCell}>
                  <button onClick={() => handleDeleteProduct(index)} style={styles.deleteButton}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Undo Button */}
      <button onClick={handleUndo} style={styles.undoButton}>
        Undo
      </button>

      {/* Save Button */}
      <button onClick={handleOpenModal} style={styles.saveButton}>
        Save
      </button>
      <div style={styles.totalsContainer}>
        <div style={styles.totalsText}>
          <p>Subtotal: {products.reduce((acc, product) => acc + product.amount, 0).toFixed(2)}</p>
          <p>Tax: 0.00</p>
          <h2>Total: {products.reduce((acc, product) => acc + product.amount, 0).toFixed(2)}</h2>
        </div>
      </div>
      {/* Modal */}
      {modalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Select Payment Methods</h2>
            <p>Total Amount: {editableTotalAmount.toFixed(2)}</p>
            {paymentMethods.map((method) => (
              <div key={method.id} style={styles.paymentMethod}>
                <input
                  type="checkbox"
                  checked={!!selectedPaymentMethods[method.id]}
                  onChange={() => handlePaymentClick(method.id)}
                />
                <label>{method.name}</label>
                {selectedPaymentMethods[method.id] && (
                  <input
                    type="number"
                    value={customAmounts[method.id]}
                    onChange={(e) => handleCustomAmountChange(method.id, e.target.value)}
                    placeholder="Enter custom amount"
                    style={styles.customAmountInput}
                  />
                )}
              </div>
            ))}
            <button onClick={handleSavePayment} style={styles.saveButton}>
              Confirm Payment
            </button>
            <button onClick={() => setModalOpen(false)} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
    
  );
  
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    marginBottom: "10px",
  },
  searchBar: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    marginBottom: "10px",
  },
  searchResults: {
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    maxHeight: "200px",
    overflowY: "auto",
  },
  searchResultItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #ddd",
  },
  searchResultItemHover: {
    backgroundColor: "#f5f5f5",
  },
  productContainer: {
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#f4f4f4",
    borderBottom: "2px solid #ddd",
    padding: "10px",
    textAlign: "left",
  },
  tableCell: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  smallInputField: {
    width: "80px",
    padding: "5px",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  undoButton: {
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "10px",
  },
  saveButton: {
    backgroundColor: "#2ecc71",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  modal: {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "4px",
    width: "400px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  paymentMethod: {
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
  },
  customAmountInput: {
    marginLeft: "10px",
    padding: "5px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    width: "120px",
  },
  closeButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
    
  },
};

export default Billing;
