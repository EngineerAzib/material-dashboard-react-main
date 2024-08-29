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
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: "",
    price: "",
    category: "",
    image: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://localhost:7171/GetProduct");
      setProducts(formatProductData(response.data || []));
      console.log(response);
    } catch (error) {
      toast.error("Failed to fetch product data.");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://localhost:7171/GetCategory");
      setCategories(response.data || []);
      
    } catch (error) {
      toast.error("Failed to fetch categories.");
    }
  };

  const formatProductData = (data) => {
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      category: item.categoryName,
      image: item.image.includes('/images/') ? `https://localhost:7171${item.image}` : item.image,

      actions: (
        <>
          <IconButton onClick={() => handleEditClick(item)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteProduct(item.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    }));
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      category: product.categoryId, // Assuming categoryId is the category identifier
      image:product.image.includes('https') ? `https://localhost:7171${product.image}` : product.image
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
    formData.append("CatId", newProduct.category); // Assuming newProduct.category is the category ID
    if (newProduct.image) formData.append("imageFile", newProduct.image);

    try {
      await axios.put("https://localhost:7171/UpdateProduct", formData);
      fetchProducts();
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
    formData.append("CatId", newProduct.category); // Assuming newProduct.category is the category ID
    if (newProduct.image) formData.append("imageFile", newProduct.image);
  
    try {
      await axios.post('https://localhost:7171/AddProduct', formData);
      fetchProducts();
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
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      marginBottom: '15px',
    },
    submitButton: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#344767',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
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
          <MDBox p={3}>
            <DataTable
              table={{
                columns: [
                  { Header: "Name", accessor: "name" },
                  { Header: "Quantity", accessor: "quantity" },
                  { Header: "Price", accessor: "price" },
                  { Header: "Category", accessor: "category" },
                  {
                    Header: "Image",
                    accessor: "image",
                    Cell: ({ value }) => <img src={value} alt="Product" style={{ width: "50px", borderRadius: "5px" }} />,
                  },
                  { Header: "Actions", accessor: "actions" },
                ],
                rows: filteredProducts,
              }}
            />
          </MDBox>
        </Card>

        {/* Add Product Modal */}
        {isModalOpen.add && (
          <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
              <div style={modalStyles.header}>
                <MDTypography variant="h5">Add New Product</MDTypography>
                <button style={modalStyles.closeButton} onClick={closeModal}>
                  &times;
                </button>
              </div>
              <form onSubmit={handleAddProduct}>
                <input
                  style={modalStyles.input}
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  style={modalStyles.input}
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={newProduct.quantity}
                  onChange={handleInputChange}
                  required
                />
                <input
                  style={modalStyles.input}
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  required
                />
                <select
                  style={modalStyles.input}
                  name="category"
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
                <input
                  style={modalStyles.input}
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                />
                <button type="submit" style={modalStyles.submitButton}>
                  Add Product
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {isModalOpen.edit && editingProduct && (
          <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
              <div style={modalStyles.header}>
                <MDTypography variant="h5">Edit Product</MDTypography>
                <button style={modalStyles.closeButton} onClick={closeModal}>
                  &times;
                </button>
              </div>
              <form onSubmit={handleEditProduct}>
                <input
                  style={modalStyles.input}
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  style={modalStyles.input}
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={newProduct.quantity}
                  onChange={handleInputChange}
                  required
                />
                <input
                  style={modalStyles.input}
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  required
                />
                <select
                  style={modalStyles.input}
                  name="category"
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
                {editingProduct.image && (
  <img
    src={newProduct.image} // Ensure you're using newProduct.image here
    alt="Product"
    style={{ width: "100px", marginBottom: "15px", borderRadius: "5px" }}
  />
)}

                <input
                  style={modalStyles.input}
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                />
                <button type="submit" style={modalStyles.submitButton}>
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </MDBox>
      <Footer />
      <ToastContainer />
    </DashboardLayout>
  );
};

export default Product;
