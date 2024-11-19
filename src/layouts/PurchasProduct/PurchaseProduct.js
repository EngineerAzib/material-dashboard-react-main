import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PurchaseOrder = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [suppliers, setSuppliers] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false });

  const [newOrder, setNewOrder] = useState({
    oderGiveDate: "",
    oderReceiveDate: "",
    orderStatus: true,
    paymentStatus: true,
    unitPrice: "",
    totalPrice: "",
    orderQuantity: "",
    receiveQuantity: "",
    totalPayment: "",
    paidPayment: "",
    productId: "",
    suplierId: "",
    outlet: "",
  });

  useEffect(() => {
    fetchInitialData();
    fetchOutlets();
  }, []);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("User is not authenticated");

      const headers = { Authorization: `Bearer ${token}` };
      const [suppliersResponse, productsResponse, ordersResponse] = await Promise.all([
        axios.get("https://localhost:7171/api/Supplier/GetSupplier", { headers }),
        axios.get("https://localhost:7171/GetProduct", { headers }),
        axios.get("https://localhost:7171/api/Purchaseorder/GetPurchaseOrde", { headers }),
      ]);

      setSuppliers(suppliersResponse.data || []);
      setProducts(productsResponse.data || []);
      setPurchaseOrders(formatOrderData(ordersResponse.data || []));
    } catch (error) {
      toast.error("Failed to fetch data.");
    }
  };

  const fetchOutlets = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("User is not authenticated");

      const response = await axios.get("https://localhost:7171/api/OutLets/GetOutLets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOutlets(
        response.data.map((outlet) => ({
          value: outlet.id,
          label: outlet.outlet_Name,
        }))
      );
    } catch (error) {
      toast.error("Failed to fetch outlets.");
    }
  };
  const formatOrderData = (orders) => {
    return orders.map((order) => {
        // const formattedGiveDate = new Date(order.oderGiveDate).toLocaleDateString();
        // const formattedReceiveDate = new Date(order.oderReceiveDate).toLocaleDateString();
        const formattedGiveDate =  new Date(order.oderGiveDate).toISOString().split('T')[0];
        const formattedReceiveDate = new Date(order.oderReceiveDate).toISOString().split('T')[0];
      return {
        id: order.id,
        oderGiveDate: formattedGiveDate,
        oderReceiveDate: formattedReceiveDate,
        orderStatus: order.orderStatus ? "Completed" : "Pending",
        paymentStatus: order.paymentStatus ? "Paid" : "Unpaid",
        unitPrice: order.unitPrice,
        totalPrice: order.totalPrice,
        orderQuantity: order.orderQuantity,
        receiveQuantity: order.receiveQuantity,
        totalPayment: order.totalPayment,
        paidPayment: order.paidPayment,
        
        product: order.productName,
       supplier: order.supplierName,
        outlet: order.outlet_Name,
        actions: (
          <>
            <IconButton onClick={() => handleEditClick(order)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteOrder(order.id)}>
              <DeleteIcon />
            </IconButton>
          </>
        ),
      };
    });
  };
  const handleEditClick = (order) => {
    console.log("Order being edited:", order); // Log to check field names
    setEditingOrder(order);
    setNewOrder({
      
      // oderGiveDate:new Date(order.oderGiveDate).toLocaleDateString(),
      
      // oderReceiveDate:new Date(order.oderReceiveDate).toLocaleDateString(),
      oderGiveDate: new Date(order.oderGiveDate).toISOString().split('T')[0],
      oderReceiveDate: new Date(order.oderReceiveDate).toISOString().split('T')[0],
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      unitPrice: order.unitPrice,
      totalPrice: order.totalPrice,
      orderQuantity: order.orderQuantity,
      receiveQuantity: order.receiveQuantity,
      totalPayment: order.totalPayment,
      paidPayment: order.paidPayment,
      productId: order.productId,
      suplierId: order.suplierId,
      outlet: order.outlet_Id || order.Outlet_Id,
    });
    setIsModalOpen({ ...isModalOpen, edit: true });
  };
  
  
  const handleOrderSubmit = async (event, isEdit) => {
    event.preventDefault();
    try {
      const orderData = {
        ...newOrder,
        Outlet_Id: newOrder.outlet, // Ensure `outlet` is included in the payload
      };
  
      if (isEdit) {
        await axios.put(
          `https://localhost:7171/api/Purchaseorder/UpdatePurchaseOrde?id=${editingOrder.id}`,
          orderData
        );
        toast.success("Order updated successfully!");
        fetchInitialData();
        // Update the local `purchaseOrders` state with the edited data
        setPurchaseOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === editingOrder.id
              ? {
                  ...order,
                  orderGiveDate: newOrder.orderGiveDate,
                  orderReceiveDate: newOrder.orderReceiveDate,
                  orderStatus: newOrder.orderStatus,
                  paymentStatus: newOrder.paymentStatus,
                  unitPrice: newOrder.unitPrice,
                  totalPrice: newOrder.totalPrice,
                  orderQuantity: newOrder.orderQuantity,
                  receiveQuantity: newOrder.receiveQuantity,
                  totalPayment: newOrder.totalPayment,
                  paidPayment: newOrder.paidPayment,
                  productId: newOrder.productId,
                  supplierId: newOrder.supplierId,
                  outlet: newOrder.outlet, // Update outlet in the order
                }
              : order
          )
        );
      } else {
        await axios.post(
          "https://localhost:7171/api/Purchaseorder/AddPurchaseOrde",
          orderData
        );
        toast.success("Order added successfully!");
      }
  
      fetchInitialData();
      closeModal();
    } catch (error) {
      console.error("Error updating/adding order:", error);
      toast.error(isEdit ? "Failed to update order." : "Failed to add order.");
    }
  };
  
  // Helper function to close the modal and reset form fields
  const closeModal = () => {
    setIsModalOpen({ add: false, edit: false });
    setEditingOrder(null);
    setNewOrder({
      orderGiveDate: "",
      orderReceiveDate: "",
      orderStatus: true,
      paymentStatus: true,
      unitPrice: "",
      totalPrice: "",
      orderQuantity: "",
      receiveQuantity: "",
      totalPayment: "",
      paidPayment: "",
      productId: "",
      supplierId: "",
      outlet: "",
    });
  };
  
  

  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(
        `https://localhost:7171/api/Purchaseorder/DeletePurchaseOrde?id=${id}`
      );
      setPurchaseOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== id)
      );
      toast.success("Order deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete order.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If the input field is a number field, ensure it's not less than 0
    if (name === "unitPrice" || name === "totalPrice" || name === "orderQuantity" || name === "receiveQuantity" || name === "totalPayment" || name === "paidPayment") {
      if (value === "" || parseFloat(value) >= 0) {
        setNewOrder((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setNewOrder((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // const closeModal = () => {
  //   setIsModalOpen({ add: false, edit: false });
  //   setEditingOrder(null);
  //   setNewOrder({
  //     oderGiveDate: "",
  //     oderReceiveDate: "",
  //     orderStatus: true,
  //     paymentStatus: true,
  //     unitPrice: 0,
  //     totalPrice: 0,
  //     orderQuantity: 0,
  //     receiveQuantity: 0,
  //     totalPayment: 0,
  //     paidPayment: 0,
  //     productId: "",
  //     suplierId: "",
  //   });
  // };

  // const filteredOrders = purchaseOrders.filter((order) =>
  //   order.product.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const filteredOrders = purchaseOrders.filter((order) =>
    order.product && order.product.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  const columns = [
    { Header: "Order Date", accessor: "oderGiveDate" },
    { Header: "Receive Date", accessor: "oderReceiveDate" },
    { Header: "Product", accessor: "product" },
    { Header: "Supplier", accessor: "supplier" },
    { Header: "Unit Price", accessor: "unitPrice" },
    { Header: "Total Price", accessor: "totalPrice" },
    { Header: "Order Quantity", accessor: "orderQuantity" },
    { Header: "Receive Quantity", accessor: "receiveQuantity" },
    { Header: "Total Payment", accessor: "totalPayment" },
    { Header: "Paid Payment", accessor: "paidPayment" },
    { Header: "Order Status", accessor: "orderStatus" },
    { Header: "Outlet", accessor: "outlet" },
    { Header: "Payment Status", accessor: "paymentStatus" },
    { Header: "Actions", accessor: "actions" },
  ];
  const modalStyles = {
    button: {
      padding: "10px 20px",
      backgroundColor: "#344767",
      color: "white",
      border: "none",
      cursor: "pointer",
      borderRadius: "5px",
      fontSize: "16px",
      marginRight: "10px",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay for background
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 8999, // Ensure it's on top of all other elements
      overflowY: "hidden", // Disable scrolling when modal is open
    },
    modal: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "10px",
      width: "600px", // Increased width to 600px
      maxWidth: "90%", // Max width of 90% for smaller screens
      position: "relative",
      zIndex: 1100, // Higher than the overlay to be safe
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add subtle shadow for depth
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "15px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "24px",
      cursor: "pointer",
      color: "#344767",
    },
    input: {
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      marginBottom: "15px",
      width: "100%", // Ensure all inputs take full width of grid column
      height: "45px", // Equal height for all inputs
    },
    select: {
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      marginBottom: "15px",
      width: "100%", // Full width for selects
      height: "45px", // Consistent height for select fields
    },
    footer: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "20px",
    },
    cancelButton: {
      backgroundColor: "#ccc",
      color: "black",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      padding: "10px 20px",
      fontSize: "16px",
      marginRight: "10px",
    },
  };
  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h6" gutterBottom>
                  Purchase Orders
                </MDTypography>
                <MDBox mb={3} display="flex" justifyContent="space-between">
                  <MDInput
                    type="text"
                    label="Search Orders"
                    onChange={handleSearch}
                    value={searchTerm}
                  />
                  <button
                    style={modalStyles.button}
                    onClick={() => setIsModalOpen({ ...isModalOpen, add: true })}
                  >
                    Add New Order
                  </button>
                </MDBox>
                <DataTable
                  table={{ columns, rows: filteredOrders }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {isModalOpen.add || isModalOpen.edit ? (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <div style={modalStyles.header}>
              <MDTypography variant="h5">
                {isModalOpen.edit ? "Edit Order" : "Add New Order"}
              </MDTypography>
              <button
                style={modalStyles.closeButton}
                onClick={() => closeModal()}
              >
                &times;
              </button>
            </div>
            <form onSubmit={(e) => handleOrderSubmit(e, isModalOpen.edit)}>
              <div style={modalStyles.gridContainer}>
                <MDInput
                  type="date"
                  name="oderGiveDate"
                  value={newOrder.oderGiveDate}
                  onChange={handleInputChange}
                  placeholder="Order Given Date"
                  style={modalStyles.input}
                />
                <MDInput
                  type="date"
                  name="oderReceiveDate"
                  value={newOrder.oderReceiveDate}
                  onChange={handleInputChange}
                  placeholder="Order Receive Date"
                  style={modalStyles.input}
                />
                 {/* Outlet Dropdown */}
                <select
                  name="outlet"
                  value={newOrder.outlet}
                  onChange={handleInputChange}
                  style={modalStyles.select}
                >
                  <option value="">Select Outlet</option>
                  {outlets.map((outlet) => (
                    <option key={outlet.value} value={outlet.value}>
                      {outlet.label}
                    </option>
                  ))}
                </select>
                <select
                  name="productId"
                  value={newOrder.productId}
                  onChange={handleInputChange}
                  style={modalStyles.select}
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <select
                  name="suplierId"
                  value={newOrder.suplierId}
                  onChange={handleInputChange}
                  style={modalStyles.select}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.supplierName}
                    </option>
                  ))}
                </select>
                <MDInput
                  type="number"
                  name="unitPrice"
                  value={newOrder.unitPrice}
                  onChange={handleInputChange}
                  placeholder="Unit Price"
                  style={modalStyles.input}
                  min="0"
                />
                <MDInput
                  type="number"
                  name="totalPrice"
                  value={newOrder.totalPrice}
                  onChange={handleInputChange}
                  placeholder="Total Price"
                  style={modalStyles.input}
                  min="0"
                />
                <MDInput
                  type="number"
                  name="orderQuantity"
                  value={newOrder.orderQuantity}
                  onChange={handleInputChange}
                  placeholder="Order Quantity"
                  style={modalStyles.input}
                  min="0"
                />
                <MDInput
                  type="number"
                  name="receiveQuantity"
                  value={newOrder.receiveQuantity}
                  onChange={handleInputChange}
                  placeholder="Receive Quantity"
                  style={modalStyles.input}
                  min="0"
                />
                <MDInput
                  type="number"
                  name="totalPayment"
                  value={newOrder.totalPayment}
                  onChange={handleInputChange}
                  placeholder="Total Payment"
                  style={modalStyles.input}
                  min="0"
                />
                <MDInput
                  type="number"
                  name="paidPayment"
                  value={newOrder.paidPayment}
                  onChange={handleInputChange}
                  placeholder="Paid Payment"
                  style={modalStyles.input}
                  min="0"
                />
              </div>
              <div style={modalStyles.footer}>
                <button
                  type="button"
                  style={modalStyles.cancelButton}
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" style={modalStyles.button}>
                  {isModalOpen.edit ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
      <ToastContainer />
    </DashboardLayout>
  );
};

export default PurchaseOrder;
