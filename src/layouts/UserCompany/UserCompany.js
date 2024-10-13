import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "react-data-table-component";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { Card, Grid } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { GetUserCompany,GetOutLets,UpdateUserCompany,AddOutLets,DeleteUserCompany } from "layouts/Api";
const UserCompany = () => {
  const [companies, setCompanies] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [newCompany, setNewCompany] = useState({
    userName: "",
    email: "",
    password: "",
    company_Name: "",
    company_Owner_Name: "",
    company_Owner_PhoneNumber: "",
    company_Owner_Email: "",
    isActive: true,
    created_Date: "",  // You may want to set this as the current date
    updated_Date: "",  // Automatically updated, can be set to an empty string initially
    outlet_Name: "",
    outlet_Address: "",
    outlet_Phone_Number: "",
    outlet_Owner_Name: "",
    company_Id: 0,  // Will be populated after creating the company
  });
  
  const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false });
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch companies
  useEffect(() => {
    fetchInitialData();
  }, []);
  const fetchInitialData = async () => {
    try {
        const [companyResponse, outletResponse] = await Promise.all([
            axios.get(GetUserCompany),
            axios.get(GetOutLets),
        ]);
        
        const companies = companyResponse.data;
        const outlets = outletResponse.data;

        // Map outlets to their corresponding companies
        const companiesWithOutlets = companies.map(company => ({
            ...company,
            outlets: outlets.filter(outlet => outlet.company_Id === company.id) // Adjust this based on your data structure
        }));

        setCompanies(companiesWithOutlets);
    } catch (error) {
        toast.error("Failed to fetch data.");
        console.error("Error fetching data:", error);
    }
};

  const handleCompanySubmit = async (event, isEdit) => {
    event.preventDefault();
    
    try {
      let companyResponse;
      if (isEdit) {
        companyResponse = await axios.put(
          `${UpdateUserCompany}?id=${editingCompany.id}`,
          newCompany
        );
        toast.success("Company updated successfully!");
      } else {
        companyResponse = await axios.post(
          AddUserCompany,
          newCompany
        );
        toast.success("Company added successfully!");
      }
  
      // Ensure you capture the company ID correctly
      const companyId = companyResponse.data.id; // Assuming the response contains the ID
  
      // Outlet payload can be constructed based on the companyId
      const outletPayload = {
        outlet_Name: newCompany.outlet_Name,
        outlet_Address: newCompany.outlet_Address,
        outlet_Phone_Number: newCompany.outlet_Phone_Number,
        outlet_Owner_Name: newCompany.outlet_Owner_Name,
        company_Id: companyId,
        created_Date: newCompany.created_Date,
        updated_Date: newCompany.updated_Date,
      };
      
      await axios.post(AddOutLets, outletPayload);
      fetchCompanies(); // Refresh the list
      closeModal();
    } catch (error) {
      toast.error(isEdit ? "Failed to update company." : "Failed to add company.");
      console.error(error);
    }
  };
  

  // Delete Company
  const handleDeleteCompany = async (id) => {
    try {
      await axios.delete(`${DeleteUserCompany}?id=${id}`);
      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company.id !== id)
      );
      toast.success("Company deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete company.");
    }
  };

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Search Companies
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Close Modal and Reset States
  const closeModal = () => {
    setIsModalOpen({ add: false, edit: false });
    setEditingCompany(null);
    setNewCompany({
      name: "",
      address: "",
      email: "",
      contact: "",
    });
  };

  // Filtered Companies
