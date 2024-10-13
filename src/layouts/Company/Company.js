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
        <TextField
          autoFocus
          margin="dense"
          name="userName"
          label="Username"
          type="text"
          fullWidth
          variant="outlined"
          value={userCompanyData.userName || ""}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={userCompanyData.email || ""}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="password"
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={userCompanyData.password || ""}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="companyName"
          label="Company Name"
          type="text"
          fullWidth
          variant="outlined"
          value={userCompanyData.companyName || ""}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="ownerName"
          label="Owner Name"
          type="text"
          fullWidth
          variant="outlined"
          value={userCompanyData.ownerName || ""}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="ownerEmail"
          label="Owner Email"
          type="email"
          fullWidth
          variant="outlined"
          value={userCompanyData.ownerEmail || ""}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="ownerPhoneNumber"
          label="Owner Phone Number"
          type="text"
          fullWidth
          variant="outlined"
          value={userCompanyData.ownerPhoneNumber || ""}
          onChange={handleInputChange}
        />
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
const Company = () => {
  const [rows, setRows] = useState([]);
  const [editingUserCompany, setEditingUserCompany] = useState(null);
  const [newUserCompany, setNewUserCompany] = useState({
    userName: "",
    email: "",
    password: "",
    companyName: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhoneNumber: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchUserCompanies();
  }, []);

  const fetchUserCompanies = async () => {
    try {
      const response = await axios.get("https://localhost:7171/api/Auth/all");
      const fetchedData = response.data || [];
      setRows(formatRows(fetchedData));
    } catch (error) {
      console.error("Error fetching user companies data:", error);
      toast.error("Failed to fetch user companies data.", { containerId: "userCompanies" });
    }
  };

  const formatRows = (data) => {
    return data.map((item) => ({
      id: item.id,
      userName: item.userName,
      email: item.email,
      companyName: item.companyName,
      ownerName: item.ownerName,
      ownerEmail: item.ownerEmail,
      ownerPhoneNumber: item.ownerPhoneNumber,
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
    setEditingUserCompany(item);
    setIsEditModalOpen(true);
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://localhost:7171/api/Auth/${editingUserCompany.id}`, editingUserCompany);
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === editingUserCompany.id ? { ...row, ...editingUserCompany } : row
        )
      );
      setIsEditModalOpen(false);
      toast.success("User Company updated successfully!", { autoClose: 2000, containerId: "userCompanies" });
    } catch (error) {
      console.error("Error updating user company:", error);
      toast.error("Failed to update user company.", { autoClose: 2000, containerId: "userCompanies" });
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`https://localhost:7171/api/Auth/${id}`);
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      toast.success("User Company deleted successfully!", { autoClose: 2000, containerId: "userCompanies" });
    } catch (error) {
      console.error("Error deleting user company:", error);
      toast.error("Failed to delete user company.", { autoClose: 2000, containerId: "userCompanies" });
    }
  };

  const handleAddUserCompany = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://localhost:7171/api/Auth", newUserCompany);
      toast.success("User Company added successfully!", { autoClose: 2000, containerId: "userCompanies" });
      fetchUserCompanies();
      setNewUserCompany({
        userName: "",
        email: "",
        password: "",
        companyName: "",
        ownerName: "",
        ownerEmail: "",
        ownerPhoneNumber: "",
      });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding user company:", error);
      toast.error("Failed to add user company.", { autoClose: 2000, containerId: "userCompanies" });
    }
  };

  const handleSearch = (event) => setSearchTerm(event.target.value);

  const filteredRows = rows.filter((row) =>
    row.userName.toLowerCase().includes(searchTerm.toLowerCase())
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
                  isSorted={false}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <UserCompanyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddUserCompany}
        userCompanyData={newUserCompany}
        setUserCompanyData={setNewUserCompany}
        title="Add User Company"
      />
      <UserCompanyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSaveClick}
        userCompanyData={editingUserCompany}
        setUserCompanyData={setEditingUserCompany}
        title="Edit User Company"
      />
      <ToastContainer enableMultiContainer containerId="userCompanies" />
      <Footer />
    </DashboardLayout>
  );
};

// Styles
const searchStyle = {
  margin: "20px 0",
  padding: "10px",
  width: "100%",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const addButtonStyle = {
  marginLeft: "10px",
  padding: "10px 15px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default Company;
