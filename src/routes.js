/* eslint-disable */
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import CategoryProduct from "layouts/CategoryProduct/CategoryProduct.js";
import DineTable from "layouts/DineTable/DineTable.js";
import StaffTable from "layouts/Staff/StaffTable.js";
import Product from "layouts/Product/Product";
import Supplier from "layouts/supplier/supplier";
import Billing from "layouts/billing";
import axios from 'axios';
import PaymentManagement from "layouts/Payment/payment";
import DocumentTypeManagement from "layouts/DocumentType/DocumentType";
import PurchaseProduct from "layouts/PurchasProduct/PurchaseProduct";
import Outlets from "layouts/Outlets/Outlets";
import SalesDashboard from "layouts/SalesDashboard/SalesDashboard";
import SaleHistory from "layouts/SaleHistory/SaleHistory";
import UserCompany from "layouts/UserCompany/UserCompany";
import DatabaseBackup from "layouts/DatabaseBackup/DatabaseBackup";
import CompanySetting from "layouts/CompanySetting/CompanySetting";
import OutletSetting from "layouts/OutletSetting/OutletSetting";
import Expense from "layouts/expense/expense";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import CategoryIcon from '@mui/icons-material/Category';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import GroupIcon from '@mui/icons-material/Group';
import StoreIcon from '@mui/icons-material/Store';
import SupplierIcon from '@mui/icons-material/Business';
import PaymentIcon from '@mui/icons-material/Payment';
import DescriptionIcon from '@mui/icons-material/Description';
import ProfitDashboard from "layouts/ProfitDashboard/ProfitDashboard";
import Icon from "@mui/material/Icon";
import { Navigate } from "react-router-dom";

// Replace this with your actual authentication check logic
const isAuthenticated = () => !!localStorage.getItem('accessToken');

// Log the result to the console
console.log('Is user authenticated?', isAuthenticated());

