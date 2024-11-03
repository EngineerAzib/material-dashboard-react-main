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
import Select from "react-select";  // Import react-select for dropdown
 
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
  const [selectedOutlet, setSelectedOutlet] = useState(null); // Store selected outlet in Add form
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editingEmail, setEditingEmail] = useState("");
  const [editingPassword, setEditingPassword] = useState("");
const [outlets, setOutlets] = useState([]); // State variable for outlets
const [selectedEditOutlet, setSelectedEditOutlet] = useState(null); // Declare the state variable

  useEffect(() => {
    fetchStaffTable();
    fetchOutlets(); // Fetch outlets data
  }, []);


  const fetchStaffTable = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("User is not authenticated");

      const response = await axios.get("https://localhost:7171/api/Staff/GetStaff", {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const fetchedData = response.data || [];
      setRows(formatRows(fetchedData));
    } catch (error) {
      console.error("Error fetching staff data:", error);
      toast.error("Failed to fetch staff data.");
    }
  };

  const fetchOutlets = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log("Token:", token); // Log the token for verification
  
      if (!token) throw new Error("User is not authenticated");
  
      const response = await axios.get("https://localhost:7171/api/OutLets/GetOutLets", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      console.log("API Response:", response); // Log the full response
      console.log("Response Data:", response.data); // Log the data property specifically
  
      const mappedOutlets = response.data.map(outlet => ({
        value: outlet.id,
        label: outlet.outlet_Name
      }));
  
      console.log("Mapped Outlets:", mappedOutlets); // Log the mapped outlets array
  
      setOutlets(mappedOutlets);
    } catch (error) {
      console.error("Error fetching outlet data:", error); // Log the error in case of failure
      toast.error("Failed to fetch outlets.");
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
      email: item.email,
      password: item.password,
      outlet_Id: item.outlet_Id, // Include outlet ID
      outlet_Name:item.outlet_Name,
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
    setEditingId(item.id);
    setEditingName(item.name);
    setEditingPhone(item.phone);
    setEditingRole(item.role);
    setNIC(item.niC_number);
    setAddress(item.address);
    setSalary(item.salary);
    setEditingEmail(item.email);
    setEditingPassword(item.password);
    setSelectedEditOutlet({value:item.outlet_Id,label:item.outlet_Name})
    setIsEditModalOpen(true);
  };
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    setEditingPhone("");
    setEditingRole("");
    setNIC("");
    setAddress("");
    setSalary("");
    setEditingEmail("");
    setEditingPassword("");
    setIsEditModalOpen(false);
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
      email: newEmail, // Include email
      password: editingPassword, // Include password
      outlet_Id: selectedEditOutlet?.value,
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
          email: editingEmail,        // Update email in row
          password: editingPassword,  // Update password in row
        } : row
      )
    );
    closeModal();
    // Clear fields and close modal
    setEditingId(null);
    setEditingName("");
    setEditingPhone("");
    setEditingRole("");
    setNIC("");
    setAddress("");
    setSalary("");
    setEditingEmail("");
    setEditingPassword("");
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
      console.log("Selected Outlet ID:", selectedOutlet?.value);
      await axios.post('https://localhost:7171/api/Staff/AddStaff', {
        name: newName,
        phone: newPhone,
        role: newRole,
        niC_number: newNIC,
        address: newAddress,
        salary: newSalary,
        email: newEmail,           // Add email
        password: newPassword,     // Add password
        outlet_Id: selectedOutlet?.value,

    
      });
      toast.success("Staff added successfully!");
      fetchStaffTable();
      closeModal();
      setNewName("");
      setNewPhone("");
      setNewRole("");
      setNIC("");
      setAddress("");
      setSalary("");
      setNewEmail("");      // Reset email field
      setNewPassword("");   // Reset password field
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error("Failed to add staff.");
    }
  };
  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
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
              value={editingEmail}
              onChange={(e) => setEditingEmail(e.target.value)}
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
        email={row.email}
        
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
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <MDTypography variant="h6" color="white">Staff Table</MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <button onClick={toggleAddModal} style={modalStyles.button}>Add New Staff</button>
                
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
                    { Header: "Email", accessor: "email" },
                    { Header: "Phone", accessor: "phone" },
                    { Header: "Role", accessor: "role" },
                    { Header: "outlet_Name", accessor: "outlet_Name" },
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
  <div style={modalStyles.overlay}>
    <div style={modalStyles.modal}>
      <div style={modalStyles.header}>
        <h3>Add New Staff</h3>
        <button onClick={toggleAddModal} style={modalStyles.closeButton}>&times;</button>
      </div>
      <form onSubmit={handleAddStaff}>
        <div style={modalStyles.gridContainer}>
        <MDInput
                  type="text"
                  name="Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="EnterName"
                  style={modalStyles.input}
            
                />
                 <MDInput
                   type="email"
                   value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="EnterEmail"
                  style={modalStyles.input}
            
                />
                 <MDInput
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="EnterPassword"
                  style={modalStyles.input}
            
                />
                 <MDInput
                    type="number"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="EnterPhoneNumber"
                  style={modalStyles.input}
            
                />

            <Select
                options={outlets}
                value={selectedOutlet}
                onChange={(selectedOption) => setSelectedOutlet(selectedOption)}
                placeholder="Select Outlet"
                required
              />
                <MDInput
                     type="text"
                     value={newRole}
                     onChange={(e) => setNewRole(e.target.value)}
                     required
                  placeholder="EnterRole"
                  style={modalStyles.input}
            
                />
                 <MDInput
                     type="text"
                     value={newNIC}
                     onChange={(e) => setNIC(e.target.value)}
                     required
                  placeholder="EnterNIC"
                  style={modalStyles.input}
            
                />
                 <MDInput
                    type="text"
                    value={newAddress}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  placeholder="Address"
                  style={modalStyles.input}
            
                />
                  <MDInput
                    type="number"
                    value={newSalary}
                    onChange={(e) => setSalary(e.target.value)}
                    required
                  placeholder="Salary"
                  style={modalStyles.input}
            
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

        <button type="submit" style={modalStyles.button}>Save</button>
        </div>
      </form>
    </div>
   
  </div>
)}

