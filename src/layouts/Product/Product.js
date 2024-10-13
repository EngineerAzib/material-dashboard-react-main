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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GetProduct,AddProduct,UpdateProduct ,DeleteProduct,getSupplier,GetCatagory } from "layouts/Api";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: "",
    price: "",
    category: "",
    // image: null,
    barCode: "",
    supplierId: "",
    isLowStockWarring: "", // New field for low stock warning
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [suppliersResponse, categoriesResponse, productsResponse] = await Promise.all([
        axios.get(getSupplier),
        axios.get(GetCatagory),
        axios.get(GetProduct),
      ]);
      setSuppliers(suppliersResponse.data || []);
      setCategories(categoriesResponse.data || []);
      setProducts(formatProductData(productsResponse.data || [], suppliersResponse.data || []));
    } catch (error) {
      toast.error("Failed to fetch data.");
    }
  };

  const formatProductData = (products, suppliers) => {
    return products.map((product) => {
      const supplier = suppliers.find(supplier => supplier.id === product.supplierId);
      return {
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        category: product.categoryName,
        // image: product.image.includes('/images/') ? `https://localhost:7171${product.image}` : product.image,
        barcode: product.barCode || "N/A",
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

  const generateBarcode = () => {
    const barCode = Math.floor(1000000 + Math.random() * 9000000).toString();
    setNewProduct((prev) => ({ ...prev, barCode }));
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
      // image: product.image.includes('https') ? product.image : null,
      isLowStockWarring: product.isLowStockWarring || "", // Populate the field with existing data
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
    formData.append("IsLowStockWarring", newProduct.isLowStockWarring); // Include low stock warning
    // if (newProduct.image) formData.append("imageFile", newProduct.image);

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
    formData.append("IsLowStockWarring", newProduct.isLowStockWarring); // Include low stock warning
    // if (newProduct.image) formData.append("imageFile", newProduct.image);

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
    const { name, value, files } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === "isLowStockWarring" ? parseInt(value, 10) : files ? files[0] : value,
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
      // image: null,
      isLowStockWarring: "", // Reset on close
    });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  
  const modalStyles = {
    label :{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      marginRight: '10px', /* Or any spacing you need */
      fontSize:"11px"
    },
    button: {
      padding: '10px',
        backgroundColor: '#344767',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
        fontSize: '16px',
        marginleft: '10px',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
  },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000, // Increase z-index value to ensure modal appears above other content
    },
    modal: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        width: '400px',
        maxWidth: '80%',
        position: 'relative',
        zIndex: 2100, // Optional: set z-index for modal itself
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#344767',
    },
    inputContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px', // Space between the input fields
        marginBottom: '15px',
    },
   
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '20px',
    },
    submitButton: {
        padding: '10px 20px',
        backgroundColor: '#344767',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    cancelButton: {
        padding: '10px 20px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        marginRight: '10px',
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
      { Header: "Low Stock Warning", accessor: "isLowStockWarring" }, // New column for low stock warning
      { Header: "Actions", accessor: "actions" },
    ],
    rows: filteredProducts, // Use the filtered product data
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
      <div style={modalStyles.header}>
        <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>
        <button style={modalStyles.closeButton} onClick={closeModal}>×</button>
      </div>
      <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct}>
        {/* Row for Product Name and Quantity */}
        <div style={modalStyles.inputContainer}>
          <label style={modalStyles.label}>
            Product Name
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              style={{ ...modalStyles.input, flex: 1, marginRight: '10px' }}
              value={newProduct.name}
              onChange={handleInputChange}
              required
            />
          </label>
          <label style={modalStyles.label}>
            Quantity
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              style={{ ...modalStyles.input, flex: 1 }}
              value={newProduct.quantity}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        {/* Row for Price and Low Stock Warning */}
        <div style={modalStyles.inputContainer}>
          <label style={modalStyles.label}>
            Price
            <input
              type="number"
              name="price"
              placeholder="Price"
              style={{ ...modalStyles.input, flex: 1, marginRight: '10px' }}
              value={newProduct.price}
              onChange={handleInputChange}
              required
            />
          </label>
          <label style={modalStyles.label}>
            Low Stock Warning (Quantity)
            <input
              type="number"
              name="isLowStockWarring"
              placeholder="Low Stock Warning (Quantity)"
              style={{ ...modalStyles.input, flex: 1 }}
              value={newProduct.isLowStockWarring}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div style={modalStyles.inputContainer}>
          <label style={modalStyles.label}>
            Barcode
            <input
              type="text"
              name="barCode"
              placeholder="Barcode"
              style={{ ...modalStyles.input, flex: 1 }}
              value={newProduct.barCode}
              onChange={handleInputChange}
            />
          </label>
          <label style={modalStyles.label}>
            Category
            <select
              name="category"
              style={{ ...modalStyles.input, flex: 1 }}
              value={newProduct.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.catName}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={modalStyles.inputContainer}>
          <button type="button" onClick={generateBarcode} style={modalStyles.button}>
            Generate Barcode
          </button>
          <label style={modalStyles.label}>
            Supplier
            <select
              name="supplierId"
              style={{ ...modalStyles.input, flex: 1 }}
              value={newProduct.supplierId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.supplierName}
                </option>
              ))}
            </select>
          </label>
        </div>
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