const isAdmin = async () => {
  try {
    // Retrieve the token from local storage or another secure location
    const token = localStorage.getItem('accessToken'); 

    // Make the API request with the Authorization header
    const response = await axios.get('https://localhost:7171/api/UserAuthentication/GetRoles', {
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`
      }
    });

    // Extract and log the user role from the response
    const userRole = response.data.roles[0];
    const isAdmin = userRole === 'ADMIN';
    console.log("Admin status:", isAdmin);

    // Store the result in localStorage for synchronous access later
    localStorage.setItem('isAdmin', isAdmin);
  } catch (error) {
    console.error('Error checking admin status:', error);
    localStorage.setItem('isAdmin', false); // Default to false on error
  }
};
// const logIsAdmin = async () => {
//   const adminStatus = await isAdmin(); // Await the async function to get the result
//   console.log('Is user an admin?', adminStatus); // Log the result of isAdmin
// };
// logIsAdmin();
const isAdmins = localStorage.getItem('isAdmin') === 'true';
console.log(isAdmins,"isAdmins")
const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "Dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: isAuthenticated() ? <SalesDashboard /> : <Navigate to="/authentication/sign-in" />,
  },
  {
    type: "collapse",
    name: "CompanySetting",
    key: "CompanySetting",
    icon: <Icon fontSize="small">CompanySetting</Icon>,
    route: "/CompanySetting",
    component: isAuthenticated() ? <CompanySetting /> : <Navigate to="/authentication/sign-in" />,
  },
  {
    type: "collapse",
    name: "OutletSetting",
    key: "OutletSetting",
    icon: <Icon fontSize="small">OutletSetting</Icon>,
    route: "/OutletSetting",
    component: isAuthenticated() ? <OutletSetting /> : <Navigate to="/authentication/sign-in" />,
  },
  // {
  //   type: "collapse",
  //   name: "Sales Dashboard",
  //   key: "SalesDashboard",
  //   icon: <Icon fontSize="small">dashboard</Icon>,
  //   route: "/SalesDashboard",
  //   component: isAuthenticated() ? <SalesDashboard /> : <Navigate to="/authentication/sign-in" />,
  // },
  {
    icon: <PaymentIcon fontSize="small" />,
    route: "/SalesDashboard",
    component: isAuthenticated() ? <SalesDashboard /> : <Navigate to="/authentication/sign-in" />,
  },
  // {
  //   type: "collapse",
  //   name: "Profit Dashboard",
  //   key: "ProfitDashboard",
  //   icon: <PaymentIcon fontSize="small" />,
  //   route: "/ProfitDashboard",
  //   component: isAuthenticated() ? <ProfitDashboard /> : <Navigate to="/authentication/sign-in" />,
  // },
  {
    type: "collapse",
    name: "Category Products",
    key: "category-products",
    icon: <CategoryIcon fontSize="small" />,
    route: "/categoryproduct",
    component: isAuthenticated() ? <CategoryProduct /> : <Navigate to="/authentication/sign-in" />,
  },
  ...(isAuthenticated() && isAdmins ? [{
    type: "collapse",
    name: "Outlets",
    key: "Outlets",
    icon: <CategoryIcon fontSize="small" />,
    route: "/Outlets",
    component: isAuthenticated() ? <Outlets /> : <Navigate to="/authentication/sign-in" />,
  }] : []),

  // {
  //   type: "collapse",
  //   name: "User Company",
  //   key: "User Company",
  //   icon: <CategoryIcon fontSize="small" />,
  //   route: "/UserCompany",
  //   //component: isAuthenticated() ? <UserCompany /> : <Navigate to="/authentication/sign-in" />,
  //   component: (isAuthenticated() && isAdmins) ? <UserCompany /> : null,
  // },

  ...(isAuthenticated() && isAdmins ? [{
    type: "collapse",
    name: "User Company",
    key: "User Company",
    icon: <CategoryIcon fontSize="small" />,
    route: "/UserCompany",
    component: <UserCompany />,
  }] : []),
  // Add other routes here as needed
  ...(isAuthenticated() && isAdmins ? [{
    type: "collapse",
    name: "DatabaseBackup",
    key: "DatabaseBackup",
    icon: <CategoryIcon fontSize="small" />,
    route: "/DatabaseBackup",
    component: <DatabaseBackup />,
  }] : []),

  {
    type: "collapse",
    name: "Dine Tables",
    key: "dine-tables",
    icon: <DinnerDiningIcon fontSize="small" />,
    route: "/dinetables",
    // component: isAuthenticated() ? <DineTable /> : <Navigate to="/authentication/sign-in" />,
    component: (isAuthenticated() && isAdmin()) ? <DineTable /> : null,
  },
  {
    type: "collapse",
    name: "Staff",
    key: "staff",
    icon: <GroupIcon fontSize="small" />,
    route: "/staff",
    component: isAuthenticated() ? <StaffTable /> : <Navigate to="/authentication/sign-in" />,

  },
  {
    type: "collapse",
    name: "SalarHistory",
    key: "SaleHistory",
    icon: <GroupIcon fontSize="small" />,
    route: "/Salehistory",
    component: isAuthenticated() ? <SaleHistory /> : <Navigate to="/authentication/sign-in" />,

  },

  {
    type: "collapse",
    name: "Payment",
    key: "Payment",
    icon: <PaymentIcon fontSize="small" />,
    route: "/Payment",
    component: isAuthenticated() ? <PaymentManagement /> : <Navigate to="/authentication/sign-in" />,
  },
 
  {
    type: "collapse",
    name: "DocumentType",
    key: "DocumentType",
    icon: <DescriptionIcon fontSize="small" />,
    route: "/DocumentType",
    component: isAuthenticated() ? <DocumentTypeManagement /> : <Navigate to="/authentication/sign-in" />,
  },
  {
    type: "collapse",
    name: "Expense",
    key: "expense",
    icon: <DescriptionIcon fontSize="small" />,
    route: "/Expense",
    component: isAuthenticated() ? <Expense /> : <Navigate to="/authentication/sign-in" />,
  },
  {
    type: "collapse",
    name: "Products",
    key: "products",
    icon: <StoreIcon fontSize="small" />,
    route: "/products",
    component: isAuthenticated() ? <Product /> : <Navigate to="/authentication/sign-in" />,
  },
  {
    type: "collapse",
    name: "Supplier",
    key: "supplier",
    icon: <SupplierIcon fontSize="small" />,
    route: "/supplier",
    component: isAuthenticated() ? <Supplier /> : <Navigate to="/authentication/sign-in" />,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: isAuthenticated() ? <Billing /> : <Navigate to="/authentication/sign-in" />,
  },
  {
    type: "collapse",
    name: "PurchaseProduct",
    key: "PurchaseProduct",
    icon: <Icon fontSize="small">shopping_bag</Icon>,
    route: "/PurchaseProduct",
    component: isAuthenticated() ? <PurchaseProduct /> : <Navigate to="/authentication/sign-in" />,
  },
  {
    icon: <PaymentIcon fontSize="small" />,
    route: "/ProfitDashboard",
    component: isAuthenticated() ? <ProfitDashboard /> : <Navigate to="/authentication/sign-in" />,
  },
 
  {
    type: "collapse",
    name: "RTL",
    key: "rtl",
    icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    route: "/rtl",
    component: isAuthenticated() ? <RTL /> : <Navigate to="/authentication/sign-in" />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: isAuthenticated() ? <Notifications /> : <Navigate to="/authentication/sign-in" />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: isAuthenticated() ? <Profile /> : <Navigate to="/authentication/sign-in" />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

export default routes;