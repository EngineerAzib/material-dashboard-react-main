import axios from 'axios';
import { GetDailySalesMinusPaymentReceived,GetWeeklySalesMinusPaymentReceived,GetMonthlySalesMinusPaymentReceived,GetYearlySalesMinusPaymentReceived,GetWeeklySaleData,GetDailySaleData,GetYearlySaleData } from "layouts/Api";
//const API_URL = 'https://localhost:7171';


export const GetDailySaleMinusPaymentReceived = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetDailySalesMinusPaymentReceived, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching GetDailySaleMinusPaymentReceived', error);
        throw error;
    }
};
export const GetWeeklySaleMinusPaymentReceived = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetWeeklySalesMinusPaymentReceived, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching GetWeeklySaleMinusPaymentReceived', error);
        throw error;
    }
};
export const GetMonthlySaleMinusPaymentReceived = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetMonthlySalesMinusPaymentReceived, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching GetMonthlySaleMinusPaymentReceived', error);
        throw error;
    }
};
export const GetYearlySaleMinusPaymentReceived = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetYearlySalesMinusPaymentReceived, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching GetYearlySaleMinusPaymentReceived:', error);
        throw error;
    }
};



