import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function Basic() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Toggle the 'Remember Me' switch
  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  // Handle the login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Send login request to the backend
      const response = await axios.post("https://localhost:7171/api/Auth/login", {
        email,
        password,
      });
  
      console.log(response); // Log the full response for debugging
  
      if (response.status === 200 && response.data.token) {
        // Show success message
        toast.success("Login successful!");
  
        // Save token and userId to localStorage
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("userId", response.data.userId);
  
        // Check if the token is stored successfully
        const token = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId");

        console.log("Saved Access Token:", token);
        console.log("Saved User ID:", userId);
  
        // If token exists, navigate to the dashboard after a short delay
        if (token) {
          setTimeout(() => {
            navigate("/dashboard");
            window.location.reload();
          }, 500); // Delay added to ensure token is saved before navigation
        } else {
          // Show error if token isn't saved
          toast.error("Failed to retrieve token. Please try again.");
        }
  
      } else if (response.status === 400 || response.status === 401) {
        // Handle incorrect email or password
        toast.error("Incorrect email or password");
      } else {
        // Handle other errors
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Unauthorized (incorrect credentials)
        toast.error("Incorrect email or password");
      } else {
        console.error(error); // Log the error for debugging
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <BasicLayout image={bgImage}>
        <Card>
          {/* Header Section */}
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
            mx={2}
            mt={-3}
            p={2}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Sign in
            </MDTypography>
            <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
              {/* Social Icons */}
              <Grid item xs={2}>
                <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                  <FacebookIcon color="inherit" />
                </MDTypography>
              </Grid>
              <Grid item xs={2}>
                <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                  <GitHubIcon color="inherit" />
                </MDTypography>
              </Grid>
              <Grid item xs={2}>
                <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                  <GoogleIcon color="inherit" />
                </MDTypography>
              </Grid>
            </Grid>
          </MDBox>

          {/* Form Section */}
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form" onSubmit={handleSubmit}>
              {/* Email Input */}
              <MDBox mb={2}>
                <MDInput
                  type="email"
                  label="Email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </MDBox>
              {/* Password Input */}
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </MDBox>
              {/* Remember Me Switch */}
              <MDBox display="flex" alignItems="center" ml={-1}>
                <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  onClick={handleSetRememberMe}
                  sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                >
                  &nbsp;&nbsp;Remember me
                </MDTypography>
              </MDBox>
              {/* Sign In Button */}
              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth type="submit">
                  Sign in
                </MDButton>
              </MDBox>
              {/* Sign Up Link */}
              <MDBox mt={3} mb={1} textAlign="center">
                <MDTypography variant="button" color="text">
                  Don&apos;t have an account?{" "}
                  <MDTypography
                    component={Link}
                    to="/authentication/sign-up"
                    variant="button"
                    color="info"
                    fontWeight="medium"
                    textGradient
                  >
                    Sign up
                  </MDTypography>
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </BasicLayout>

      {/* Toast Notifications */}
      <ToastContainer />
    </>
  );
}

export default Basic;
