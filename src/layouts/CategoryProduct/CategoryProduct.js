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
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';
import { GetCatagory, AddCategory, UpdateCatagory, DeleteCatagory } from "layouts/Api";

const CategoryProduct = () => {
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [catName, setCatName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState(null); // New state for editing outlet

  useEffect(() => {
    fetchCategories();
    fetchOutlets();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("User is not authenticated");

      const response = await axios.get(GetCatagory, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const fetchedData = response.data || [];
      setRows(formatRows(fetchedData));
    } catch (error) {
      console.error("Error fetching category data:", error);
      toast.error("Failed to fetch categories.");
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

      setOutlets(mappedOutlets);
    } catch (error) {
      console.error("Error fetching outlet data:", error);
      toast.error("Failed to fetch outlets.");
    }
  };

  const formatRows = (categories) => {
    return categories.map((category) => ({
      id: category.id,
      category: category.catName,
      outlet: category.outletName, // Assuming outletId is part of the category object
      action: (
        <>
          <IconButton onClick={() => handleEditClick(category)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(category.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    }));
  };

  const handleEditClick = (category) => {
    setEditingId(category.id);
    setEditingName(category.catName);
    setEditingOutlet({ value: category.outletId, label: category.outletName }); // Pre-fill selected outlet
    setIsEditModalOpen(true);
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`${UpdateCatagory}?id=${editingId}&CatName=${editingName}&OutletId=${editingOutlet.value}`, {
        id: editingId,
        catName: editingName,
        outletId: editingOutlet.value, // Include outletId in the request
      });
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === editingId ? { ...row, category: editingName, outlet: editingOutlet.label } : row
        )
      );
      setEditingId(null);
      setEditingName("");
      setEditingOutlet(null);
      setIsEditModalOpen(false);
      toast.success("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category.");
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`${DeleteCatagory}?Id=${id}`);
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category.");
    }
  };

  const handleAddCategory = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("User is not authenticated");

      const outletId = selectedOutlet ? selectedOutlet.value : null;
      await axios.post(AddCategory, { catName, outletId }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      toast.success("Category added successfully!");
      setCatName("");
      setSelectedOutlet(null);
      fetchCategories();
      toggleModal();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category.");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const filteredRows = rows.filter(row =>
    row.category.toLowerCase().includes(searchTerm.toLowerCase())
  ); const columns = [
    { Header: "Category", accessor: "category" },
    { Header: "Outlet", accessor: "outlet" },
    { Header: "Action", accessor: "action"},
  ]
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
  

  return ( <DashboardLayout>
    <DashboardNavbar />
    <MDBox py={3}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <MDBox p={2}>
              <MDTypography variant="h6" gutterBottom>
                Catagory
              </MDTypography>
              <MDBox mb={3} display="flex" justifyContent="space-between">
                <MDInput
                  type="text"
                  label="Search Catagory"
                  onChange={handleSearch}
                  value={searchTerm}
                />
                <button
                  style={modalStyles.button}
                  onClick={() => setIsModalOpen({ ...isModalOpen, add: true })}
                >
                  Add Catagory
                </button>
              </MDBox>
              <DataTable
                  table={{ columns, rows: filteredRows }}
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
                

              {isModalOpen && (
                <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <div style={modalStyles.header}>
            <MDTypography variant="h5">
                Add Category
              </MDTypography>

                      <button style={modalStyles.closeButton} onClick={toggleModal} >&times;</button>
                    </div>
                    <form onSubmit={handleAddCategory}>
                    <div style={modalStyles.gridContainer}>
                      <MDInput
                        type="text"
                        placeholder="Category Name"
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        //placeholder="entername"
                        required
                       
                        style={modalStyles.input}
                      />
                      <Select
                        options={outlets}
                        value={selectedOutlet}
                        onChange={setSelectedOutlet}
                        placeholder="Select Outlet"
                        styles={{ container: base => ({ ...base, marginBottom: '15px' }) }}
                      />
                      <button type="submit" style={modalStyles.button}>
                        Add Category
                      </button>
                      </div>
                    </form>
                    
                  </div>
                </div>
              )}

              {isEditModalOpen && (
                <div style={modalStyles.overlay}>
                <div style={modalStyles.modal}>
                <div style={modalStyles.header}>
                <MDTypography variant="h5">
                Edit Category
              </MDTypography>
                      <button onClick={toggleEditModal}style={modalStyles.closeButton}>&times;</button>
                    </div>
                    <div style={modalStyles.gridContainer}>
                    <MDInput
                      type="text"
                      placeholder="Category Name"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      required
                      style={modalStyles.input}
                    />
                    <Select
                      options={outlets}
                      value={editingOutlet}
                      onChange={setEditingOutlet}
                      placeholder="Select Outlet"
                      styles={{ container: base => ({ ...base, marginBottom: '15px' }) }}
                      style={modalStyles.input}
                    />
                    
                    <button onClick={handleSaveClick} tyle={modalStyles.button}>
                      Save Changes
                    </button>
                  </div>
                </div>
                </div>
              )}
            
      <ToastContainer />
    </DashboardLayout>
  );
};

export default CategoryProduct;
