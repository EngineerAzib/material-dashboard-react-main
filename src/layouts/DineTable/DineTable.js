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

const DineTable = () => {
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [dineTableName, setDineTableName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchDineTable();
  }, []);

  const fetchDineTable = async () => {
    try {
      const response = await axios.get("https://localhost:7171/api/DineTable/GetTable");
      const fetchedData = response.data || [];
      setRows(formatRows(fetchedData));
    } catch (error) {
      console.error("Error fetching dine table data:", error);
      toast.error("Failed to fetch dine table data.");
    }
  };

  const formatRows = (data) => {
    return data.map((item) => ({
      id: item.id,
      diningTable: item.dineTabName,
      action: (
        <>
          <IconButton onClick={() => handleEditClick(item.id, item.dineTabName)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(item.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    }));
  };

  const handleEditClick = (id, currentName) => {
    setEditingId(id);
    setEditingName(currentName);
    setIsEditModalOpen(true);
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`https://localhost:7171/api/DineTable/UpdateDine?id=${editingId}`, {
        id: editingId,
        dineTabName: editingName
      });
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === editingId ? { ...row, diningTable: editingName } : row
        )
      );
      setEditingId(null);
      setEditingName("");
      setIsEditModalOpen(false);
      toast.success("Dine table updated successfully!");
    } catch (error) {
      console.error("Error updating dine table:", error);
      toast.error("Failed to update dine table.");
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`https://localhost:7171/api/DineTable/deleteDine?id=${id}`);
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      toast.success("Dine table deleted successfully!");
    } catch (error) {
      console.error("Error deleting dine table:", error);
      toast.error("Failed to delete dine table.");
    }
  };

  const handleAddDineTable = async (event) => {
    event.preventDefault();
    try {
      await axios.post('https://localhost:7171/api/DineTable/AddDineTable', {
        dineTabName: dineTableName
      });
      toast.success("Dine table added successfully!");
      setDineTableName("");
      fetchDineTable();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding dine table:", error);
      toast.error("Failed to add dine table.");
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
    row.diningTable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Category = ({ name, isEditing }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        {isEditing ? (
          <MDInput
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            fullWidth
          />
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
        name={row.diningTable}
        isEditing={row.id === editingId}
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <MDTypography variant="h6" color="white">Dine Table</MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <MDInput
                  type="text"
                  placeholder="Search Dine Table"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '20px' }}
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <button onClick={toggleAddModal} style={{ padding: '10px 20px', backgroundColor: '#344767', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '16px', marginBottom: '20px' }}>
                  Add New
                </button>
                <DataTable table={{ columns: [{ Header: "Dine Table", accessor: "category", align: "center" }, { Header: "Action", accessor: "action", align: "center" }], rows: formattedRows }} />
              </MDBox>
              {isAddModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={toggleAddModal}>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '400px', maxWidth: '80%', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h2>Add Dine Table</h2>
                      <button onClick={toggleAddModal} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                    </div>
                    <form onSubmit={handleAddDineTable}>
                      <div style={{ marginBottom: '15px' }}>
                        <MDInput
                          type="text"
                          placeholder="Dine Table Name"
                          style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                          value={dineTableName}
                          onChange={(e) => setDineTableName(e.target.value)}
                        />
                      </div>
                      <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#344767', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
                        Add
                      </button>
                    </form>
                  </div>
                </div>
              )}
              {isEditModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={toggleEditModal}>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '400px', maxWidth: '80%', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h2>Edit Dine Table</h2>
                      <button onClick={toggleEditModal} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                    </div>
                    <form>
                      <div style={{ marginBottom: '15px' }}>
                        <MDInput
                          type="text"
                          placeholder="Dine Table Name"
                          style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                        />
                      </div>
                      <button type="button" onClick={handleSaveClick} style={{ width: '100%', padding: '10px', backgroundColor: '#344767', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
                        Save
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

export default DineTable;
