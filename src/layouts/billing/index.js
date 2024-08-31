// @mui material components
import Grid from "@mui/material/Grid";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Billing() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://localhost:7171/GetProduct");
      setProducts(response.data || []);
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

  const handlePriceChange = (index, value) => {
    const updatedProducts = [...products];
    updatedProducts[index].price = value;
    setProducts(updatedProducts);
  };

  const handleAddToCart = (product) => {
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            {products.map((product, index) => (
              <Grid item xs={12} md={6} xl={3} key={product.id}>
                <MDBox
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  border="1px solid #ddd"
                  borderRadius="12px"
                  boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
                  padding="20px"
                  textAlign="center"
                  backgroundColor="#fff"
                >
                  <img
                    src={
                      product.image.includes('/images/')
                        ? `https://localhost:7171${product.image}`
                        : product.image
                    }
                    alt={product.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                    style={{
                      width: "80%",
                      height: "auto",
                      marginBottom: "16px",
                      borderRadius: "8px",
                    }}
                  />
                  <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "10px 0", color: "#344767" }}>
                    {product.name}
                  </h3>
                  <p style={{ margin: "5px 0", color: "#6c757d" }}>Category: {product.categoryName}</p>
                  <p style={{ margin: "5px 0", color: "#6c757d" }}>Quantity: {product.quantity}</p>
                  <MDInput
                    type="number"
                    label="Price"
                    value={product.price}
                    onChange={(e) => handlePriceChange(index, e.target.value)}
                    fullWidth
                    InputLabelProps={{
                      style: { color: "#6c757d" },
                    }}
                    inputProps={{
                      style: {
                        color: "#495057",
                        fontWeight: "500",
                        padding: "10px 12px",
                      },
                    }}
                    style={{ margin: "10px 0" }}
                  />
                  <MDButton
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddToCart(product)}
                    fullWidth
                    style={{
                      marginTop: "16px",
                      padding: "12px",
                      fontWeight: "bold",
                      backgroundColor: "#f44336",
                      borderRadius: "8px",
                    }}
                  >
                    ADD TO CART
                  </MDButton>
                </MDBox>
              </Grid>
            ))}
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
      <ToastContainer />
    </DashboardLayout>
  );
}

export default Billing;
