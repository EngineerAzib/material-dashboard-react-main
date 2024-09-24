import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@mui/material/Modal";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import jsPDF from "jspdf"; // Import jsPDF
import "jspdf-autotable"; // Optional for adding tables to PDF
import { Box } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import { User } from "lucide-react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
const modalStyle = {
  background:"white",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: 24,
  zIndex: 870,
};
const convertToDate = (dateString) => {
  return dateString ? new Date(dateString) : null;
};
const BillingHistory = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(new Date('2024-01-01'));
  const [endDate, setEndDate] = useState(new Date('2024-12-31'));
  const [openEditModal, setOpenEditModal] = useState(false); // For modal
  const [currentRowData, setCurrentRowData] = useState(null);
  useEffect(() => {
    fetchBillingHistory();
  }, []);

  useEffect(() => {
    filterRowsByDate();
  }, [startDate, endDate]);

  const fetchBillingHistory = async () => {
    try {
      const response = await axios.get("https://localhost:7171/api/Billing/GetBilling");
      console.log(response);
      const fetchedData = response.data || [];
      setRows(formatRows(fetchedData));
      setFilteredRows(formatRows(fetchedData));
    } catch (error) {
      console.error("Error fetching billing data:", error);
      toast.error("Failed to fetch billing data.",{containerId:"SaleHistory"});
    }
  };
  const userId = localStorage.getItem("userId");
  const formatRows = (data) => {
    return data.map((item) => ({
      id:item.id,
      UserId: userId, 
     // id: item.paymentId,
      billername: item.billername,
      billingDate: new Date(item.billingDate).toLocaleDateString(),
      invoiceNo: item.invoiceNo, // Add invoiceNo here
      barCodeNumber: item.barCodeNumber, // Add barCodeNumber here
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalAmount: item.totalAmount,
      paymentAmount: item.paymentAmount,
      status: item.status,
    }));
  };
  const handleEdit = (rowData) => {
    setCurrentRowData({
      ...rowData,
      billingDate: convertToDate(rowData.billingDate),
    });
    setOpenEditModal(true); // Open modal
  };
  const handleEditSubmit = async () => {
    try {
      // Parse billingDate to ensure it's a valid Date object if it's not already
      const updatedData = {
        ...currentRowData,
        billingDate: currentRowData.billingDate || null,
        invoiceNo: currentRowData.invoiceNo,
        barCodeNumber: currentRowData.barCodeNumber,
        billername: currentRowData.billername,
        quantity: currentRowData.quantity,
        unitPrice: currentRowData.unitPrice,
        totalAmount: currentRowData.totalAmount,
        paymentAmount: currentRowData.paymentAmount,
        status: currentRowData.status,
      };
  
      await axios.put(`https://localhost:7171/api/Billing/UpdateBilling?id=${currentRowData.id}`, currentRowData);
      toast.success("Billing record updated successfully.",{containerId:"SaleHistory"});
      fetchBillingHistory();
      setOpenEditModal(false); // Close modal after successful update
    } catch (error) {
      console.error("Error updating billing record:", error);
      toast.error("Failed to update billing record.",{containerId:"SaleHistory"});
    }
  };
  const handleFieldChange = (field, value) => {
    setCurrentRowData({ ...currentRowData, [field]: value });
  };

  const formatDateToString = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2); // Adding leading zero if needed
    const day = ('0' + d.getDate()).slice(-2); // Adding leading zero if needed
    return `${year}-${month}-${day}`;
  };
  const filterRowsByDate = () => {
    const startDateFormatted = formatDateToString(startDate);
    const endDateFormatted = formatDateToString(endDate);
  
    const filtered = rows.filter((row) => {
      const billingDateFormatted = formatDateToString(row.billingDate);
      return billingDateFormatted >= startDateFormatted && billingDateFormatted <= endDateFormatted;
    });
    setFilteredRows(filtered);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSearchRows = filteredRows.filter((row) =>
    (row.billername || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDFForRow = (row) => {
    const doc = new jsPDF();
    doc.text("Billing History", 10, 10);
    console.log("Filtered Rows for PDF:", filteredSearchRows);
    // Prepare the data for the table
    const tableColumn = ["Invoice No", "BarCode", "Biller Name", "Billing Date", "Quantity", "Unit Price", "Total Amount", "Payment Amount", "Status"];
    const tableRows = [
      [
        row.invoiceNo,
        row.barCodeNumber,
        row.billername,
        row.billingDate,
        row.quantity,
        row.unitPrice,
        row.totalAmount,
        row.paymentAmount,
        row.status,
      ],
    ];

    // Add the table to the PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save(`billing_history_${row.id}.pdf`);
  };
  const generatePDFForAllRows = (rowsData) => {
    const doc = new jsPDF();
    doc.text("Billing History - All Rows", 10, 10);

    const tableColumn = ["Invoice No", "BarCode", "Biller Name", "Billing Date", "Quantity", "Unit Price", "Total Amount", "Payment Amount", "Status"];
    const tableRows = rowsData.map((row) => [
      row.invoiceNo,
      row.barCodeNumber,
      row.billername,
      row.billingDate,
      row.quantity,
      row.unitPrice,
      row.totalAmount,
      row.paymentAmount,
      row.status,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("billing_history_all.pdf");
  };
  const handleDelete = async (id) => {
    try {
      const del=await axios.delete(`https://localhost:7171/api/Billing/DeleteBilling?id=${id}`);
      toast.success("Billing record deleted successfully.",{containerId:"SaleHistory"});
      fetchBillingHistory();
      console.log(del)
    } catch (error) {
      console.error("Error deleting billing record:", error);
      toast.error("Failed to delete billing record.",{containerId:"SaleHistory"});
    }
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
                  Billing History
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <MDInput
                  label="Search by Biller Name"
                  value={searchTerm}
                  onChange={handleSearch}
                  fullWidth
                />
              </MDBox>

              {/* Date Range Inputs */}
              <MDBox p={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <DatePicker
                        label="From"
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                        renderInput={(params) => <MDInput fullWidth {...params} />}
                        openTo="year"
                        inputFormat="yyyy-MM-dd"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <DatePicker
                        label="To"
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                        renderInput={(params) => <MDInput fullWidth {...params} />}
                        openTo="year"
                        inputFormat="yyyy-MM-dd"
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              </MDBox>

              <MDBox p={2} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  onClick={() => generatePDFForAllRows(filteredSearchRows)}
                  //onClick={() => generatePDF(filteredSearchRows[0])} // Adjust as needed for a specific row
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: "6px 12px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    borderRadius: "4px",
                    marginLeft: "790px",
                    marginRight: "auto",
                    display: "block",
                    marginTop: "-70px",
                    height:"10px"
                  }}
                >
                  Download PDF
                </Button>
              </MDBox>

              <DataTable
                table={{
                  columns: [
                    { Header: "InvoiceNumber", accessor: "invoiceNo", width: "15%", align: "left"},
                    { Header: "BarCodeNumber", accessor: "barCodeNumber", width: "15%", align: "left"},
                    { Header: "Biller Name", accessor: "billername", width: "15%", align: "left" },
                    { Header: "Billing Date", accessor: "billingDate", width: "15%", align: "left" },
                    { Header: "Quantity", accessor: "quantity", width: "10%", align: "right" },
                    { Header: "Unit Price", accessor: "unitPrice", width: "15%", align: "right" },
                    { Header: "Total Amount", accessor: "totalAmount", width: "15%", align: "right" },
                    { Header: "Payment Amount", accessor: "paymentAmount", width: "15%", align: "right" },
                    { Header: "Status", accessor: "status", width: "10%", align: "center" },
                    { Header: "Action", accessor: "action", width: "20%", align: "center", Cell: ({ row }) => (
                      <div>
                        <Button
                          variant="contained"
                          onClick={() => generatePDFForRow(row.original)}
                          style={{ backgroundColor: "red", color: "white", marginRight: "5px" }}
                        >
                          Download PDF
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => handleEdit(row.original)}
                          style={{ backgroundColor: "blue", color: "white", marginRight: "5px" }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => handleDelete(row.original.id)}
                          style={{ backgroundColor: "gray", color: "white" }}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  ],
                  rows: filteredSearchRows,
                }}
                isSorted={false}
                canSearch={false}
              />
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <ToastContainer containerId="SaleHistory" position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      {/* Edit Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box sx={modalStyle}>
          <MDTypography variant="h6" mb={2}>
            Edit Billing Record
          </MDTypography>
          <Grid container spacing={2}>
            {/* Row 1: Invoice Number, Bar Code Number, Biller Name */}
            <Grid item xs={4}>
              <MDInput
                label="Invoice Number"
                value={currentRowData?.invoiceNo || "" }
                onChange={(e) => handleFieldChange("invoiceNo", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <MDInput
                label="Bar Code Number"
                value={currentRowData?.barCodeNumber || ""}
                onChange={(e) => handleFieldChange("barCodeNumber", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <MDInput
                label="Biller Name"
                value={currentRowData?.billername || ""}
                onChange={(e) => handleFieldChange("billername", e.target.value)}
                fullWidth
              />
            </Grid>

                {/* Row 2: Billing Date, Quantity, Unit Price */}
                      <Grid item xs={4}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Billing Date & Time"
            value={currentRowData?.billingDate || null} // Ensure it's a Date object or null
            onChange={(date) => handleFieldChange("billingDate", date)} // Update the field with selected date and time
            renderInput={(params) => <MDInput fullWidth {...params} />}
          />
        </LocalizationProvider>
      </Grid>


            <Grid item xs={4}>
              <MDInput
                label="Quantity"
                value={currentRowData?.quantity || ""}
                onChange={(e) => handleFieldChange("quantity", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <MDInput
                label="Unit Price"
                value={currentRowData?.unitPrice || ""}
                onChange={(e) => handleFieldChange("unitPrice", e.target.value)}
                fullWidth
              />
            </Grid>

            {/* Row 3: Total Amount, Payment Amount, Status */}
            <Grid item xs={4}>
              <MDInput
                label="Total Amount"
                value={currentRowData?.totalAmount || ""}
                onChange={(e) => handleFieldChange("totalAmount", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <MDInput
                label="Payment Amount"
                value={currentRowData?.paymentAmount || ""}
                onChange={(e) => handleFieldChange("paymentAmount", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <MDInput
                label="Status"
                value={currentRowData?.status || ""}
                onChange={(e) => handleFieldChange("status", e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>

          {/* Save Button */}
          <Box mt={3}>
            <Button variant="contained" onClick={handleEditSubmit} style={{ backgroundColor: "green", color: "white" }}>
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>
    </DashboardLayout>
  );
};

export default BillingHistory;
