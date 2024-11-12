import React, { useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DatabaseBackup = () => {
  const [backups, setBackups] = useState([]);

  // Function to trigger the backup API and add the result to the backup list
//   const handleBackup = async () => {
//     try {
//       const response = await axios.post("https://localhost:7171/api/DatabaseBackUp/backup");

//       // Assuming the API returns the backup file URL in response.data.url
//       const backupUrl = response.data.url; // Adjust according to your API response
//       const backupDate = new Date().toLocaleString(); // Store the current date and time

//       // Update the backup list to keep the latest 5 backups only
//       setBackups((prevBackups) => [
//         { date: backupDate, url: backupUrl },
//         ...prevBackups.slice(0, 4)
//       ]);

//       toast.success("Backup created successfully!", { autoClose: 2000 });
//     } catch (error) {
//       toast.error("Failed to create backup.", { autoClose: 2000 });
//     }
//   };
const handleBackup = async () => {
    try {
      const response = await axios.post("https://localhost:7171/api/DatabaseBackUp/backup", null, {
        responseType: "blob", // Set response type to blob to handle binary data
      });
  
      const backupDate = new Date().toLocaleString(); // Get current date and time for display
  
      // Create a URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
  
      // Extract filename from the headers if possible, otherwise use a default name
      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].split(";")[0].replace(/"/g, "")
        : `backup_${backupDate}.bacpac`;
  
      link.setAttribute("download", filename); // Set download attribute with the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      // Add backup entry to the table
      setBackups((prevBackups) => [
        { date: backupDate, url }, // Use the Blob URL in case user wants to download again
        ...prevBackups.slice(0, 4),
      ]);
  
      toast.success("Backup created successfully!", { autoClose: 2000 });
    } catch (error) {
      toast.error("Failed to create backup.", { autoClose: 2000 });
    }
  };
  

  // Define columns for the DataTable
  const backupColumns = [
    { Header: "Backup Date", accessor: "date", align: "left" },
    { Header: "Download Link", accessor: "url", align: "center" },
  ];

  // Map backups to rows for DataTable
  const backupRows = backups.map((backup) => ({
    date: backup.date,
    url: (
      <Button
        variant="outlined"
        style={addButtonStyle}
        onClick={() => {
          const link = document.createElement("a");
          link.href = backup.url;
          link.setAttribute("download", "backup.bacpac"); // This will prompt download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
      >
        Download
      </Button>
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
                <MDTypography variant="h6" color="white">
                  Database Backups
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <Button
                  variant="contained"
                  onClick={handleBackup}
                  style={addButtonStyle}
                >
                  Create Backup
                </Button>
                <DataTable
                  table={{
                    columns: backupColumns,
                    rows: backupRows,
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

// Custom button styling
const addButtonStyle = {
  backgroundColor: "#1A73E8",
  color: "#FFF",
  padding: "8px 16px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  textTransform: "none",
};

export default DatabaseBackup;
