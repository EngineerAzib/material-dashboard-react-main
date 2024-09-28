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

const StaffTable = () => {
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingPhone, setEditingPhone] = useState("");
  const [editingRole, setEditingRole] = useState("");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newNIC, setNIC] = useState("");
  const [newAddress, setAddress] = useState("");
  const [newSalary, setSalary] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchStaffTable();
  }, []);

  const fetchStaffTable = async () => {
    try {
      const response = await axios.get("https://localhost:7171/api/Staff/GetStaff");
      const fetchedData = response.data || [];
      setRows(formatRows(fetchedData));
    } catch (error) {
      console.error("Error fetching staff data:", error);
      toast.error("Failed to fetch staff data.");
    }
  };

  const formatRows = (data) => {
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      phone: item.phone,
      role: item.role,
      niC_number: item.niC_number,
      address: item.address,
      salary: item.salary,
      action: (
        <>
          <IconButton onClick={() => handleEditClick(item.id, item.name, item.phone, item.role, item.niC_number, item.address, item.salary)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(item.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    }));
  };

  const handleEditClick = (id, currentName, currentPhone, currentRole, currentNIC, currentAddress, currentSalary) => {
    setEditingId(id);
    setEditingName(currentName);
    setEditingPhone(currentPhone);
    setEditingRole(currentRole);
    setNIC(currentNIC);
    setAddress(currentAddress);
    setSalary(currentSalary);
    setIsEditModalOpen(true);
  };
  

  const handleSaveClick = async () => {
    try {
      await axios.put(`https://localhost:7171/api/Staff/UpdateStaff?Id=${editingId}`, {
        id: editingId,
        name: editingName,
        phone: editingPhone,
        role: editingRole,
        niC_number: newNIC,
        address: newAddress,
        salary: newSalary,
      });
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === editingId ? {
            ...row,
            name: editingName,
            phone: editingPhone,
            role: editingRole,
            niC_number: newNIC,
            address: newAddress,
            salary: newSalary,
          } : row
        )
      );
      setEditingId(null);
    setEditingName("");
    setEditingPhone("");
    setEditingRole("");
    setNIC("");
    setAddress("");
    setSalary("");
    setIsEditModalOpen(false);
      toast.success("Staff updated successfully!");
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error("Failed to update staff.");
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`https://localhost:7171/api/Staff/DeleteStaff?id=${id}`);
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      toast.success("Staff deleted successfully!");
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error("Failed to delete staff.");
    }
  };

  const handleAddStaff = async (event) => {
    event.preventDefault();
    try {
      await axios.post('https://localhost:7171/api/Staff/AddStaff', {
        name: newName,
        phone: newPhone,
        role: newRole,
        niC_number: newNIC,
        address: newAddress,
        salary: newSalary,
      });
      toast.success("Staff added successfully!");
      setNewName("");
      setNewPhone("");
      setNewRole("");
      setNIC("");
      setAddress("");
      setSalary("");
      setIsAddModalOpen(false);
      fetchStaffTable();
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error("Failed to add staff.");
    }
  };

  const toggleAddModal = () => {
    setIsAddModalOpen(!isAddModalOpen);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = rows.filter(row =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Category = ({ name, phone, role, isEditing,niC_number,address,salary }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        {isEditing ? (
          <MDBox display="flex" flexDirection="row" gap={2}>
            <MDInput
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              fullWidth
              style={{ marginRight: '10px' }}
            />
            <MDInput
              value={editingPhone}
              onChange={(e) => setEditingPhone(e.target.value)}
              fullWidth
              style={{ marginRight: '10px' }}
            />
            <MDInput
              value={editingRole}
              onChange={(e) => setEditingRole(e.target.value)}
              fullWidth
            />
          </MDBox>
        ) : (
          <MDTypography display="block" variant="button" fontWeight="medium">
            {name}
          </MDTypography>
        )}
      </MDBox>
    </MDBox>
  );

  const formattedRows = filteredRows.map((row) => ({
    ...row,
    category: (
      <Category
        name={row.name}
        phone={row.phone}
        role={row.role}
        isEditing={row.id === editingId}
        niC_number={row.niC_number}
        address={row.address}
        salary={row.salary}
      />
    ),
    action: row.id === editingId ? (
      <IconButton onClick={handleSaveClick}>
        <SaveIcon />
      </IconButton>
    ) : (
      row.action
    ),
  }));

  const modalStyles = {
    appContainer: { padding: '20px' },
    openModalBtn: {
      padding: '10px 20px',
      backgroundColor: '#344767',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '5px',
      fontSize: '16px'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContainer: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      width: '400px',
      maxWidth: '80%',
      position: 'relative'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    closeModalBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer'
    },
    formGroup: { marginBottom: '15px' },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px'
    },
    submitBtn: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#344767',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '5px',
      fontSize: '16px'
    },
    searchInput: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      marginBottom: '20px'
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <MDTypography variant="h6" color="white">Staff Table</MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <button onClick={toggleAddModal} style={modalStyles.openModalBtn}>Add New Staff</button>
                <MDInput
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search staff by name"
                  style={modalStyles.searchInput}
                />
                <DataTable
                 table={{
                  columns: [
                    { Header: "Name", accessor: "name" },
                    { Header: "NIC Number", accessor: "niC_number" },
                    { Header: "Address", accessor: "address" },
                    { Header: "Salary", accessor: "salary" },
                    { Header: "Phone", accessor: "phone" },
                    { Header: "Role", accessor: "role" },
                    { Header: "Actions", accessor: "action" }
                  ],
                  rows: formattedRows
                }}
                isSorted={false}
              />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      {isAddModalOpen && (
  <div style={modalStyles.modalOverlay}>
    <div style={modalStyles.modalContainer}>
      <div style={modalStyles.modalHeader}>
        <h3>Add New Staff</h3>
        <button onClick={toggleAddModal} style={modalStyles.closeModalBtn}>&times;</button>
      </div>
      <form onSubmit={handleAddStaff}>
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label>Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={modalStyles.input}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Phone</label>
            <input
              type="text"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              style={modalStyles.input}
              required
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Role</label>
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              style={modalStyles.input}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>NIC Number</label>
            <input
              type="text"
              value={newNIC}
              onChange={(e) => setNIC(e.target.value)}
              style={modalStyles.input}
              required
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Address</label>
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setAddress(e.target.value)}
              style={modalStyles.input}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Salary</label>
            <input
              type="number"
              value={newSalary}
              onChange={(e) => setSalary(e.target.value)}
              style={modalStyles.input}
              required
            />
          </div>
        </div>

        <button type="submit" style={modalStyles.submitBtn}>Add Staff</button>
      </form>
    </div>
  </div>
)}

     {isEditModalOpen && (
  <div style={modalStyles.modalOverlay}>
    <div style={modalStyles.modalContainer}>
      <div style={modalStyles.modalHeader}>
        <h3>Edit Staff</h3>
        <button onClick={() => setIsEditModalOpen(false)} style={modalStyles.closeModalBtn}>&times;</button>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <label>Name</label>
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            style={modalStyles.input}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>Phone</label>
          <input
            type="text"
            value={editingPhone}
            onChange={(e) => setEditingPhone(e.target.value)}
            style={modalStyles.input}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
        <div style={{ flex: 1 }}>
          <label>Role</label>
          <input
            type="text"
            value={editingRole}
            onChange={(e) => setEditingRole(e.target.value)}
            style={modalStyles.input}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>NIC Number</label>
          <input
            type="text"
            value={newNIC}
            onChange={(e) => setNIC(e.target.value)}
            style={modalStyles.input}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
        <div style={{ flex: 1 }}>
          <label>Address</label>
          <input
            type="text"
            value={newAddress}
            onChange={(e) => setAddress(e.target.value)}
            style={modalStyles.input}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>Salary</label>
          <input
            type="number"
            value={newSalary}
            onChange={(e) => setSalary(e.target.value)}
            style={modalStyles.input}
          />
        </div>
      </div>

      <button onClick={handleSaveClick} style={modalStyles.submitBtn}>Save Changes</button>
    </div>
  </div>
)}
      <ToastContainer />
    </DashboardLayout>
  );
};

export default StaffTable;
