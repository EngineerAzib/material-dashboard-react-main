/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DataTable() {
  const [rows, setRows] = useState([]); // Default to empty array
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    axios.get("https://localhost:7171/GetCategory")
      .then((response) => {
        const fetchedData = response.data || []; // Ensure it's an array
        console.log("Fetched Data:", fetchedData); // Log fetched data

        const formattedRows = fetchedData.map((category) => ({
          id: category.id,
          category: category.catName,
          action: (
            <>
              <IconButton onClick={() => handleEditClick(category.id, category.catName)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteClick(category.id)}>
                <DeleteIcon />
              </IconButton>
            </>
          ),
        }));

        setRows(formattedRows);
      })
      .catch((error) => {
        console.error("Error fetching category data:", error);
        toast.error("Failed to fetch categories.");
      });
  }, []);

  const handleEditClick = (id, currentName) => {
    setEditingId(id);
    setEditingName(currentName);
    console.log("Editing ID:", id, "Editing Name:", currentName); // Log current ID and name
  };

  const handleSaveClick = () => {
    console.log("Data being sent:", { id: editingId, catName: editingName });
    const url = `https://localhost:7171/UpdateCategory?Id=${editingId}&CatName=${editingName}`;

    console.log("Sending PUT request to URL:", url); // Log URL

    axios.put(url, {
        id: editingId,
        catName: editingName
      })
      .then((response) => {
        console.log("Response from server:", response); // Log server response

        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === editingId ? { ...row, category: editingName } : row
          )
        );
        setEditingId(null); // Exit editing mode
        setEditingName(""); // Clear the input field
        toast.success("Category updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating category:", error); // Log error
        toast.error("Failed to update category.");
      });
  };

  const handleDeleteClick = (id) => {
    const url = `https://localhost:7171/DeleteCategory?id=${id}`;

    axios.delete(url)
      .then(() => {
        setRows((prevRows) =>
          prevRows.filter((row) => row.id !== id)
        );
        toast.success("Category deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category.");
      });
  };

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

  const formattedRows = rows && rows.map((row) => ({
    ...row,
    category: (
      <Category
        name={row.category}
        isEditing={row.id === editingId}
      />
    ),
    action: row.id === editingId ? (
      <IconButton onClick={handleSaveClick}>
        <SaveIcon />
      </IconButton>
    ) : (
      <>
        {row.action}
      </>
    ),
  }));

  return {
    columns: [
      { Header: "Category", accessor: "category", width: "45%", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: formattedRows,
  };
}
