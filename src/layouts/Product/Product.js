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
    image: null,
    barCode: "",
    supplierId: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [suppliersResponse, categoriesResponse, productsResponse] = await Promise.all([
        axios.get('https://localhost:7171/api/Supplier/GetSupplier'),
        
        axios.get('https://localhost:7171/GetCategory'),
        axios.get('https://localhost:7171/GetProduct'),
      ]);
      console.log(suppliersResponse)
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
        image: product.image.includes('/images/') ? `https://localhost:7171${product.image}` : product.image,
        barcode: product.barCode || "N/A",
        supplier: supplier ? supplier.supplierName : "N/A",
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
      image: product.image.includes('https') ? product.image : null,
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
    if (newProduct.image) formData.append("imageFile", newProduct.image);

    try {
      await axios.put("https://localhost:7171/UpdateProduct", formData);
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
    if (newProduct.image) formData.append("imageFile", newProduct.image);

    try {
      await axios.post('https://localhost:7171/AddProduct', formData);
      fetchInitialData();
      closeModal();
      toast.success("Product added successfully!");
    } catch (error) {
      toast.error("Failed to add product.");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`https://localhost:7171/DeleteProduct?id=${id}`);
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
      [name]: files ? files[0] : value,
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
      image: null,
    });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const modalStyles = {
    button: {
      padding: '10px 20px',
      backgroundColor: '#344767',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '5px',
      fontSize: '16px',
      marginRight: '10px',
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
      zIndex: 1000,
    },
    modal: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      width: '400px',
      maxWidth: '80%',
      position: 'relative',
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
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
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
      <MDBox py={3}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h4" gutterBottom>
            Product Management
          </MDTypography>
          <MDInput
            type="text"
            placeholder="Search..."
            onChange={handleSearch}
            value={searchTerm}
          />
          <button style={modalStyles.button} onClick={() => setIsModalOpen((prev) => ({ ...prev, add: true }))}>
            Add New Product
          </button>
        </MDBox>
        <Card>
          <MDBox pt={3}> <DataTable table={{ columns: [ { Header: "Name", accessor: "name", width: "30%" }, { Header: "Category", accessor: "category", width: "20%" }, { Header: "Price", accessor: "price", width: "10%" }, { Header: "Quantity", accessor: "quantity", width: "10%" }, { Header: "Supplier", accessor: "supplier", width: "10%" }, { Header: "Barcode", accessor: "barcode", width: "10%" }, { Header: "Actions", accessor: "actions", width: "10%" }, ],                 rows: filteredProducts,
              }}
              entriesPerPage={false}
              canSearch={false}
            />
          </MDBox>
        </Card>
      </MDBox>
      <Footer />

      {isModalOpen.add || isModalOpen.edit ? (
  <div style={modalStyles.overlay}>
    <div style={modalStyles.modal}>
      <div style={modalStyles.header}>
        <h2>{isModalOpen.add ? "Add New Product" : "Edit Product"}</h2>
        <button style={modalStyles.closeButton} onClick={closeModal}>
          &times;
        </button>
      </div>
      <form onSubmit={isModalOpen.add ? handleAddProduct : handleEditProduct}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          style={modalStyles.input}
          value={newProduct.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          style={modalStyles.input}
          value={newProduct.quantity}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          style={modalStyles.input}
          value={newProduct.price}
          onChange={handleInputChange}
          required
        />
        <select
          name="category"
          style={modalStyles.input}
          value={newProduct.category}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>
            Select Category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.catName}
            </option>
          ))}
        </select>
        <select
          name="supplierId"
          style={modalStyles.input}
          value={newProduct.supplierId}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>
            Select Supplier
          </option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.supplierName}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="barCode"
          placeholder="Barcode"
          style={modalStyles.input}
          value={newProduct.barCode}
          onChange={handleInputChange}
        />
        <button type="button" onClick={generateBarcode} style={modalStyles.button}>
          Generate Barcode
        </button>
        <input
          type="file"
          name="image"
          style={modalStyles.input}
          onChange={handleInputChange}
          accept="image/*"
        />
        <div style={modalStyles.footer}>
          <button type="button" onClick={closeModal} style={modalStyles.cancelButton}>
            Cancel
          </button>
          <button type="submit" style={modalStyles.submitButton}>
            {isModalOpen.add ? "Add Product" : "Update Product"}
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

export default Product;
