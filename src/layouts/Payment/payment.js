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
  const [isQuickPayment, setIsQuickPayment] = useState(false);
  const [printRecipt, setPrintRecipt] = useState(false);
  const [isMarkTransationAsPaid, setIsMarkTransationAsPaid] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get("https://localhost:7171/api/Payment/GetPayment");
      const fetchedData = response.data || [];
      setRows(formatRows(fetchedData));
    } catch (error) {
      console.error("Error fetching payment data:", error);
      toast.error("Failed to fetch payment data.");
    }
  };

  const formatRows = (data) => {
    return data.map((item) => ({
      id: item.id,
      paymentName: item.name,
      isEnable: item.isEnable,
      isQuickPayment: item.isQuickPayment,
      printRecipt: item.printRecipt,
      isMarkTransationAsPaid: item.isMarkTransationAsPaid,
      action: (
        <>
          <IconButton onClick={() => handleEditClick(item.id, item.name, item.isEnable, item.isQuickPayment, item.printRecipt, item.isMarkTransationAsPaid)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(item.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    }));
  };

  const handleEditClick = (id, currentName, enable, quickPayment, receipt, markPaid) => {
    setEditingId(id);
    setEditingName(currentName);
    setIsEnable(enable);
    setIsQuickPayment(quickPayment);
    setPrintRecipt(receipt);
    setIsMarkTransationAsPaid(markPaid);
    setIsEditModalOpen(true);
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`https://localhost:7171/api/Payment/UpdatePayment?id=${editingId}`, {
        id: editingId,
        name: editingName,
        isEnable,
        isQuickPayment,
        printRecipt,
        isMarkTransationAsPaid
      });
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === editingId ? { ...row, paymentName: editingName, isEnable, isQuickPayment, printRecipt, isMarkTransationAsPaid } : row
        )
      );
      setEditingId(null);
      setEditingName("");
      setIsEditModalOpen(false);
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
      await axios.post('https://localhost:7171/api/Payment/AddPayment', {
        name: paymentName,
        isEnable,
        isQuickPayment,
        printRecipt,
        isMarkTransationAsPaid
      });
      toast.success("Payment added successfully!");
      setPaymentName("");
      setIsEnable(false);
      setIsQuickPayment(false);
      setPrintRecipt(false);
      setIsMarkTransationAsPaid(false);
      fetchPayments();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding payment:", error);
      toast.error("Failed to add payment.");
    }
  };

  const toggleAddModal = () => {
    setIsAddModalOpen(!isAddModalOpen);
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
                <button onClick={toggleAddModal} style={{ padding: '10px 20px', backgroundColor: '#344767', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '16px', marginBottom: '20px' }}>
                  Add New
                </button>
                <DataTable table={{
                  columns: [
                    { Header: "Payment", accessor: "paymentName", align: "center" },
                    { Header: "Is Enabled", accessor: "isEnable", Cell: ({ value }) => <Toggle checked={value} onChange={() => {}} /> , align: "center" },
                    { Header: "Is Quick Payment", accessor: "isQuickPayment", Cell: ({ value }) => <Toggle checked={value} onChange={() => {}} /> , align: "center" },
                    { Header: "Print Receipt", accessor: "printRecipt", Cell: ({ value }) => <Toggle checked={value} onChange={() => {}} /> , align: "center" },
                    { Header: "Mark Transaction as Paid", accessor: "isMarkTransationAsPaid", Cell: ({ value }) => <Toggle checked={value} onChange={() => {}} /> , align: "center" },
                    { Header: "Action", accessor: "action", align: "center" }
                  ],
                  rows: filteredRows
                }} />
              </MDBox>
              {isAddModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={toggleAddModal}>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '400px', maxWidth: '90%' }} onClick={(e) => e.stopPropagation()}>
                    <h3>Add Payment</h3>
                    <MDInput
                      label="Payment Name"
                      fullWidth
                      value={paymentName}
                      onChange={(e) => setPaymentName(e.target.value)}
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
                      <Toggle checked={printRecipt} onChange={() => setPrintRecipt(!printRecipt)} />
                    </div>
                    <div style={{ margin: '10px 0' }}>
                      <label>Mark Transaction as Paid</label>
                      <Toggle checked={isMarkTransationAsPaid} onChange={() => setIsMarkTransationAsPaid(!isMarkTransationAsPaid)} />
                    </div>
                    <button onClick={handleAddPayment} style={{ padding: '10px 20px', backgroundColor: '#344767', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '16px' }}>
                      Add Payment
                    </button>
                    <button onClick={toggleAddModal} style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '16px', marginLeft: '10px' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {isEditModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={toggleEditModal}>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '400px', maxWidth: '90%' }} onClick={(e) => e.stopPropagation()}>
                    <h3>Edit Payment</h3>
                    <MDInput
                      label="Payment Name"
                      fullWidth
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
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
                      <Toggle checked={printRecipt} onChange={() => setPrintRecipt(!printRecipt)} />
                    </div>
                    <div style={{ margin: '10px 0' }}>
                      <label>Mark Transaction as Paid</label>
                      <Toggle checked={isMarkTransationAsPaid} onChange={() => setIsMarkTransationAsPaid(!isMarkTransationAsPaid)} />
                    </div>
                    <button onClick={handleSaveClick} style={{ padding: '10px 20px', backgroundColor: '#344767', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '16px' }}>
                      Save Changes
                    </button>
                    <button onClick={toggleEditModal} style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '16px', marginLeft: '10px' }}>
                      Cancel
                    </button>
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
