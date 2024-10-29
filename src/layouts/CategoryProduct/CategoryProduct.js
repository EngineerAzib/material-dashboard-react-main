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
      outlet: category.outletId, // Assuming outletId is part of the category object
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
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <MDTypography variant="h6" color="white">Categories Table</MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <MDBox display="flex" flexDirection="column" alignItems="flex-start">
                  <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <MDInput
                      type="text"
                      placeholder="Search Category"
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '20px' }}
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                    <button onClick={toggleModal} style={{ padding: '10px 20px', backgroundColor: '#344767', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '16px', marginBottom: '20px' }}>
                      Add New
                    </button>
                  </MDBox>
                  <DataTable
                    table={{
                      columns: [
                        { Header: "Category", accessor: "category", align: "center" },
                        { Header: "Outlet", accessor: "outlet", align: "center" }, // New column for outlet
                        { Header: "Action", accessor: "action", align: "center" }
                      ],
                      rows: filteredRows
                    }}
                  />
                </MDBox>
              </MDBox>

              {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '400px', maxWidth: '80%', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h2>Add Category</h2>
                      <button onClick={toggleModal} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
                    </div>
                    <form onSubmit={handleAddCategory}>
                      <MDInput
                        type="text"
                        placeholder="Category Name"
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        required
                      />
                      <Select
                        options={outlets}
                        value={selectedOutlet}
                        onChange={setSelectedOutlet}
                        placeholder="Select Outlet"
                        styles={{ container: base => ({ ...base, marginBottom: '15px' }) }}
                      />
                      <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#344767', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
                        Add Category
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {isEditModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '400px', maxWidth: '80%', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h2>Edit Category</h2>
                      <button onClick={toggleEditModal} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
                    </div>
                    <MDInput
                      type="text"
                      placeholder="Category Name"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      required
                    />
                    <Select
                      options={outlets}
                      value={editingOutlet}
                      onChange={setEditingOutlet}
                      placeholder="Select Outlet"
                      styles={{ container: base => ({ ...base, marginBottom: '15px' }) }}
                    />
                    <button onClick={handleSaveClick} style={{ width: '100%', padding: '10px', backgroundColor: '#344767', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
                      Save Changes
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

export default CategoryProduct;
