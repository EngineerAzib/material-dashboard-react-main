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
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

// Modal Component for Add/Edit User Company
const UserCompanyModal = ({ isOpen, onClose, onSubmit, userCompanyData, setUserCompanyData, title }) => {
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {[
          { name: "userName", label: "Username", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "password", label: "Password", type: "password" },
          { name: "companyName", label: "Company Name", type: "text" },
          { name: "ownerName", label: "Owner Name", type: "text" },
          { name: "ownerEmail", label: "Owner Email", type: "email" },
          { name: "ownerPhoneNumber", label: "Owner Phone Number", type: "text" },
        ].map((field) => (
          <TextField
            key={field.name}
            margin="dense"
            name={field.name}
            label={field.label}
            type={field.type}
            fullWidth
            variant="outlined"
            value={userCompanyData[field.name] || ""}
            onChange={handleInputChange}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onSubmit} color="primary">
          {title === "Edit User Company" ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main UserCompany Component
const UserCompany = () => {
  const [rows, setRows] = useState([]);
  const [editingUserCompany, setEditingUserCompany] = useState(null);
  const [newUserCompany, setNewUserCompany] = useState(initialUserCompanyData());
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchUserCompanies();
  }, []);

  // Fetch data
  const fetchUserCompanies = async () => {
    try {
      const response = await axios.get("https://localhost:7171/api/Auth/all");
      setRows(formatRows(response.data || []));
    } catch (error) {
      handleError("Failed to fetch user companies data.");
    }
  };

  const formatRows = (data) => {
    return data.map((item) => ({
      userId: item.userId,
      userName: item.userName,
      email: item.email,
      companyName: item.companyName,
      ownerName: item.ownerName,
      ownerEmail: item.ownerEmail,
      ownerPhoneNumber: item.ownerPhoneNumber,
      action: renderActions(item),
    }));
  };

  // Handle Edit
  const handleEditClick = (item) => {
    setEditingUserCompany(item);
    setIsEditModalOpen(true);
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://localhost:7171/api/Auth/${editingUserCompany.userId}`, editingUserCompany);
      updateRow(editingUserCompany);
      closeEditModal();
      handleSuccess("User Company updated successfully!");
    } catch (error) {
      handleError("Failed to update user company.");
    }
  };

  const updateRow = (updatedItem) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.userId === updatedItem.userId ? { ...row, ...updatedItem } : row))
    );
  };

  // Handle Add
  const handleAddUserCompany = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:7171/api/Auth", newUserCompany);
      setRows((prevRows) => [...prevRows, formatNewRow(response.data)]);
      handleSuccess("User Company added successfully!");
      resetNewUserCompany();
      closeAddModal();
    } catch (error) {
      handleError("Failed to add user company.");
    }
  };

  const formatNewRow = (item) => ({
    userId: item.userId,
    userName: item.userName,
    email: item.email,
    companyName: item.companyName,
    ownerName: item.ownerName,
    ownerEmail: item.ownerEmail,
    ownerPhoneNumber: item.ownerPhoneNumber,
    action: renderActions(item),
  });

  const renderActions = (item) => (
    <>
      <IconButton onClick={() => handleEditClick(item)}>
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => handleDeleteClick(item.userId)}>
        <DeleteIcon />
      </IconButton>
    </>
  );

  // Handle Delete
  const handleDeleteClick = async (userId) => {
    try {
      await axios.delete(`https://localhost:7171/api/Auth/${userId}`);
      removeRow(userId);
      handleSuccess("User Company deleted successfully!");
    } catch (error) {
      handleError("Failed to delete user company.");
    }
  };

  const removeRow = (userId) => {
    setRows((prevRows) => prevRows.filter((row) => row.userId !== userId));
  };

  // Search Functionality
  const handleSearch = (event) => setSearchTerm(event.target.value);

  const filteredRows = rows.filter((row) =>
    row.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Utils
  const resetNewUserCompany = () => setNewUserCompany(initialUserCompanyData());

  const closeEditModal = () => setIsEditModalOpen(false);
  const closeAddModal = () => setIsAddModalOpen(false);

  const handleSuccess = (message) => toast.success(message, { autoClose: 2000, containerId: "userCompanies" });
  const handleError = (message) => toast.error(message, { autoClose: 2000, containerId: "userCompanies" });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <MDTypography variant="h6" color="white">
                  User Companies
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <MDInput
                  type="text"
                  placeholder="Search User Company"
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
                      { Header: "Username", accessor: "userName", align: "left" },
                      { Header: "Email", accessor: "email", align: "center" },
                      { Header: "Company Name", accessor: "companyName", align: "center" },
                      { Header: "Owner Name", accessor: "ownerName", align: "center" },
                      { Header: "Owner Email", accessor: "ownerEmail", align: "center" },
                      { Header: "Owner Phone Number", accessor: "ownerPhoneNumber", align: "center" },
                      { Header: "Action", accessor: "action", align: "center" },
                    ],
                    rows: filteredRows,
                  }}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        <UserCompanyModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onSubmit={handleAddUserCompany}
          userCompanyData={newUserCompany}
          setUserCompanyData={setNewUserCompany}
          title="Add New User Company"
        />
        <UserCompanyModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSubmit={handleSaveClick}
          userCompanyData={editingUserCompany}
          setUserCompanyData={setEditingUserCompany}
          title="Edit User Company"
        />
        <ToastContainer containerId="userCompanies" />
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

// Helper function to initialize a new user company object
const initialUserCompanyData = () => ({
  userName: "",
  email: "",
  password: "",
  companyName: "",
  ownerName: "",
  ownerEmail: "",
  ownerPhoneNumber: "",
});

const searchStyle = {
  marginBottom: "10px",
  marginRight: "10px",
};

const addButtonStyle = {
  backgroundColor: "#1A73E8",
  color: "#FFF",
  padding: "8px 16px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default UserCompany;
