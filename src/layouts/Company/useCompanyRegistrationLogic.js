import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useCompanyRegistrationLogic = () => {
  // State to manage form data for both company and registration
  const [formData, setFormData] = useState({
    companyName: "",
    ownerName: "",
    ownerPhoneNumber: "",
    ownerEmail: "",
    isActive: true,
    userName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Handle input changes dynamically for all form fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. First, create the company
      const companyResponse = await axios.post("https://localhost:7171/api/Company/AddCompany", {
        company_Name: formData.companyName,
        company_Owner_Name: formData.ownerName,
        company_Owner_PhoneNumber: formData.ownerPhoneNumber,
        company_Owner_Email: formData.ownerEmail,
        isActive: formData.isActive
      });

      // Assuming company API returns company id in response
      const companyId = companyResponse.data.id;
      console.log("Company created successfully with ID:", companyId);

      // 2. Then, register the user associated with the company
      await axios.post("https://localhost:7171/api/Auth/register", {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        // companyId: companyId // Include company ID from previous API call
      });

      // 3. Fetch the user details by username or email to get user_Id
      const userResponse = await axios.get(`https://localhost:7171/api/Auth/Get=${formData.email}`);
      const userId = userResponse.data.id; // Assuming the user info contains 'id'

      console.log("User registered successfully with ID:", userId);

      // 4. Associate the user with the company using the UserCompany API
      await axios.post("https://localhost:7171/api/UserCompany/AddUserCompany", {
        user_Id: userId,
        company_Id: companyId,
        isActive: true
      });

      toast.success("Company, User, and User-Company association created successfully!");
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Failed to complete the registration process. Please try again.");
    }
  };

  return {
    formData,
    handleInputChange,
    handleSubmit
  };
};

export default useCompanyRegistrationLogic;
