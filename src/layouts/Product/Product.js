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
import { GetProduct, AddProduct, UpdateProduct, DeleteProduct, getSupplier, GetCatagory } from "layouts/Api";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: "",
    price: "",
    category: "",
    barCode: "",
    supplierId: "",
    outlet_Id: "",
    isLowStockWarring: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false });

  useEffect(() => {
    fetchInitialData();
    fetchOutlets();
  }, []);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("User is not authenticated");

      const headers = { Authorization: `Bearer ${token}` };
      const [suppliersResponse, categoriesResponse, productsResponse] = await Promise.all([
        axios.get(getSupplier, { headers }),
        axios.get(GetCatagory, { headers }),
        axios.get(GetProduct, { headers }),
      ]);

      setSuppliers(suppliersResponse.data || []);
      setCategories(categoriesResponse.data || []);
      setProducts(formatProductData(productsResponse.data || []));
    } catch (error) {
      console.error("Error fetching initial data:", error);
      toast.error("Failed to fetch data.");
    }
  };

  const fetchOutlets = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("User is not authenticated");

      const response = await axios.get("https://localhost:7171/api/OutLets/GetOutLets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mappedOutlets = response.data.map((outlet) => ({
        value: outlet.id,
        label: outlet.outlet_Name,
      }));
      setOutlets(mappedOutlets);
    } catch (error) {
      console.error("Error fetching outlet data:", error);
      toast.error("Failed to fetch outlets.");
    }
  };

  const formatProductData = (products) => {
    return products.map((product) => {
      const supplier = suppliers.find((supplier) => supplier.id === product.supplierId);
      const outlet = outlets.find((outlet) => outlet.value === product.outlet_Id);

      return {
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        category: product.categoryName,
        barcode: product.barCode || "N/A",
        outlet_Name: outlet ? outlet.label : "N/A", // Map outlet name if available
        supplier: supplier ? supplier.supplierName : "N/A",
        isLowStockWarring: product.isLowStockWarring || "N/A",
        actions: (
          <>
            <IconButton onClick={() => handleEditClick(product)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteProduct(product.id)}>
              <DeleteIcon />
            </IconButton>
          </>
        ),
      };
    });
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      category: product.categoryId,
      barCode: product.barCode,
      supplierId: product.supplierId,
      outlet_Id: product.outlet_Id,
      isLowStockWarring: product.isLowStockWarring || "",
    });
    setIsModalOpen((prev) => ({ ...prev, edit: true }));
  };

  const handleEditProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("id", editingProduct.id);
    formData.append("ProName", newProduct.name);
    formData.append("ProQuantiy", newProduct.quantity);
    formData.append("ProPrice", newProduct.price);
    formData.append("CatId", newProduct.category);
    formData.append("Barcode", newProduct.barCode);
    formData.append("SupplierId", newProduct.supplierId);
    formData.append("outlet_Id", newProduct.outlet_Id);
    formData.append("IsLowStockWarring", newProduct.isLowStockWarring);

    try {
      await axios.put(UpdateProduct, formData);
      fetchInitialData();
      closeModal();
      toast.success("Product updated successfully!");
    } catch (error) {
      toast.error("Failed to update product.");
    }
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("ProName", newProduct.name);
    formData.append("ProQuantiy", newProduct.quantity);
    formData.append("ProPrice", newProduct.price);
    formData.append("CatId", newProduct.category);
    formData.append("Barcode", newProduct.barCode);
    formData.append("SupplierId", newProduct.supplierId);
    formData.append("outlet_Id", newProduct.outlet_Id);
    formData.append("IsLowStockWarring", newProduct.isLowStockWarring);

    try {
      await axios.post(AddProduct, formData);
      fetchInitialData();
      closeModal();
      toast.success("Product added successfully!");
    } catch (error) {
      toast.error("Failed to add product.");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${DeleteProduct}?Id=${id}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete product.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === "isLowStockWarring" ? parseInt(value, 10) : value,
    }));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const closeModal = () => {
    setIsModalOpen({ add: false, edit: false });
    setEditingProduct(null);
    setNewProduct({
      name: "",
      quantity: "",
      price: "",
      category: "",
      barCode: "",
      supplierId: "",
      outlet_Id: "",
      isLowStockWarring: "",
    });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const modalStyles = {
    label: { display: "flex", flexDirection: "column", flex: 1, fontSize: "11px" },
    button: {
      padding: "10px",
      backgroundColor: "#344767",
      color: "white",
      borderRadius: "5px",
      fontSize: "16px",
    },
    input: { width: "100%", padding: "10px", borderRadius: "5px" },
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
      zIndex: 2000,
    },
    modal: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "10px",
      width: "400px",
      maxWidth: "80%",
      position: "relative",
      zIndex: 2100,
    },
    footer: { display: "flex", justifyContent: "flex-end", marginTop: "20px" },
    submitButton: {
      padding: "10px 20px",
      backgroundColor: "#344767",
      color: "white",
      borderRadius: "5px",
      fontSize: "16px",
    },
    cancelButton: {
      padding: "10px 20px",
      backgroundColor: "#f44336",
      color: "white",
      borderRadius: "5px",
      fontSize: "16px",
      marginRight: "10px",
    },
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <MDTypography variant="h6">Product List</MDTypography>
                <MDInput
                  label="Search"
                  value={searchTerm}
                  onChange={handleSearch}
                  variant="outlined"
                />
                <IconButton onClick={() => setIsModalOpen((prev) => ({ ...prev, add: true }))}>
                  <SaveIcon />
                </IconButton>
              </MDBox>
              <DataTable
                table={{
                  columns: [
                    { Header: "Name", accessor: "name" },
                    { Header: "Quantity", accessor: "quantity" },
                    { Header: "Price", accessor: "price" },
                    { Header: "Category", accessor: "category" },
                    { Header: "Barcode", accessor: "barcode" },
                    { Header: "Supplier", accessor: "supplier" },
                    { Header: "Outlet Name", accessor: "outlet_Name" },
                    { Header: "Low Stock Warning", accessor: "isLowStockWarring" },
                    { Header: "Actions", accessor: "actions" },
                  ],
                  rows: filteredProducts,
                }}
              />
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <ToastContainer />

      {/* Add and Edit Modal */}
      {(isModalOpen.add || isModalOpen.edit) && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct}>
              {/* Input fields for Product details */}
              <label style={modalStyles.label}>
                Outlet
                <select
                  name="outlet_Id"
                  style={modalStyles.input}
                  value={newProduct.outlet_Id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Outlet</option>
                  {outlets.map((outlet) => (
                    <option key={outlet.value} value={outlet.value}>
                      {outlet.label}
                    </option>
                  ))}
                </select>
              </label>
              <div style={modalStyles.footer}>
                <button type="button" onClick={closeModal} style={modalStyles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" style={modalStyles.submitButton}>
                  {editingProduct ? "Update" : "Add"} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Product;
