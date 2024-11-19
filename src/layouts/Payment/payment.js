import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import Select from 'react-select';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toggle from 'react-toggle';
import 'react-toggle/style.css'; // Import default styles

const PaymentManagement = () => {
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [paymentName, setPaymentName] = useState("");
  const [isEnable, setIsEnable] = useState(false);
  const [outlets, setOutlets] = useState([]);
  const [isQuickPayment, setIsQuickPayment] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [printrecipt, setPrintRecipt] = useState(false);
  const [isMarkTransationAsPaid, setIsMarkTransationAsPaid] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState(null);
  useEffect(() => {
    fetchPayments();
    fetchOutlets();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("User is not authenticated");
      const response = await axios.get("https://localhost:7171/api/Payment/GetPayment", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const fetchedData = response.data || [];
      
      // Fetch outlets to map outlet IDs to names
      const outletResponse = await axios.get("https://localhost:7171/api/OutLets/GetOutLets", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const outlets = outletResponse.data.reduce((acc, outlet) => {
        acc[outlet.id] = outlet.outlet_Name; // Map outlet ID to outlet name
        return acc;
      }, {});
  
      setRows(formatRows(fetchedData, outlets)); // Pass the outlet mapping to formatRows
    } catch (error) {
      console.error("Error fetching payment data:", error);
      toast.error("Failed to fetch payment data.");
    }
  };
  
  const fetchOutlets = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("User is not authenticated");

      const response = await axios.get("https://localhost:7171/api/OutLets/GetOutLets", {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const mappedOutlets = response.data.map(outlet => ({
        value: outlet.id,
        label: outlet.outlet_Name
      }));
      console.log(mappedOutlets,"a")
      setOutlets(mappedOutlets);
    } catch (error) {
      console.error("Error fetching outlet data:", error);
      toast.error("Failed to fetch outlets.");
    }
  };

  const formatRows = (data, outlets) => {
    return data.map((item) => ({
      id: item.id,
      paymentName: item.name,
      isEnable: item.isEnable,
      isQuickPayment: item.isQuickPayment,
      printrecipt: item.printrecipt,
      isMarkTransationAsPaid: item.isMarkTransationAsPaid,
      outlet: outlets[item.outletId] || 'Unknown', // Use mapped outlet name
      action: (
        <>
        <IconButton onClick={() => handleEditClick(
          item.id, 
          item.name, 
          item.isEnable, 
          item.isQuickPayment, 
          item.printrecipt, 
          item.isMarkTransationAsPaid, 
          item.outletId, // Pass outletId
          outlets[item.outletId] // Pass outletName from the outlets mapping
        )}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDeleteClick(item.id)}>
          <DeleteIcon />
        </IconButton>
      </>
      ),
    }));
  };
  

  const handleEditClick = (id, currentName, enable, quickPayment, receipt, markPaid,outletId,outletName) => {
    setEditingId(id);
    setEditingName(currentName);
    setIsEnable(enable);
    setIsQuickPayment(quickPayment);
    setPrintRecipt(receipt);
    setIsMarkTransationAsPaid(markPaid);
    setIsEditModalOpen(true);
    setEditingOutlet({ value: outletId, label: outletName });
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`https://localhost:7171/api/Payment/UpdatePayment?id=${editingId}`, {
        id: editingId,
        name: editingName,
        isEnable,
        isQuickPayment,
        printrecipt,
        isMarkTransationAsPaid,
        outletId: editingOutlet.value,
      });
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === editingId ? { ...row, paymentName: editingName, isEnable, isQuickPayment, printrecipt, isMarkTransationAsPaid, outlet: editingOutlet.label } : row
        )
      );
      setEditingId(null);
      setEditingName("");
      setIsEditModalOpen(false);
      setEditingOutlet(null);
      toast.success("Payment updated successfully!");
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("Failed to update payment.");
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`https://localhost:7171/api/Payment/DeletePayment?id=${id}`);
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      toast.success("Payment deleted successfully!");
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast.error("Failed to delete payment.");
    }
  };

  const handleAddPayment = async (event) => {
    event.preventDefault();
    try {
      const outletId = selectedOutlet ? selectedOutlet.value : null; // Ensure outletId is assigned correctly
      await axios.post('https://localhost:7171/api/Payment/AddPayment', {
        name: paymentName,
        isEnable,
        isQuickPayment,
        printrecipt,
        isMarkTransationAsPaid, // Add the missing comma here
        outletId, // Ensure this is included correctly
      });
      
      toast.success("Payment added successfully!");
      
      // Reset state after successful addition
      setPaymentName("");
      setIsEnable(false);
      setIsQuickPayment(false);
      setSelectedOutlet(null);
      setPrintRecipt(false);
      setIsMarkTransationAsPaid(false);
      
      // Fetch updated payments list
      fetchPayments();
      
      // Close the modal
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding payment:", error);
      toast.error("Failed to add payment.");
    }
  };
  
  const toggleAddModal = () => {
    setIsAddModalOpen(!isAddModalOpen);
  };
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
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 8999,
      overflowY: "hidden",
    },
    modal: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "10px",
      width: "600px",
      maxWidth: "90%",
      position: "relative",
      zIndex: 1100,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    input: {
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      marginBottom: "15px",
      width: "100%",
      height: "45px",
    },
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = rows.filter(row => 
    row.paymentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <MDTypography variant="h6" color="white">Payment Management</MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <MDInput
                  type="text"
                  placeholder="Search Payments"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '20px' }}
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <button onClick={toggleAddModal} style={modalStyles.button}>
                  Add New
                </button>
                <DataTable table={{
                  columns: [
                    { Header: "Payment", accessor: "paymentName", align: "center" },
                    { Header: "Is Enabled", accessor: "isEnable", Cell: ({ value }) => <Toggle checked={value} onChange={() => {}} />, align: "center" },
                    { Header: "Is Quick Payment", accessor: "isQuickPayment", Cell: ({ value }) => <Toggle checked={value} onChange={() => {}} />, align: "center" },
                    { Header: "Print Receipt", accessor: "printrecipt", Cell: ({ value }) => <Toggle checked={value} onChange={() => {}} />, align: "center" },
                    { Header: "Mark Transaction as Paid", accessor: "isMarkTransationAsPaid", Cell: ({ value }) => <Toggle checked={value} onChange={() => {}} />, align: "center" },
                    { Header: "Outlet", accessor: "outlet" },
                    { Header: "Action", accessor: "action", align: "center" },
                    
                  ],
                  rows: filteredRows
                }} />
              </MDBox>

              {isAddModalOpen && (
  <div style={modalStyles.overlay} onClick={toggleAddModal}>
    <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
      <h3>Add Payment</h3>
      <MDInput
        label="Payment Name"
        fullWidth
        value={paymentName}
        onChange={(e) => setPaymentName(e.target.value)}
        style={modalStyles.input}
      />
      <div style={{ margin: '10px 0' }}>
        <label>Is Enabled</label>
        <Toggle checked={isEnable} onChange={() => setIsEnable(!isEnable)} />
      </div>
      <div style={{ margin: '10px 0' }}>
        <label>Is Quick Payment</label>
        <Toggle checked={isQuickPayment} onChange={() => setIsQuickPayment(!isQuickPayment)} />
      </div>
      <div style={{ margin: '10px 0' }}>
        <label>Print Receipt</label>
        <Toggle checked={printrecipt} onChange={() => setPrintRecipt(!printrecipt)} />
      </div>
      <div style={{ margin: '10px 0' }}>
        <label>Mark Transaction as Paid</label>
        <Toggle checked={isMarkTransationAsPaid} onChange={() => setIsMarkTransationAsPaid(!isMarkTransationAsPaid)} />
      </div>
      <Select
        options={outlets}
        value={selectedOutlet}
         onChange={setSelectedOutlet}
        placeholder="Select Outlet"
        styles={{ container: base => ({ ...base, marginBottom: '15px' }) }}
        style={modalStyles.select}
      />
      <div style={modalStyles.footer}>
        <button onClick={handleAddPayment} style={modalStyles.button}>
          Add Payment
        </button>
        <button onClick={toggleAddModal} style={modalStyles.cancelButton}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


{isEditModalOpen && (
  <div style={modalStyles.overlay} onClick={toggleEditModal}>
    <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
      <h3>Edit Payment</h3>
      <MDInput
        label="Payment Name"
        fullWidth
        value={editingName}
        onChange={(e) => setEditingName(e.target.value)}
        style={modalStyles.input} // Applying modal style to input
      />
      <div style={{ margin: '10px 0' }}>
        <label>Is Enabled</label>
        <Toggle checked={isEnable} onChange={() => setIsEnable(!isEnable)} />
      </div>
      <div style={{ margin: '10px 0' }}>
        <label>Is Quick Payment</label>
        <Toggle checked={isQuickPayment} onChange={() => setIsQuickPayment(!isQuickPayment)} />
      </div>
      <div style={{ margin: '10px 0' }}>
        <label>Print Receipt</label>
        <Toggle checked={printrecipt} onChange={() => setPrintRecipt(!printrecipt)} />
      </div>
      <div style={{ margin: '10px 0' }}>
        <label>Mark Transaction as Paid</label>
        <Toggle checked={isMarkTransationAsPaid} onChange={() => setIsMarkTransationAsPaid(!isMarkTransationAsPaid)} />
      </div>
      <Select
        options={outlets}
        value={editingOutlet}
        onChange={setEditingOutlet}
        placeholder="Select Outlet"
        styles={{ container: base => ({ ...base, marginBottom: '15px' }) }}
        style={modalStyles.select}
      />
      <div style={modalStyles.footer}>
        <button onClick={handleSaveClick} style={modalStyles.button}>
          Save Changes
        </button>
        <button onClick={toggleEditModal} style={{ ...modalStyles.button, backgroundColor: 'red' }}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <ToastContainer />
    </DashboardLayout>
  );
};

export default PaymentManagement;