{isEditModalOpen && (
  <div style={modalStyles.overlay}>
    <div style={modalStyles.modal}>
      
      <div style={modalStyles.header}>
        <h3>Edit Staff</h3>
        <button onClick={handleCancelEdit} style={modalStyles.closeButton}>&times;</button>
      </div>

      <div style={modalStyles.gridContainer}>
        <MDInput
          type="text"
          name="Name"
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
          placeholder="Enter Name"
          style={modalStyles.input}
        />
        <MDInput
          type="email"
          value={editingEmail}
          onChange={(e) => setEditingEmail(e.target.value)}
          placeholder="Enter Email"
          style={modalStyles.input}
        />
        <MDInput
          type="text"
          value={editingPassword}
          onChange={(e) => setEditingPassword(e.target.value)}
          placeholder="Enter Password"
          style={modalStyles.input}
        />
        <MDInput
          type="number"
          value={editingPhone}
          onChange={(e) => setEditingPhone(e.target.value)}
          placeholder="Enter Phone Number"
          style={modalStyles.input}
        />
        <Select
          options={outlets}
          value={selectedEditOutlet}
          onChange={(selectedOption) => setSelectedEditOutlet(selectedOption)}
          placeholder="Select Outlet"
          required
        />
        <MDInput
          type="text"
          value={editingRole}
          onChange={(e) => setEditingRole(e.target.value)}
          placeholder="Enter Role"
          style={modalStyles.input}
        />
        <MDInput
          type="text"
          value={newNIC}
          onChange={(e) => setNIC(e.target.value)}
          placeholder="Enter NIC"
          style={modalStyles.input}
        />
        <MDInput
          type="text"
          value={newAddress}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          style={modalStyles.input}
        />
        <MDInput
          type="number"
          value={newSalary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="Salary"
          style={modalStyles.input}
        />
         <div style={modalStyles.footer}>
              <button
                type="button"
                style={modalStyles.cancelButton}
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
                
        <button onClick={handleSaveClick} style={modalStyles.button}>Update</button>
      </div>
      </div>
    </div>
  </div>
)}
<ToastContainer />

    </DashboardLayout>
  );
};

export default StaffTable;
