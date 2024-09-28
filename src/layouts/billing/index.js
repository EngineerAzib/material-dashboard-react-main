import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Optional for tables
import axios from "axios";
import { getDailyRevenue, getWeeklyRevenue, getYearlyRevenue } from 'Services/revenueService';
import { Height } from "@mui/icons-material";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';
import zIndex from "@mui/material/styles/zIndex";

const Billing = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showOptionsModal, setShowOptionsModal] = useState(false); // For the new options modal
  const [editableTotalAmount, setEditableTotalAmount] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState({}); 
  const [customAmounts, setCustomAmounts] = useState({});
  const [showSlipModal, setShowSlipModal] = useState(false);
  const handleDashboardClick = () => {
    console.log("Navigating to dashboard...");
    navigate("/dashboard");
  };
  const handleRefundClick = () => {
    console.log("Navigating to dashboard...");
    navigate("/Salehistory");
  };
  const renderSidebarButton = (icon, label, color = '',onClick) => (
    <button style={{
      ...styles.sidebarButton,
      ...(color && { backgroundColor: color, color: 'white' })
    }}onClick={onClick}>
      <span style={styles.sidebarIcon}>{icon}</span>
      {label}
    </button>
  );
  // Handles the search input change and product fetching logic
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
  try {
    const response = await axios.get(`https://localhost:7171/GetProduct?query=${value}`);
    
    const filteredResults = response.data.filter(product => {
      const name = product.name || ''; // Safely handle null or undefined
      const barCode = product.barCode || ''; // Safely handle null or undefined
      const code = product.code || ''; // Safely handle null or undefined
      
      return (
        name.toLowerCase().startsWith(value.toLowerCase()) || 
        barCode.toLowerCase().startsWith(value.toLowerCase()) || 
        code.toLowerCase().startsWith(value.toLowerCase())
      );
    });
    
    setSearchResults(filteredResults);
  } catch (error) {
    console.error("Error fetching product data:", error);
    toast.error("Error fetching product data:",{containerId2:"SaleHistory"});
  }
} else {
  setSearchResults([]);
}

    
  };
  const handleCloseOptionsModal = () => {
    setShowOptionsModal(false);
    // Reset relevant states to their initial values
    setProducts([]); // Reset products if needed
    setSelectedPaymentMethods({});
    setCustomAmounts({});
    setTotalAmount(0);
    setEditableTotalAmount(0);
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
      setProducts([...products, { ...product, quantity: 1, amount: product.price, billername: "" }]);
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
    const quantity = parseFloat(value) || 1;
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
 // Handles billername change
 const handleBillernameChange = (index, value) => {
  const updatedProducts = [...products];
  updatedProducts[index].billername = value;
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
      toast.error("Error fetching payment methods:",{containerId2:"SaleHistory"});
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
      toast.error("Please select at least one payment method.",{containerId2:"SaleHistory"});

      return;
    }
  
    // Calculate the total amount from custom amounts
    const totalCustomAmount = Object.keys(selectedPaymentMethods).reduce((acc, methodId) => {
      return acc + (parseFloat(customAmounts[methodId]) || 0);
    }, 0);
  
    // Check if the total custom amount is greater than the total amount
    if (totalCustomAmount > totalAmount) {
      toast.error("The total amount entered for payment methods is greater than the calculated total amount.",{containerId2:"SaleHistory"});
      return;
    }
  
    // Validate product quantities
    try {
      // Fetch available quantities from the backend
      const response = await axios.get("https://localhost:7171/api/Billing/GetAvailableQuantities");
      const availableQuantities = response.data;
  
      // Check if any product quantity exceeds available stock
      const invalidProducts = products.filter(product => 
        (availableQuantities[product.id] || 0) < product.quantity
      );
  
      if (invalidProducts.length > 0) {
        toast.error("Some products have insufficient quantity. Please adjust the quantities.",{containerId2:"SaleHistory"}
        );
        return;
      }
  
      // If validation passes, prepare and send the billing data
      const userId = localStorage.getItem("userId");
  
      const payload = products.flatMap(product => 
        Object.keys(selectedPaymentMethods).map(methodId => ({
          BillingDate: new Date().toISOString(),
          Quantity: product.quantity,
          Billername: product.billername,
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
  
      toast.success("Billing information saved successfully!",{containerId:"Billing"});
      setShowOptionsModal(true);
      await getYearlyRevenue();
      await getDailyRevenue();
      await getWeeklyRevenue();
      
      // Close the modal and reset form
       setModalOpen(false);
      // setProducts([]);
      // setSelectedPaymentMethods({});
      // setCustomAmounts({});
      // setTotalAmount(0);
      // setEditableTotalAmount(0);
  
    } catch (error) {
      toast.error("Failed to save billing information.",{containerId2:"SaleHistory"});
    }
  }; 
const handleGeneratePDF = async () => {
  const response = await fetch('https://localhost:7171/api/Billing/GetBilling');
  const billingDataArray = await response.json();

  console.log("Billing Data Array:", billingDataArray);

  const billingData = billingDataArray.find(data => data.invoiceNo); 
  
  console.log("Selected Billing Data:", billingData);
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text("INVOICE", 105, 15, null, null, 'center');

  const invoiceNo = billingData.invoiceNo;
  console.log("Invoice Number:", invoiceNo);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice Number:`, 14, 30); // Keep label position the same
  doc.text(`${invoiceNo}`,48, 30); // Move biller name down to y = 70
  doc.text(`Billing Date:`, 14, 38); // Keep label position the same
  doc.text(`${new Date().toLocaleDateString()}`,48, 38); // Move biller name down to y = 70

  const recordsForInvoice = billingDataArray.filter(data => data.invoiceNo === invoiceNo);
  const totalPaymentAmount = recordsForInvoice.reduce((acc, record) => acc + record.paymentAmount, 0);
  const recordCount = recordsForInvoice.length;

  console.log(`Record Count for Invoice ${invoiceNo}:`, recordCount);
  console.log(`Total Payment Amount for Invoice ${invoiceNo}:`, totalPaymentAmount);

  // doc.text(`Record Count: ${recordCount}`, 14, 46);


  const billerName = recordsForInvoice[0]?.billername || 'Waking Customer';
  doc.text(`Biller Name:`, 14, 46); // Keep label position the same
  doc.text(`${billerName}`,48, 46); // Move biller name down to y = 70

  // Add table (example structure)
  const tableData = products.map(product => {
      const billingForProduct = billingDataArray.find(bill => bill.productId === product.id);

      console.log("Product ID:", product.id);
      console.log("Billing Entry for Product:", billingForProduct);

      const paymentAmount = billingForProduct ? billingForProduct.paymentAmount : product.amount; 
      const unitPrice = billingForProduct ? (product.price * product.quantity).toFixed(2) : product.price.toFixed(2);
      const formattedUnitPrice = ` ${unitPrice}`;

      return [
          product.name,
          product.barCode,
          product.quantity,
          product.price.toFixed(2),
          formattedUnitPrice,
          
      ];
  });

  autoTable(doc, {
      head: [['Product Name', 'Barcode', 'Quantity',  'Unit Price','Total price']],
      body: tableData,
      startY: 70,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [41, 128, 185] },
  });

  const totalAmountPay = products.reduce((acc, product) => {
      const billingForProduct = billingDataArray.find(bill => bill.productId === product.id);
      return acc + (billingForProduct ? billingForProduct.paymentAmount : 0);
  }, 0);
 

  const totalPrice = products.reduce((acc, product) => acc + product.price*product.quantity, 0);
  // const totalRemainingAmount =  products.reduce((acc, product) => acc +(product.price*product.quantity)- totalPaymentAmount, 0);  
  const totalRemainingAmount =  totalPrice -totalPaymentAmount;
  doc.setFontSize(12);
  const pageWidth = doc.internal.pageSize.getWidth();
  const labelX = pageWidth - 60; // X position for labels (adjust as needed)
  const valueX = pageWidth - 14; // X position for values (right-aligned)
  
  const textY = doc.lastAutoTable.finalY + 10; // Starting Y position for the first text
  
  doc.text(`Total:`, labelX, textY);
  doc.text(`${totalPrice.toFixed(2)}`, valueX, textY, { align: 'right' });
  
  doc.text(`Amount Pay:`, labelX, textY + 10);
  doc.text(`${totalPaymentAmount.toFixed(2)}`, valueX, textY + 10, { align: 'right' });
  
  doc.text(`Balance:`, labelX, textY + 20);
  doc.text(`${totalRemainingAmount.toFixed(2)}`, valueX, textY + 20, { align: 'right' });
  

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Nabble Nest', 105, 285, null, null, 'center');
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for your business!', 105, 292, null, null, 'center');

  doc.save("billing_receipt.pdf");
};


  
  const handlePrintSlip = () => {
    const printContent = document.getElementById('slip-content');
    const newWindow = window.open('', '', 'height=600,width=800');
    
    newWindow.document.write('<html><head><title>Print Slip</title>');
    newWindow.document.write('</head><body >');
    newWindow.document.write(printContent.innerHTML);
    newWindow.document.write('</body></html>');
    newWindow.document.close();
    newWindow.print();
  };
  
  const handleViewSlip = () => {
    setShowSlipModal(true); // Open the modal
  };
  const [lastBilling, setLastBilling] = useState(null);

  useEffect(() => {
    // Fetch the last billing data from the API
    fetch("https://localhost:7171/api/Billing/GetBilling")
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data); // Check the API response in the console
        setLastBilling(data); // Set the billing data from the API
      })
      .catch(error => console.error("Error fetching billing data:", error));
  }, []);
  
  return (
    <div style={styles.container}>      
 {showOptionsModal && (
  <div style={styles.slipModalOverlay}>
    <div style={styles.slipModalContent}>
      <h2 style={styles.modalHeader}>Billing Slip</h2>
      
      <div style={styles.shopDetails}>
        <div style={styles.shopName}>SHOP NAME</div>
        <div>Address: Lorem Ipsum, 23-10</div>
        <div>Tel: 11223344</div>
      </div>

      <table style={styles.slipTable}>
        <thead>
          <tr>
            <th style={styles.slipTableHeader}>Description</th>
            <th style={styles.slipTableHeader}>Quantity</th>
            <th style={styles.slipTableHeader}>Unit Price</th>
            <th style={styles.slipTableHeader}>Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => {
            const methodId = selectedPaymentMethods[product.id];

            const billingForProduct = lastBilling && lastBilling.find(bill => bill.productId === product.id);
            
            const paymentAmount = billingForProduct
              ? billingForProduct.paymentAmount
              : customAmounts[methodId] || editableTotalAmount;

            return (
              <tr key={index}>
                <td style={styles.slipTableCell}>{product.name}</td>
                <td style={styles.slipTableCell}>{product.quantity}</td>
                <td style={styles.slipTableCell}>{product.price.toFixed(2)}</td>
                <td style={styles.slipTableCell}>{(product.price * product.quantity).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={styles.slipTotalContainer}>
        <strong>Total:</strong>
        <span style={styles.slipTotalAmount}>
          {products.reduce((acc, product) => acc + (product.price * product.quantity), 0).toFixed(2)}
        </span>
      </div>
      
      <div style={styles.footer}>
        <div style={styles.thankYouMessage}>Thank You!</div>
      </div>

      <div style={styles.buttonContainer}>
        <button onClick={handleGeneratePDF} style={styles.optionButton}>Generate PDF</button>
        <button onClick={handleCloseOptionsModal} style={styles.closeButton}>Close</button>
      </div>
    </div>
  </div>
)}

      
    {/* Box starts here */}
    <div style={styles.box}>
      {/* Search Bar */}
      <div style={styles.header}>
        <div style={styles.searchBarContainer}>
          <i className="fa fa-search" style={styles.searchIcon}></i>
          <input
            type="text"
            placeholder="Search products by name, code, or barcode"
            style={styles.searchBar}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
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
                <th style={styles.tableHeaders}>P.Code</th>
                <th style={styles.tableHeader}>P.Name</th>
                <th style={styles.tableHeaderB}>B.Name</th>
                <th style={styles.tableHeaderQ}>Qty</th>
                <th style={styles.tableHeaderp}>Pr</th>
                <th style={styles.tableHeaderA}>Am</th>
                <th style={styles.tableHeaderAC}>Act</th> {/* Updated Header */}
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td style={styles.tableCell}>{product.barCode}</td>
                  {/* <td style={{ ...styles.tableCell, ...styles.productNameCell }}>{product.name}</td> Apply max width */}
                  <td style={styles.tableCell}>{product.name}</td>
                  <td style={styles.tableCell}>
                    <input
                      type="Text"
                      value={product.billername}
                      onChange={(e) => handleBillernameChange(index, e.target.value)}
                      style={styles.smallInputField}
                    />
                  </td>
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

        {/* Undo Button
        <button onClick={handleUndo} style={styles.undoButton}>
          Undo
        </button> */}

        {/* Save Button */}
        {/* <button onClick={handleOpenModal} style={styles.saveButton}>
          Save
        </button> */}
      </div> {/* Box ends here */}

      {/* Totals Section */}
      <div style={styles.totalsContainer}>
        <div style={styles.totalsText}>
          <p>Subtotal: {products.reduce((acc, product) => acc + product.amount, 0).toFixed(2)}</p>
          <p>Tax:0.00</p>
          <h2>Total: {products.reduce((acc, product) => acc + product.amount, 0).toFixed(2)}</h2>
        </div>
      </div>

      {/* Modal Section */}
      {modalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            {/* Modal content here */}
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
            <button onClick={() => {
        setModalOpen(false);
        setSelectedPaymentMethods({});
        setCustomAmounts({});
        setTotalAmount(0);
        setEditableTotalAmount(0);
}} style={styles.closeButton}>
  Close
</button>





          </div>
        </div>
      )}

<ToastContainer containerId="Billing" position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
<ToastContainer containerId2="Billing" position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div style={styles.sidebar}>
        {renderSidebarButton('❌', 'Delete')}
        {renderSidebarButton('🔍', 'Search')}
        {renderSidebarButton('🛒', 'Quantity')}
        {renderSidebarButton('➕', 'New sale')}
        {renderSidebarButton('💵', 'Cash', '#4CAF50')}
        {renderSidebarButton('🏦', 'Bank', '#4CAF50')}
        {renderSidebarButton('✓', 'Check', '#4CAF50')}
        {renderSidebarButton('%', 'Discount')}
        {renderSidebarButton('💬', 'Comment')}
        {renderSidebarButton('👤', 'Customer')}
        {renderSidebarButton('💼', 'Cash drawer')}
        {renderSidebarButton('💾', 'Save sale')}
        {renderSidebarButton('↩️', 'Refund','',handleRefundClick)}
        {renderSidebarButton('💳', 'Payment', '#4CAF50',handleOpenModal)}
        {renderSidebarButton('🔒', 'Lock')}
        {renderSidebarButton('🔄', 'Transfer')}
        {renderSidebarButton('🗑️', 'Void order', '#f44336',handleUndo)}
        {renderSidebarButton('⋯', 'More')}
        {renderSidebarButton('📊', 'Dashboard', '', handleDashboardClick)}

      </div>
</div>
   
    
  );
  
};

const styles = {
  container: {
    backgroundColor: "white",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "100%", // Ensure the container takes full width of the screen
    
  },
  
  totalsContainer: {
    backgroundColor: "white",
    padding: '10px', // Adjust padding as needed
    border: "1px solid #ddd", // Remove border if it's unwanted
    borderRadius: "8px",
    width:"630px",
    height:"120px",
    margin: "-398px -11px -17px 699px",
  },
  totalsText: {
    textAlign: 'right', // Align text to the left
    fontSize: '16px',
    width: '100%' // Ensure it takes full width of container
  },
  slipModalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // Ensures modal appears on top
  },
  slipModalContent: {
    width: '350px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
  },
  modalHeader: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  shopDetails: {
    fontSize: '12px',
    marginBottom: '20px',
    lineHeight: '1.5',
    textAlign: 'center', // Center shop details text
  },
  shopName: {
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '5px',
  },
  slipTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '15px',
  },
  slipTableHeader: {
    fontSize: '12px',
    fontWeight: 'bold',
    paddingBottom: '10px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left', // Aligns headers like 'Description' properly
  },
  slipTableCell: {
    fontSize: '12px',
    padding: '8px 5px',
    textAlign: 'right',
  },
  slipTotalContainer: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: '15px',
    textAlign: 'right',
  },
  slipTotalAmount: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center',
  },
  thankYouMessage: {
    fontSize: '12px',
    marginBottom: '10px',
  },
  barcode: {
    marginBottom: '15px',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  optionButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  closeButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  sidebar: {

    borderRadius: "8px",
    border: "1px solid #ddd", // Remove border if it's unwanted
    width: '200px',
    padding: '10px',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    marginLeft:"700px",
    display: 'grid',
    marginTop: "-819px",
    width:"629px",
    gridTemplateColumns: 'repeat(4, 1fr)', // 3 items per row
    gap: '10px', // Adjust spacing between buttons as needed
    padding: '10px', // Optional: add padding around the grid
    marginTop: "-442px",
  },
  searchBar:{
    padding: '10px 10px 10px 40px', // Add padding to the left for the icon
    borderRadius: '5px',
    border: '1px solid #ccc',
    textAlign: 'center', // This will center the placeholder
    fontSize: '16px',
    marginRight: "-70px",
    backgroundColor: "rgb(255 255 255 / 20%)",
    width:"645px",
    height: "52px",
    marginTop: "-7px",
    borderRadius: "8px",
  },
  
  searchBarContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
    fontSize: '20px',
    color: '#aaa',
  },
  optionButton:{
    backgroundColor: 'red', // Changed to red background
    color: 'white', // White text
    border: 'none', // No border
    padding: '10px 20px', // Button padding
    textAlign: 'center', // Center text
    textDecoration: 'none', // No underline
    display: 'inline-block', // Inline block
    fontSize: '16px', // Font size
    margin: '10px 2px', // Margin around button
    cursor: 'pointer', // Pointer cursor on hover
    borderRadius: '4px', // Rounded corners
    transition: 'background-color 0.3s ease', // Smooth hover effect
  },
     sidebarButton: {
    width: '100%',
    padding: '10px',
    margin: '5px 0',
    border: '4px solid #ddd', // Add a border to each button
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    border: '1px solid #ddd', // Add a border to each button
    padding: '10px',
    margin: '5px 0',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  sidebarIcon: {
    marginRight: '10px',
    width: '20px',
    height: '20px',
  },
  box: {
    border: "1px solid #ddd", // Adds a border around the section
    padding: "20px",
    borderRadius: "8px",
    width:"700px",
    height:"547px",
    marginBottom: "172px", // Adds spacing between the box and the totals section
  },
  productContainer: {
    marginBottom: "20px",
    width: "50%", // Set the table container to cover half of the screen width
  },
  table: {
     marginLeft:"-20px",
    width: "212.5%", // Ensure the table takes up the entire width of the productContainer
    borderCollapse: "collapse",
    tableLayout: "fixed", // Fixes table layout to control column width
    border: "1px solid #ddd", // Uniform border for the entire table
   
  },
  tableHeaderAC:{ 
    backgroundColor: "#4CAF50", // Green background for the header
    color: "#fff", // White text for the header
    borderBottom: "2px solid #ddd", // Border at the bottom
    padding: "0px", // Add padding for spacing
    textAlign: "center", // Center align the header text
    fontWeight: "bold", // Make the text bold
    fontSize: "16px", // Adjust the font size for better readability
    textTransform: "uppercase", // Make the header text uppercase for emphasis
    letterSpacing: "1px", // Adds spacing between the letters for better readability
    border: "1px solid #ddd", // Adds border to the header cells
    width:"37px"},
  tableHeaderp:{ 
    backgroundColor: "#4CAF50", // Green background for the header
    color: "#fff", // White text for the header
    borderBottom: "2px solid #ddd", // Border at the bottom
    padding: "0px", // Add padding for spacing
    textAlign: "center", // Center align the header text
    fontWeight: "bold", // Make the text bold
    fontSize: "16px", // Adjust the font size for better readability
    textTransform: "uppercase", // Make the header text uppercase for emphasis
    letterSpacing: "1px", // Adds spacing between the letters for better readability
    border: "1px solid #ddd", // Adds border to the header cells
    width:"37px"},
    tableHeaderA:{ 
      backgroundColor: "#4CAF50", // Green background for the header
      color: "#fff", // White text for the header
      borderBottom: "2px solid #ddd", // Border at the bottom
      padding: "0px", // Add padding for spacing
      textAlign: "center", // Center align the header text
      fontWeight: "bold", // Make the text bold
      fontSize: "16px", // Adjust the font size for better readability
      textTransform: "uppercase", // Make the header text uppercase for emphasis
      letterSpacing: "1px", // Adds spacing between the letters for better readability
      border: "1px solid #ddd", // Adds border to the header cells
      width:"37px"},
  tableHeaderQ:{ 
    backgroundColor: "#4CAF50", // Green background for the header
    color: "#fff", // White text for the header
    borderBottom: "2px solid #ddd", // Border at the bottom
    padding: "0px", // Add padding for spacing
    textAlign: "center", // Center align the header text
    fontWeight: "bold", // Make the text bold
    fontSize: "16px", // Adjust the font size for better readability
    textTransform: "uppercase", // Make the header text uppercase for emphasis
    letterSpacing: "1px", // Adds spacing between the letters for better readability
    border: "1px solid #ddd", // Adds border to the header cells
    width:"37px"},
  tableHeaderB: {
    backgroundColor: "#4CAF50", // Green background for the header
    color: "#fff", // White text for the header
    borderBottom: "2px solid #ddd", // Border at the bottom
    padding: "0px", // Add padding for spacing
    textAlign: "center", // Center align the header text
    fontWeight: "bold", // Make the text bold
    fontSize: "16px", // Adjust the font size for better readability
    textTransform: "uppercase", // Make the header text uppercase for emphasis
    letterSpacing: "1px", // Adds spacing between the letters for better readability
    border: "1px solid #ddd", // Adds border to the header cells
    width:"38px"
  },
  tableHeaders: {
    backgroundColor: "#4CAF50", // Green background for the header
    color: "#fff", // White text for the header
    borderBottom: "2px solid #ddd", // Border at the bottom
    padding: "0px", // Add padding for spacing
    textAlign: "center", // Center align the header text
    fontWeight: "bold", // Make the text bold
    fontSize: "16px", // Adjust the font size for better readability
    textTransform: "uppercase", // Make the header text uppercase for emphasis
    letterSpacing: "1px", // Adds spacing between the letters for better readability
    border: "1px solid #ddd", // Adds border to the header cells
    width:"38px"
  },
  tableHeader: {
    backgroundColor: "#4CAF50", // Green background for the header
    color: "#fff", // White text for the header
    borderBottom: "2px solid #ddd", // Border at the bottom
    padding: "0px", // Add padding for spacing
    textAlign: "center", // Center align the header text
    fontWeight: "bold", // Make the text bold
    fontSize: "16px", // Adjust the font size for better readability
    textTransform: "uppercase", // Make the header text uppercase for emphasis
    letterSpacing: "1px", // Adds spacing between the letters for better readability
    border: "1px solid #ddd", // Adds border to the header cells
    width:"92px"
  },
  tableCell: {
    padding: '8px',
    borderBottom: '1px solid rgb(221, 221, 221)',
    textAlign: 'center',
    fontSize: '14px',
    color: 'rgb(51, 51, 51)',
    backgroundColor: 'rgb(249, 249, 249)',
    whiteSpace: 'normal',  // Allows the text to wrap onto the next line
    textOverflow: 'inherit',
    overflowWrap: 'break-word',  // Breaks long words and wraps them
    wordWrap: 'break-word',      // Ensures word wrapping in older browsers
  },
  productNameCell: {
   maxWidth: "150px", // Set a max width for product name
    whiteSpace: "nowrap", // Prevent wrapping
    overflow: "hidden", // Hide overflow content
    textOverflow: "ellipsis", // Add ellipsis (...) for overflowing text
    display: "block", // Ensures it acts like a block-level element for proper sizing
},

  smallInputField: {
    width: "60px", // Adjust the width of the input fields
    padding: "3px",
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
    marginBottom: "15px", // Increased margin for better spacing
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // To spread elements evenly
    padding: "10px", // Adds padding for some breathing room
    backgroundColor: "#f9f9f9", // Light background for a clean look
    borderRadius: "8px", // Rounded corners for a modern feel
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
    fontSize: "16px", // Adjust font size for readability
    color: "#333", // Darker text color for better contrast
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