const filteredCompanies = companies.filter((company) =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const columns = [
    { name: "Company Name", selector: "company_Name", sortable: true },
    { name: "Owner Name", selector: "company_Owner_Name", sortable: true },
    { name: "Owner Phone", selector: "company_Owner_PhoneNumber", sortable: true },
    { name: "Owner Email", selector: "company_Owner_Email", sortable: true },
    { name: "Is Active", selector: "isActive", cell: row => (row.isActive ? "Yes" : "No"), sortable: true },
    { name: "Created Date", selector: "created_Date", sortable: true },
    { name: "Updated Date", selector: "updated_Date", sortable: true },
    {
        name: "Outlets",
        selector: "outlets",
        cell: row => (
            <ul>
                {row.outlets.map(outlet => (
                    <li key={outlet.id}>{outlet.outlet_Name}</li>
                ))}
            </ul>
        ),
        sortable: false,
    },
];

  

  const modalStyles = {
    label: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      marginRight: "10px",
      fontSize: "11px",
    },
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
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 8999,
      overflowY: "hidden",
    },
    modal: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "10px",
      width: "600px",
      maxWidth: "90%",
      position: "relative",
      zIndex: 1100,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
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
      width: "100%",
      height: "45px",
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
                  Companies
                </MDTypography>
                <MDBox mb={3} display="flex" justifyContent="space-between">
                  <MDInput
                    type="text"
                    label="Search Companies"
                    onChange={handleSearch}
                    value={searchTerm}
                  />
                  <button
                    style={modalStyles.button}
                    onClick={() => setIsModalOpen({ ...isModalOpen, add: true })}
                  >
                    Add New Company
                  </button>
                </MDBox>
                <DataTable
                  table={{ columns, rows: filteredCompanies }}
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
          {isModalOpen.edit ? "Edit Company" : "Add New Company & Outlet"}
        </MDTypography>
        <button style={modalStyles.closeButton} onClick={() => closeModal()}>
          &times;
        </button>
      </div>
      <form onSubmit={(e) => handleCompanySubmit(e, isModalOpen.edit)}>
        <div style={modalStyles.gridContainer}>
          {/* User Fields */}
          <label style={modalStyles.label}>
            User Name
            <MDInput
              type="text"
              name="userName"
              value={newCompany.userName}
              onChange={handleInputChange}
              placeholder="User Name"
              style={modalStyles.input}
            />
          </label>
          <label style={modalStyles.label}>
            Email
            <MDInput
              type="email"
              name="email"
              value={newCompany.email}
              onChange={handleInputChange}
              placeholder="Email"
              style={modalStyles.input}
            />
          </label>
          <label style={modalStyles.label}>
            Password
            <MDInput
              type="password"
              name="password"
              value={newCompany.password}
              onChange={handleInputChange}
              placeholder="Password"
              style={modalStyles.input}
            />
          </label>

          {/* Company Fields */}
          <label style={modalStyles.label}>
            Company Name
            <MDInput
              type="text"
              name="company_Name"
              value={newCompany.company_Name}
              onChange={handleInputChange}
              placeholder="Company Name"
              style={modalStyles.input}
            />
          </label>
          <label style={modalStyles.label}>
            Company Owner Name
            <MDInput
              type="text"
              name="company_Owner_Name"
              value={newCompany.company_Owner_Name}
              onChange={handleInputChange}
              placeholder="Company Owner Name"
              style={modalStyles.input}
            />
          </label>
          <label style={modalStyles.label}>
            Owner Phone Number
            <MDInput
              type="text"
              name="company_Owner_PhoneNumber"
              value={newCompany.company_Owner_PhoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              style={modalStyles.input}
            />
          </label>
          <label style={modalStyles.label}>
            Owner Email
            <MDInput
              type="email"
              name="company_Owner_Email"
              value={newCompany.company_Owner_Email}
              onChange={handleInputChange}
              placeholder="Owner Email"
              style={modalStyles.input}
            />
          </label>
          <label style={modalStyles.label}>
            Is Active
            <select
              name="isActive"
              value={newCompany.isActive}
              onChange={handleInputChange}
              style={modalStyles.select}
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </label>

          {/* Outlet Fields */}
          <label style={modalStyles.label}>
            Outlet Name
            <MDInput
              type="text"
              name="outlet_Name"
              value={newCompany.outlet_Name}
              onChange={handleInputChange}
              placeholder="Outlet Name"
              style={modalStyles.input}
            />
          </label>
          <label style={modalStyles.label}>
            Outlet Address
            <MDInput
              type="text"
              name="outlet_Address"
              value={newCompany.outlet_Address}
              onChange={handleInputChange}
              placeholder="Outlet Address"
              style={modalStyles.input}
            />
          </label>
          <label style={modalStyles.label}>
            Outlet Phone Number
            <MDInput
              type="text"
              name="outlet_Phone_Number"
              value={newCompany.outlet_Phone_Number}
              onChange={handleInputChange}
              placeholder="Phone Number"
              style={modalStyles.input}
            />
          </label>
          <label style={modalStyles.label}>
            Outlet Owner Name
            <MDInput
              type="text"
              name="outlet_Owner_Name"
              value={newCompany.outlet_Owner_Name}
              onChange={handleInputChange}
              placeholder="Outlet Owner Name"
              style={modalStyles.input}
            />
          </label>

          {/* Timestamps */}
          <label style={modalStyles.label}>
            Created Date
            <MDInput
              type="datetime-local"
              name="created_Date"
              value={newCompany.created_Date}
              onChange={handleInputChange}
              style={modalStyles.input}
            />
          </label>
          <label style={modalStyles.label}>
            Updated Date
            <MDInput
              type="datetime-local"
              name="updated_Date"
              value={newCompany.updated_Date}
              onChange={handleInputChange}
              style={modalStyles.input}
            />
          </label>
        </div>
        <div style={modalStyles.footer}>
          <button
            type="button"
            style={modalStyles.cancelButton}
            onClick={() => closeModal()}
          >
            Cancel
          </button>
          <button type="submit" style={modalStyles.button}>
            {isModalOpen.edit ? "Update" : "Add"}
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

export default UserCompany;
