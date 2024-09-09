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
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Toggle from 'react-toggle';
import 'react-toggle/style.css'; // Import default styles
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DocumentTypeManagement = () => {
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingIsActive, setEditingIsActive] = useState(true);
  const [documentName, setDocumentName] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    try {
      const response = await axios.get("https://localhost:7171/api/DocumentType/GetdocumentType");
      const fetchedData = response.data || [];
      setRows(formatRows(fetchedData));
    } catch (error) {
      console.error("Error fetching document types:", error);
      toast.error("Failed to fetch document types.");
    }
  };

  const formatRows = (data) => {
    return data.map((item) => ({
      id: item.id,
      docName: item.docName,
      description: item.description,
      isActive: item.isActive,
      createdDate: new Date(item.createdDate).toLocaleDateString(),
      updatedDate: item.updatedDate ? new Date(item.updatedDate).toLocaleDateString() : "N/A",
      action: (
        <>
          <IconButton onClick={() => handleEditClick(item.id, item.docName, item.description, item.isActive)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(item.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    }));
  };

  const handleEditClick = (id, currentName, currentDescription, currentIsActive) => {
    setEditingId(id);
    setEditingName(currentName);
    setEditingDescription(currentDescription);
    setEditingIsActive(currentIsActive);
    setIsEditModalOpen(true);
  };

  const handleSaveClick = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`https://localhost:7171/api/DocumentType/UpdatedocumentType?id=${editingId}`, {
        id: editingId,
        docName: editingName,
        description: editingDescription,
        isActive: editingIsActive,
        updatedDate: new Date().toISOString()
      });
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === editingId
            ? {
                ...row,
                docName: editingName,
                description: editingDescription,
                isActive: editingIsActive,
                updatedDate: new Date().toLocaleDateString()
              }
            : row
        )
      );
      setEditingId(null);
      setEditingName("");
      setEditingDescription("");
      setEditingIsActive(true);
      setIsEditModalOpen(false);
      toast.success("Document type updated successfully!");
    } catch (error) {
      console.error("Error updating document type:", error);
      toast.error("Failed to update document type.");
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`https://localhost:7171/api/DocumentType/DeletedocumentType?id=${id}`);
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      toast.success("Document type deleted successfully!");
    } catch (error) {
      console.error("Error deleting document type:", error);
      toast.error("Failed to delete document type.");
    }
  };

  const handleAddDocumentType = async (event) => {
    event.preventDefault();
    try {
      await axios.post('https://localhost:7171/api/DocumentType/AdddocumentType', {
        docName: documentName,
        description: documentDescription,
        isActive,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      });
      toast.success("Document type added successfully!");
      setDocumentName("");
      setDocumentDescription("");
      setIsActive(true);
      fetchDocumentTypes();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding document type:", error);
      toast.error("Failed to add document type.");
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

  const handleToggleChange = (id, isActive) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, isActive } : row
      )
    );
  };

  const filteredRows = rows.filter(row => 
    row.docName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <MDTypography variant="h5" color="white" align="center">Document Type Management</MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <MDInput
                  type="text"
                  label="Search Document Types"
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ marginBottom: '20px' }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={toggleAddModal}
                  style={{ marginBottom: '20px' }}
                >
                  Add New Document Type
                </Button>
                <DataTable table={{
                  columns: [
                    { Header: "Document Name", accessor: "docName", align: "center" },
                    { Header: "Description", accessor: "description", align: "center" },
                    { Header: "Is Active", accessor: "isActive", Cell: ({ row }) => (
                        <Toggle 
                          checked={row.original.isActive}
                          onChange={(e) => handleToggleChange(row.original.id, e.target.checked)}
                        />
                      ), align: "center" 
                    },
                    { Header: "Created Date", accessor: "createdDate", align: "center" },
                    { Header: "Updated Date", accessor: "updatedDate", align: "center" },
                    { Header: "Action", accessor: "action", align: "center" }
                  ],
                  rows: filteredRows
                }} />
              </MDBox>
              <Dialog open={isAddModalOpen} onClose={toggleAddModal} fullWidth maxWidth="sm">
                <DialogTitle>Add New Document Type</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Document Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    required
                  />
                  <TextField
                    margin="dense"
                    label="Description"
                    type="text"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    value={documentDescription}
                    onChange={(e) => setDocumentDescription(e.target.value)}
                    required
                  />
                  <MDBox display="flex" alignItems="center" mt={2}>
                    <MDTypography variant="button">Is Active:</MDTypography>
                    <Toggle
                      checked={isActive}
                      onChange={() => setIsActive(!isActive)}
                      style={{ marginLeft: '10px' }}
                    />
                  </MDBox>
                </DialogContent>
                <DialogActions>
                  <Button onClick={toggleAddModal} color="secondary">Cancel</Button>
                  <Button onClick={handleAddDocumentType} color="primary">Add</Button>
                </DialogActions>
              </Dialog>

              <Dialog open={isEditModalOpen} onClose={toggleEditModal} fullWidth maxWidth="sm">
                <DialogTitle>Edit Document Type</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Document Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    required
                  />
                  <TextField
                    margin="dense"
                    label="Description"
                    type="text"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                    required
                  />
                  <MDBox display="flex" alignItems="center" mt={2}>
                    <MDTypography variant="button">Is Active:</MDTypography>
                    <Toggle
                      checked={editingIsActive}
                      onChange={() => setEditingIsActive(!editingIsActive)}
                      style={{ marginLeft: '10px' }}
                    />
                  </MDBox>
                </DialogContent>
                <DialogActions>
                  <Button onClick={toggleEditModal} color="secondary">Cancel</Button>
                  <Button onClick={handleSaveClick} color="primary">Save</Button>
                </DialogActions>
              </Dialog>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <ToastContainer />
    </DashboardLayout>
  );
};

export default DocumentTypeManagement;
