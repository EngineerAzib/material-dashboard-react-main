import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetOutLets, GetCompany } from "layouts/Api";

const OutletSetting = () => {
  const [outlets, setOutlets] = useState([]);
  const [companies, setCompanies] = useState([]); // State to store companies
  const [searchTerm, setSearchTerm] = useState("");

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
      const response = await axios.get(GetOutLets, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Response Data:", response); // Log the response data
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

  // Search functionality
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOutlets = outlets.filter(
    (outlet) => outlet.email && outlet.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { Header: "Outlet Name", accessor: "outlet_Name" },
    { Header: "Address", accessor: "outlet_Address" },
    { Header: "Phone Number", accessor: "outlet_Phone_Number" },
    { Header: "Owner", accessor: "outlet_Owner_Name" },
    { Header: "Email", accessor: "email" },
    { Header: "Company Name", accessor: "company_Name" }
  ];

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
                </MDBox>
                <DataTable
                  table={{
                    columns,
                    rows: filteredOutlets
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
      <ToastContainer />
    </DashboardLayout>
  );
};

export default OutletSetting;
