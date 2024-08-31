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

const Supplier = () => {
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [supplierDetails, setSupplierDetails] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchSupplierTable();
  }, []);

  const fetchSupplierTable = async () => {
    try {
      const response = await axios.get("https://localhost:7171/api/Supplier/GetSupplier");
      console.log(response);
      const fetchedData = response.data || [];
      setRows(formatRows(fetchedData));
    } catch (error) {
      console.error("Error fetching supplier data:", error);
      toast.error("Failed to fetch supplier data.");
    }
  };

  const formatRows = (data) => {
    return data.map((item) => ({
      id: item.id,
      supplierName: item.supplierName,
      phoneNumber: item.phonenumber, // Ensure this matches the column accessor
      address: item.address,
      email: item.email,
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
    setSupplierDetails({
      name: item.supplierName,
      phone: item.phonenumber,
      address: item.address,
      email: item.email,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://localhost:7171/api/Supplier/UpdateSupplier?Id=${editingId}`, {
        id: editingId,
        supplierName: supplierDetails.name,
        phonenumber: supplierDetails.phone,
        address: supplierDetails.address,
        email: supplierDetails.email,
      });
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === editingId
            ? {
                ...row,
                supplierName: supplierDetails.name,
                phoneNumber: supplierDetails.phone,
                address: supplierDetails.address,
                email: supplierDetails.email,
              }
            : row
        )
      );
      resetEditModal();
      toast.success("Supplier updated successfully!");
    } catch (error) {
      console.error("Error updating supplier:", error);
      toast.error("Failed to update supplier.");
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`https://localhost:7171/api/Supplier/DeleteSupplier?id=${id}`);
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      toast.success("Supplier deleted successfully!");
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast.error("Failed to delete supplier.");
    }
  };

  const handleAddSupplier = async (event) => {
    event.preventDefault();
    try {
      await axios.post("https://localhost:7171/api/Supplier/AddSupplier", {
        supplierName: newSupplier.name,
        phonenumber: newSupplier.phone,
        address: newSupplier.address,
        email: newSupplier.email,
      });
      toast.success("Supplier added successfully!");
      resetAddModal();
      fetchSupplierTable();
    } catch (error) {
      console.error("Error adding supplier:", error);
      toast.error("Failed to add supplier.");
    }
  };

  const resetEditModal = () => {
    setEditingId(null);
    setSupplierDetails({ name: "", phone: "", address: "", email: "" });
    setIsEditModalOpen(false);
  };

  const resetAddModal = () => {
    setNewSupplier({ name: "", phone: "", address: "", email: "" });
    setIsAddModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = rows.filter((row) =>
    (row.supplierName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const modalStyles = {
    openModalBtn: {
      padding: "10px 20px",
      backgroundColor: "#344767",
      color: "white",
      border: "none",
      cursor: "pointer",
      borderRadius: "5px",
      fontSize: "16px",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContainer: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "10px",
      width: "400px",
      maxWidth: "80%",
      position: "relative",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    closeModalBtn: {
      background: "none",
      border: "none",
      fontSize: "24px",
      cursor: "pointer",
    },
    formGroup: { marginBottom: "15px" },
    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    submitBtn: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#344767",
      color: "white",
      border: "none",
      cursor: "pointer",
      borderRadius: "5px",
      fontSize: "16px",
    },
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Supplier Management
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <MDInput
                  label="Search Supplier"
                  value={searchTerm}
                  onChange={handleSearch}
                  fullWidth
                />
              </MDBox>
              <DataTable
                table={{
                  columns: [
                    {
                      Header: "Supplier Name",
                      accessor: "supplierName", // Ensure this matches the row data field
                      width: "45%",
                      align: "left",
                    },
                    { Header: "Phone", accessor: "phoneNumber", width: "25%", align: "left" },
                    { Header: "Address", accessor: "address", width: "20%", align: "left" },
                    { Header: "Email", accessor: "email", width: "20%", align: "left" },
                    { Header: "Actions", accessor: "action", width: "15%", align: "center" },
                  ],
                  rows: filteredRows,
                }}
                isSorted={false}
                canSearch={false}
              />
              <button
                style={modalStyles.openModalBtn}
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Supplier
              </button>
              {/* Add Supplier Modal */}
              {isAddModalOpen && (
                <div style={modalStyles.modalOverlay}>
                  <div style={modalStyles.modalContainer}>
                    <div style={modalStyles.modalHeader}>
                      <MDTypography variant="h6">Add Supplier</MDTypography>
                      <button style={modalStyles.closeModalBtn} onClick={resetAddModal}>
                        &times;
                      </button>
                    </div>
                    <form onSubmit={handleAddSupplier}>
                      <div style={modalStyles.formGroup}>
                        <MDInput
                          label="Name"
                          value={newSupplier.name}
                          onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                          style={modalStyles.input}
                        />
                      </div>
                      <div style={modalStyles.formGroup}>
                        <MDInput
                          label="Phone"
                          value={newSupplier.phone}
                          onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                          style={modalStyles.input}
                        />
                      </div>
                      <div style={modalStyles.formGroup}>
                        <MDInput
                          label="Address"
                          value={newSupplier.address}
                          onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                          style={modalStyles.input}
                        />
                      </div>
                      <div style={modalStyles.formGroup}>
                        <MDInput
                          label="Email"
                          value={newSupplier.email}
                          onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                          style={modalStyles.input}
                        />
                      </div>
                      <button type="submit" style={modalStyles.submitBtn}>
                        Add Supplier
                      </button>
                    </form>
                  </div>
                </div>
              )}
              {/* Edit Supplier Modal */}
              {isEditModalOpen && (
                <div style={modalStyles.modalOverlay}>
                  <div style={modalStyles.modalContainer}>
                    <div style={modalStyles.modalHeader}>
                      <MDTypography variant="h6">Edit Supplier</MDTypography>
                      <button style={modalStyles.closeModalBtn} onClick={resetEditModal}>
                        &times;
                      </button>
                    </div>
                    <form onSubmit={handleSaveClick}>
                      <div style={modalStyles.formGroup}>
                        <MDInput
                          label="Name"
                          value={supplierDetails.name}
                          onChange={(e) => setSupplierDetails({ ...supplierDetails, name: e.target.value })}
                          style={modalStyles.input}
                        />
                      </div>
                      <div style={modalStyles.formGroup}>
                        <MDInput
                          label="Phone"
                          value={supplierDetails.phone}
                          onChange={(e) => setSupplierDetails({ ...supplierDetails, phone: e.target.value })}
                          style={modalStyles.input}
                        />
                      </div>
                      <div style={modalStyles.formGroup}>
                        <MDInput
                          label="Address"
                          value={supplierDetails.address}
                          onChange={(e) => setSupplierDetails({ ...supplierDetails, address: e.target.value })}
                          style={modalStyles.input}
                        />
                      </div>
                      <div style={modalStyles.formGroup}>
                        <MDInput
                          label="Email"
                          value={supplierDetails.email}
                          onChange={(e) => setSupplierDetails({ ...supplierDetails, email: e.target.value })}
                          style={modalStyles.input}
                        />
                      </div>
                      <button type="submit" style={modalStyles.submitBtn}>
                        Save Changes
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

export default Supplier;
