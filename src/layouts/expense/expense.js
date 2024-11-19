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
import Select from 'react-select';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetExpense, AddExpense, UpdateExpense, DeleteExpense } from "layouts/Api";
import { GetOutlets } from "layouts/Api"; // Adjust path if necessary

// Modal Component for Add/Edit Expense
const ExpenseModal = ({ isOpen, onClose, onSubmit, expenseData, setExpenseData, title, outlets }) => {
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <h2>{title}</h2>
        <form onSubmit={onSubmit}>
          <MDInput
            type="text"
            name="name"
            placeholder="Expense Name"
            value={expenseData.name || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <MDInput
            type="number"
            name="amount"
            placeholder="Amount"
            value={expenseData.amount || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <MDInput
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={expenseData.startDate || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <MDInput
            type="date"
            name="endDate"
            placeholder="End Date"
            value={expenseData.endDate || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <Select
            options={outlets}
            placeholder="Select Outlet"
            value={outlets.find((outlet) => outlet.value === expenseData.outletId)}
            onChange={(option) => setExpenseData((prev) => ({ ...prev, outletId: option.value }))}
          />
          <div style={buttonGroupStyle}>
            <button type="submit" style={saveButtonStyle}>
              {title === "Edit Expense" ? "Save" : "Add"}
            </button>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Expense Component
const Expense = () => {
  const [rows, setRows] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: 0,
    startDate: "",
    endDate: "",
    outletId: null,
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchExpenses();
    fetchOutlets();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(GetExpense, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const fetchedData = response.data || [];
      setRows(formatRows(fetchedData));
    } catch (error) {
      console.error("Error fetching expenses data:", error);
      toast.error("Failed to fetch expenses data.", { containerId: "expenses" });
    }
  };

  const fetchOutlets = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("https://localhost:7171/api/OutLets/GetOutLets", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const mappedOutlets = response.data.map(outlet => ({
        value: outlet.id,
        label: outlet.outlet_Name
      }));
      setOutlets(mappedOutlets);
    } catch (error) {
      console.error("Error fetching outlet data:", error);
      toast.error("Failed to fetch outlets.");
    }
  };

  const formatRows = (data) => {
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      amount: typeof item.amount === "number" ? item.amount.toFixed(2) : item.amount,
      startDate: item.startDate ? item.startDate.substring(0, 10) : "",
      endDate: item.endDate ? item.endDate.substring(0, 10) : "",
      outlet: outlets.find(outlet => outlet.value === item.outletId)?.label || "N/A",
      action: (
        <>
          <IconButton onClick={() => handleEditClick(item)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(item.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    }));
  };

  const handleEditClick = (item) => {
    const formattedItem = {
      ...item,
      startDate: item.startDate ? new Date(item.startDate).toLocaleDateString("en-CA") : "",
      endDate: item.endDate ? new Date(item.endDate).toLocaleDateString("en-CA") : "",
      outletId: item.outletId || null,
    };
    setEditingExpense(formattedItem);
    setIsEditModalOpen(true);
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    const updatedExpense = {
      ...editingExpense,
      amount: parseFloat(editingExpense.amount) || 0,
    };

    try {
      await axios.put(`${UpdateExpense}?id=${updatedExpense.id}`, updatedExpense);
      fetchExpenses();
      setIsEditModalOpen(false);
      toast.success("Expense updated successfully!", { autoClose: 2000, containerId: "expenses" });
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Failed to update expense.", { autoClose: 2000, containerId: "expenses" });
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`${DeleteExpense}?Id=${id}`);
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      toast.success("Expense deleted successfully!", { autoClose: 2000, containerId: "expenses" });
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense.", { autoClose: 2000, containerId: "expenses" });
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await axios.post(AddExpense, newExpense);
      toast.success("Expense added successfully!", { autoClose: 2000, containerId: "expenses" });
      fetchExpenses();
      setNewExpense({ name: "", amount: 0, startDate: "", endDate: "", outletId: null });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense.", { autoClose: 2000, containerId: "expenses" });
    }
  };

  const handleSearch = (event) => setSearchTerm(event.target.value);

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <MDTypography variant="h6" color="white">
                  Expenses
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <MDInput
                  type="text"
                  placeholder="Search Expense"
                  style={searchStyle}
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <button onClick={() => setIsAddModalOpen(true)} style={addButtonStyle}>
                  Add New
                </button>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Name", accessor: "name", align: "left" },
                      { Header: "Amount", accessor: "amount", align: "center" },
                      { Header: "Start Date", accessor: "startDate", align: "center" },
                      { Header: "End Date", accessor: "endDate", align: "center" },
                      { Header: "Outlet", accessor: "outlet", align: "center" }, // New Outlet column
                      { Header: "Actions", accessor: "action", align: "center" },
                    ],
                    rows: filteredRows,
                  }}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      {/* Add Modal */}
      <ExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddExpense}
        expenseData={newExpense}
        setExpenseData={setNewExpense}
        title="Add Expense"
        outlets={outlets}
      />
      {/* Edit Modal */}
      <ExpenseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSaveClick}
        expenseData={editingExpense}
        setExpenseData={setEditingExpense}
        title="Edit Expense"
        outlets={outlets}
      />
      {/* Toast Containers */}
      <ToastContainer containerId="expenses" position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </DashboardLayout>
  );
};

// Styling
const searchStyle = { width: "20%", marginBottom: "10px" };
const addButtonStyle = { marginLeft: "20px", backgroundColor: "green", color: "white", borderRadius: "5px", padding: "10px" };
const modalOverlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" };
const modalStyle = { backgroundColor: "white", padding: "20px", borderRadius: "10px", width: "400px" };
const buttonGroupStyle = { display: "flex", justifyContent: "space-between", marginTop: "20px" };
const saveButtonStyle = { backgroundColor: "green", color: "white", border: "none", padding: "10px", borderRadius: "5px" };
const cancelButtonStyle = { backgroundColor: "red", color: "white", border: "none", padding: "10px", borderRadius: "5px" };

export default Expense;
