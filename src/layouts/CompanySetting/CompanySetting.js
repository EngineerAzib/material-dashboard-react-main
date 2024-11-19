import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CompanySetting = () => {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUserCompanies();
  }, []);

  // Fetch data
  const fetchUserCompanies = async () => {
    try {
      const response = await axios.get("https://localhost:7171/api/Auth/all");
      setRows(formatRows(response.data || []));
    } catch (error) {
      toast.error("Failed to fetch user companies data.", { autoClose: 2000 });
    }
  };

  const formatRows = (data) => {
    return data.map((item) => ({
      userId: item.userId,
      userName: item.userName,
      email: item.email,
      companyName: item.companyName,
      ownerName: item.ownerName,
      ownerEmail: item.ownerEmail,
      ownerPhoneNumber: item.ownerPhoneNumber,
    }));
  };

  // Search functionality
  const handleSearch = (event) => setSearchTerm(event.target.value);

  const filteredRows = rows.filter((row) =>
    row.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <MDTypography variant="h6" color="white">
                  User Companies
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <input
                   type="text"
                   placeholder="Search User Company"
                   style={searchStyle}
                   value={searchTerm}
                   onChange={handleSearch}
                />
                <DataTable
                  table={{
                    columns: [
                      { Header: "Username", accessor: "userName", align: "left" },
                      { Header: "Email", accessor: "email", align: "center" },
                      { Header: "Company Name", accessor: "companyName", align: "center" },
                      { Header: "Owner Name", accessor: "ownerName", align: "center" },
                      { Header: "Owner Email", accessor: "ownerEmail", align: "center" },
                      { Header: "Owner Phone Number", accessor: "ownerPhoneNumber", align: "center" },
                    ],
                    rows: filteredRows,
                  }}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        <ToastContainer />
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

const searchStyle = {
    marginBottom: "10px",
    marginRight: "10px",
    height:"40px"
  };

export default CompanySetting;
