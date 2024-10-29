import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetOutLets,AddOutLets,UpdateOutLets,DeleteOutLets,GetCompany } from "layouts/Api";
const Outlets = () => {
  const [outlets, setOutlets] = useState([]);
  const [companies, setCompanies] = useState([]); // State to store companies
  const [editingOutlet, setEditingOutlet] = useState(null);
  const [newOutlet, setNewOutlet] = useState({
    outlet_Name: "",
    outlet_Address: "",
    outlet_Phone_Number: "",
    outlet_Owner_Name: "",
    //isActive: true,
    email: "",
    company_Id: "", // This will hold the selected company ID
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false });

  // Fetch outlets and companies on component load
  useEffect(() => {
    fetchOutlets();
    fetchCompanies(); // Fetch companies when component mounts
  }, []);

  // Fetch outlets
  const fetchOutlets = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log(token, "token"); // Check the token value
      const userId = localStorage.getItem("userId");
      console.log(userId, "userId"); // Check the userId value
      if (!token || !userId) {
        throw new Error("User is not authenticated or userId is missing");
      }
    const response = await axios.get(GetOutLets,{
       headers: {
         
        'Authorization': `Bearer ${token}`
    }});
      setOutlets(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch outlets.");
    }
  };

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      const response = await axios.get(GetCompany);
      setCompanies(response.data || []); // Assume response contains an array of companies
    } catch (error) {
      toast.error("Failed to fetch companies.");
    }
  };

  const handleEditClick = (outlet) => {
    setEditingOutlet(outlet);
    setNewOutlet({
      outlet_Name: outlet.outlet_Name,
      outlet_Address: outlet.outlet_Address,
      outlet_Phone_Number: outlet.outlet_Phone_Number,
      outlet_Owner_Name: outlet.outlet_Owner_Name,
      isActive: outlet.isActive,
      email: outlet.email,
      company_Id: outlet.company_Id,  // Set the company ID when editing
    });
    setIsModalOpen({ ...isModalOpen, edit: true });
  };

  const handleOutletSubmit = async (event, isEdit) => {
    event.preventDefault();
    try {
      if (isEdit) {
        await axios.put(
          `${UpdateOutLets}?id=${editingOutlet.id}`,
          newOutlet
        );
        toast.success("Outlet updated successfully!");
      } else {
        await axios.post(AddOutLets, newOutlet);
        toast.success("Outlet added successfully!");
      }
      fetchOutlets();
      closeModal();
    } catch (error) {
      toast.error(isEdit ? "Failed to update outlet." : "Failed to add outlet.");
    }
  };

  const handleDeleteOutlet = async (id) => {
    try {
      await axios.delete(`${DeleteOutLets}?id=${id}`);
      setOutlets((prevOutlets) => prevOutlets.filter((outlet) => outlet.id !== id));
      toast.success("Outlet deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete outlet.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOutlet((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const closeModal = () => {
    setIsModalOpen({ add: false, edit: false });
    setEditingOutlet(null);
    setNewOutlet({
      outlet_Name: "",
      outlet_Address: "",
      outlet_Phone_Number: "",
      outlet_Owner_Name: "",
      isActive: true,
      email: "",
      company_Id: "",
    });
  };

  const filteredOutlets = outlets.filter((outlet) =>
    outlet.outlet_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { Header: "Outlet Name", accessor: "outlet_Name" },
    { Header: "Address", accessor: "outlet_Address" },
    { Header: "Phone Number", accessor: "outlet_Phone_Number" },
    { Header: "Owner", accessor: "outlet_Owner_Name" },
    { Header: "Email", accessor: "email" },
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
                  Outlets
                </MDTypography>
                <MDBox mb={3} display="flex" justifyContent="space-between">
                  <MDInput
                    type="text"
                    label="Search Outlets"
                    onChange={handleSearch}
                    value={searchTerm}
                  />
                  <button
                    style={modalStyles.button}
                    onClick={() => setIsModalOpen({ ...isModalOpen, add: true })}
                  >
                    Add New Outlets
                  </button>
                </MDBox>
                <DataTable
                  table={{
                    columns,
                    rows: filteredOutlets.map((outlet) => ({
                      ...outlet,
                      actions: (
                        <>
                          <IconButton onClick={() => handleEditClick(outlet)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteOutlet(outlet.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </>
                      ),
                    })),
                  }}
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
                {isModalOpen.edit ? "Edit Outlet" : "Add New Outlet"}
              </MDTypography>
              <button style={modalStyles.closeButton} onClick={closeModal}>
                &times;
              </button>
            </div>
            <form onSubmit={(e) => handleOutletSubmit(e, isModalOpen.edit)}>
              <div style={modalStyles.gridContainer}>
                <MDInput
                  type="text"
                  name="outlet_Name"
                  value={newOutlet.outlet_Name}
                  onChange={handleInputChange}
                  placeholder="Outlet Name"
                  style={modalStyles.input}
                />
                <MDInput
                  type="text"
                  name="outlet_Address"
                  value={newOutlet.outlet_Address}
                  onChange={handleInputChange}
                  placeholder="Outlet Address"
                  style={modalStyles.input}
                />
                <MDInput
                  type="text"
                  name="outlet_Phone_Number"
                  value={newOutlet.outlet_Phone_Number}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  style={modalStyles.input}
                />
                <MDInput
                  type="text"
                  name="outlet_Owner_Name"
                  value={newOutlet.outlet_Owner_Name}
                  onChange={handleInputChange}
                  placeholder="Owner Name"
                  style={modalStyles.input}
                />
                <MDInput
                  type="email"
                  name="email"
                  value={newOutlet.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  style={modalStyles.input}
                />

                {/* Dropdown to select company */}
                <select
                  name="company_Id"
                  value={newOutlet.company_Id}
                  onChange={handleInputChange}
                  style={modalStyles.select}
                >
                  <option value="">Select Company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.company_Name}
                    </option>
                  ))}
                </select>

                <button type="submit" style={modalStyles.button}>
                  {isModalOpen.edit ? "Update Outlet" : "Add Outlet"}
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

export default Outlets;
