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
import Select from 'react-select';
import DataTable from "examples/Tables/DataTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSupplier, AddSupplier, UpdateSupplier, DeleteSupplier } from "layouts/Api"; // Adjust path if necessary

const Supplier = () => {
  const [outlets, setOutlets] = useState([]);
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [supplierDetails, setSupplierDetails] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    outletId: null,
  });
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    outletId: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Define modalStyles object here to prevent the ReferenceError
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

  useEffect(() => {
    fetchSupplierTable();
    fetchOutlets();
  }, []);

  const fetchSupplierTable = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(getSupplier, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const fetchedData = response.data || [];
      const outletResponse = await axios.get("https://localhost:7171/api/OutLets/GetOutLets", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const outlets = outletResponse.data.reduce((acc, outlet) => {
        acc[outlet.id] = outlet.outlet_Name;
        return acc;
      }, {});
      setRows(formatRows(fetchedData, outlets));
    } catch (error) {
      console.error("Error fetching supplier data:", error);
      toast.error("Failed to fetch supplier data.");
    }
  };

  const fetchOutlets = async () => {
    try {
      const token = localStorage.getItem("accessToken");
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

  const formatRows = (data, outlets) => {
    return data.map((item) => ({
      id: item.id,
      supplierName: item.supplierName,
      phoneNumber: item.phonenumber,
      address: item.address,
      email: item.email,
      outletName: outlets[item.outletId] || "N/A",
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
      outletId: item.outletId,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${UpdateSupplier}?Id=${editingId}`, {
        id: editingId,
        supplierName: supplierDetails.name,
        phonenumber: supplierDetails.phone,
        address: supplierDetails.address,
        email: supplierDetails.email,
        outletId: supplierDetails.outletId,
      });
      fetchSupplierTable();
      resetEditModal();
      toast.success("Supplier updated successfully!");
    } catch (error) {
      console.error("Error updating supplier:", error);
      toast.error("Failed to update supplier.");
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`${DeleteSupplier}?Id=${id}`);
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
      await axios.post(AddSupplier, {
        supplierName: newSupplier.name,
        phonenumber: newSupplier.phone,
        address: newSupplier.address,
        email: newSupplier.email,
        outletId: newSupplier.outletId,
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
    setSupplierDetails({ name: "", phone: "", address: "", email: "", outletId: null });
    setIsEditModalOpen(false);
  };

  const resetAddModal = () => {
    setNewSupplier({ name: "", phone: "", address: "", email: "", outletId: null });
    setIsAddModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = rows.filter((row) =>
    (row.supplierName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
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
                    { Header: "Supplier Name", accessor: "supplierName", align: "left" },
                    { Header: "Phone", accessor: "phoneNumber", align: "left" },
                    { Header: "Address", accessor: "address", align: "left" },
                    { Header: "Email", accessor: "email", align: "left" },
                    { Header: "Outlet", accessor: "outletName", align: "left" }, // New Outlet column
                    { Header: "Actions", accessor: "action", align: "center" },
                  ],
                  rows: filteredRows,
                }}
                isSorted={false}
                canSearch={false}
              />
              <button style={modalStyles.openModalBtn} onClick={() => setIsAddModalOpen(true)}>
                Add Supplier
              </button>

              {/* Add Supplier Modal */}
              {isAddModalOpen && (
                <div style={modalStyles.modalOverlay}>
                  <div style={modalStyles.modalContainer}>
                    <MDTypography variant="h6">Add Supplier</MDTypography>
                    <form onSubmit={handleAddSupplier}>
                      <MDInput
                        label="Name"
                        value={newSupplier.name}
                        onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                        style={modalStyles.input}
                      />
                      <MDInput
                        label="Phone"
                        value={newSupplier.phone}
                        onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                        style={modalStyles.input}
                      />
                      <MDInput
                        label="Address"
                        value={newSupplier.address}
                        onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                        style={modalStyles.input}
                      />
                      <MDInput
                        label="Email"
                        value={newSupplier.email}
                        onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                        style={modalStyles.input}
                      />
                      <Select
                        options={outlets}
                        placeholder="Select Outlet"
                        onChange={(option) =>
                          setNewSupplier({ ...newSupplier, outletId: option.value })
                        }
                        value={outlets.find((outlet) => outlet.value === newSupplier.outletId)}
                      />
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
                    <MDTypography variant="h6">Edit Supplier</MDTypography>
                    <form onSubmit={handleSaveClick}>
                      <MDInput
                        label="Name"
                        value={supplierDetails.name}
                        onChange={(e) =>
                          setSupplierDetails({ ...supplierDetails, name: e.target.value })
                        }
                        style={modalStyles.input}
                      />
                      <MDInput
                        label="Phone"
                        value={supplierDetails.phone}
                        onChange={(e) =>
                          setSupplierDetails({ ...supplierDetails, phone: e.target.value })
                        }
                        style={modalStyles.input}
                      />
                      <MDInput
                        label="Address"
                        value={supplierDetails.address}
                        onChange={(e) =>
                          setSupplierDetails({ ...supplierDetails, address: e.target.value })
                        }
                        style={modalStyles.input}
                      />
                      <MDInput
                        label="Email"
                        value={supplierDetails.email}
                        onChange={(e) =>
                          setSupplierDetails({ ...supplierDetails, email: e.target.value })
                        }
                        style={modalStyles.input}
                      />
                      <Select
                        options={outlets}
                        placeholder="Select Outlet"
                        onChange={(option) =>
                          setSupplierDetails({ ...supplierDetails, outletId: option.value })
                        }
                        value={outlets.find((outlet) => outlet.value === supplierDetails.outletId)}
                      />
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
