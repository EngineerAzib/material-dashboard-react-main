import axios from "axios";

const baseUrl = "https://localhost:7171";
// Supplier
export const getSupplier = `${baseUrl}/api/Supplier/GetSupplier`;
export const AddSupplier = `${baseUrl}/api/Supplier/AddSupplier`;
export const UpdateSupplier = `${baseUrl}/api/Supplier/UpdateSupplier`;
export const DeleteSupplier = `${baseUrl}/api/Supplier/DeleteSupplier`;
// Expense
export const GetExpense=`${baseUrl}/api/Expense/GetExpense`;
export const AddExpense = `${baseUrl}/api/Expense/AddExpense`;
export const UpdateExpense = `${baseUrl}/api/Expense/UpdatExpense`;
export const DeleteExpense = `${baseUrl}/api/Expense/DeleteExpense`;
// Product
export const GetProduct=`${baseUrl}/GetProduct`;
export const AddProduct = `${baseUrl}/AddProduct`;
 export const UpdateProduct = `${baseUrl}/UpdateProduct`;
export const DeleteProduct = `${baseUrl}/DeleteProduct`;
// Catagory
export const GetCatagory=`${baseUrl}/api/Category/GetCategory`;
export const AddCategory = `${baseUrl}/api/Category/AddCategory`;
 export const UpdateCatagory = `${baseUrl}/api/Category/UpdateCategory`;
export const DeleteCatagory = `${baseUrl}/api/Category/DeleteCategory`;
// Billing
export const GetBilling=`${baseUrl}/api/Billing/GetBilling`;
export const AddBilling= `${baseUrl}/api/Billing/AddBilling`;
 export const UpdateBilling = `${baseUrl}/api/Billing/UpdateBilling`;
export const DeleteBilling = `${baseUrl}/api/Billing/DeleteBilling`;
//Payment
export const GetPayment=`${baseUrl}/api/Payment/Getpayment`;
//AvaliableQuantity
export const GetAvaliableQuantity=`${baseUrl}/api/Billing/GetAvailableQuantities`;
//UserCompany
export const GetUserCompany=`${baseUrl}/api/Company/GetCompany`;
export const UpdateUserCompany=`${baseUrl}/api/Company/UpdateCompany`;
export const AddUserCompany=`${baseUrl}/api/Company/AddCompany`;
export const DeleteUserCompany=`${baseUrl}/api/Company/DeleteCompany`;
//Outlets
export const GetOutLets=`${baseUrl}/api/OutLets/GetOutLets`;
export const AddOutLets=`${baseUrl}/api/OutLets/AddOutLets`;
export const UpdateOutLets=`${baseUrl}/api/OutLets/UpdateOutLets`;
export const DeleteOutLets=`${baseUrl}/api/OutLets/deleteOutLets`;
//Company
export const GetCompany=`${baseUrl}/api/Company/GetCompany`;
//Dashboard
export const GetDayProfit=`${baseUrl}/GetDayProfitComparison`;
export const GetWeekProfitProfit=`${baseUrl}/GetWeekProfitComparison`;
export const GetMonthProfit=`${baseUrl}/GetMonthProfitComparison`;
export const GetYearProfit=`${baseUrl}/GetYearProfitComparison`;
export const DayProfit=`${baseUrl}/GetDayProfit`;
export const GetWeeklyProfits=`${baseUrl}/GetWeeklyProfit`;
export const MonthProfit=`${baseUrl}/GetMonthProfit`;
export const YearProfit=`${baseUrl}/GetYearProfit`;
export const GetDailyProfitsData=`${baseUrl}/GetDailyProfitData`;
export const GetWeeklyProfitsData=`${baseUrl}/GetWeeklyProfitData`;
export const GetYearlyProfitsData=`${baseUrl}/GetYearlyProfitData`;
export const GetDailyRevenues=`${baseUrl}/GetDailyRevenue`;
export const GetWeeklyRevenues=`${baseUrl}/GetWeeklyRevenue`;
export const GetMonthlyRevenues=`${baseUrl}/GetMonthlyRevenue`;
export const GetYearlyRevenues=`${baseUrl}/GetYearlyRevenue`;
export const GetWeeklySaleData=`${baseUrl}/GetWeeklySalesData`;
export const GetDailySaleData=`${baseUrl}/GetDailySalesData`;
export const GetYearlySaleData=`${baseUrl}/GetYearlySalesData`;
export const GetDailySalesMinusPaymentReceived=`${baseUrl}/GetDailySaleMinusPaymentReceived`;
export const GetWeeklySalesMinusPaymentReceived=`${baseUrl}/GetWeeklySaleMinusPaymentReceived`;
export const GetMonthlySalesMinusPaymentReceived=`${baseUrl}/GetMonthlySaleMinusPaymentReceived`;
export const GetYearlySalesMinusPaymentReceived=`${baseUrl}/GetYearlySaleMinusPaymentReceived`;
export const GetTotalDalySales=`${baseUrl}/GetTotalDalySale`;
export const GetTotalWeeklySales=`${baseUrl}/GetTotalWeeklySale`;
export const GetTotalMonthlySales=`${baseUrl}/GetTotalMonthlySale`;
export const GetTotalYearlySales=`${baseUrl}/GetTotalYearlySale`;
export const GetWeeklySale=`${baseUrl}/GetWeeklySales`;
export const GetDailySale=`${baseUrl}/GetDailySales`;
export const GetYearlySale=`${baseUrl}/GetYearlySales`;