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

const Expense = () => {
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingAmount, setEditingAmount] = useState(0);
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("https://localhost:7171/api/Expense/GetExpense");
      const fetchedData = response.data || [];
      setRows(formatRows(fetchedData));
    } catch (error) {
      console.error("Error fetching expenses data:", error);
      toast.error("Failed to fetch expenses data.");
    }
  };

  const formatRows = (data) => {
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      amount: item.amount.toFixed(2),
      action: (
        <>
          <IconButton onClick={() => handleEditClick(item.id, item.name, item.amount)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(item.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    }));
  };

  const handleEditClick = (id, currentName, currentAmount) => {
    setEditingId(id);
    setEditingName(currentName);
    setEditingAmount(currentAmount);
    setIsEditModalOpen(true);
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`https://localhost:7171/api/Expense/UpdatExpense?id=${editingId}`, {
        id: editingId,
        name: editingName,
        amount: editingAmount
      });
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === editingId ? { ...row, name: editingName, amount: editingAmount.toFixed(2) } : row
        )
      );
      setEditingId(null);
      setEditingName("");
      setEditingAmount(0);
      setIsEditModalOpen(false);
      toast.success("Expense updated successfully!");
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Failed to update expense.");
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`https://localhost:7171/api/Expense/DeleteExpense?id=${id}`);
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      toast.success("Expense deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense.");
    }
  };

  const handleAddExpense = async (event) => {
    event.preventDefault();
    try {
      await axios.post('https://localhost:7171/api/Expense/AddExpense', {
        name: newExpenseName,
        amount: newExpenseAmount
      });
      toast.success("Expense added successfully!");
      setNewExpenseName("");
      setNewExpenseAmount(0);
      fetchExpenses();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense.");
    }
  };

  const toggleAddModal = () => setIsAddModalOpen(!isAddModalOpen);

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
    if (isEditModalOpen) {
      setEditingId(null);
    }
  };

  const handleSearch = (event) => setSearchTerm(event.target.value);

  const filteredRows = rows.filter(row =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formattedRows = filteredRows.map((row) => ({
    ...row,
    expenseName: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDBox ml={2} lineHeight={1}>
          {row.id === editingId ? (
            <MDInput
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              fullWidth
            />
          ) : (
            <MDTypography display="block" variant="button" fontWeight="medium">
              {row.name}
            </MDTypography>
          )}
        </MDBox>
      </MDBox>
    ),
    expenseAmount: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDBox ml={2} lineHeight={1}>
          {row.id === editingId ? (
            <MDInput
              type="number"
              value={editingAmount}
              onChange={(e) => setEditingAmount(parseFloat(e.target.value))}
              fullWidth
            />
          ) : (
            <MDTypography display="block" variant="button" fontWeight="medium">
              {row.amount}
            </MDTypography>
          )}
        </MDBox>
      </MDBox>
    ),
    action: row.id === editingId ? (
      <IconButton onClick={handleSaveClick}>
        <SaveIcon />
      </IconButton>
    ) : (
      row.action
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <MDTypography variant="h6" color="white">Expenses</MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <MDInput
                  type="text"
                  placeholder="Search Expense"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '20px' }}
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <button
                  onClick={toggleAddModal}
                  style={{ padding: '10px 20px', backgroundColor: '#344767', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '16px', marginBottom: '20px' }}
                >
                  Add New
                </button>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Name", accessor: "expenseName", align: "left" },
                      { Header: "Amount", accessor: "expenseAmount", align: "center" },
                      { Header: "Action", accessor: "action", align: "center" }
                    ],
                    rows: formattedRows
                  }}
                />
              </MDBox>
              {isAddModalOpen && (
                <div
                  style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <div
                    style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '400px' }}
                  >
                    <h2>Add New Expense</h2>
                    <form onSubmit={handleAddExpense}>
                      <MDInput
                        type="text"
                        placeholder="Expense Name"
                        value={newExpenseName}
                        onChange={(e) => setNewExpenseName(e.target.value)}
                        fullWidth
                      />
                      <MDInput
                        type="number"
                        placeholder="Amount"
                        value={newExpenseAmount}
                        onChange={(e) => setNewExpenseAmount(parseFloat(e.target.value))}
                        fullWidth
                      />
                      <button
                        type="submit"
                        style={{ padding: '10px 20px', backgroundColor: '#344767', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '16px', marginTop: '10px' }}
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={toggleAddModal}
                        style={{ padding: '10px 20px', backgroundColor: '#d9534f', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '16px', marginTop: '10px', marginLeft: '10px' }}
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                </div>
              )}
              {isEditModalOpen && (
                <div
                  style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <div
                    style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '400px' }}
                  >
                    <h2>Edit Expense</h2>
                    <form>
                      <MDInput
                        type="text"
                        placeholder="Expense Name"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        fullWidth
                      />
                      <MDInput
                        type="number"
                        placeholder="Amount"
                        value={editingAmount}
                        onChange={(e) => setEditingAmount(parseFloat(e.target.value))}
                        fullWidth
                      />
                      <button
                        type="button"
                        onClick={handleSaveClick}
                        style={{ padding: '10px 20px', backgroundColor: '#344767', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '16px', marginTop: '10px' }}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={toggleEditModal}
                        style={{ padding: '10px 20px', backgroundColor: '#d9534f', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '16px', marginTop: '10px', marginLeft: '10px' }}
                      >
                        Cancel
                      </button>
                    </form>
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

export default Expense;
