import axios from 'axios';
import { GetDailyRevenues,GetWeeklyRevenues,GetMonthlyRevenues,GetYearlyRevenues,GetWeeklySaleData,GetDailySaleData,GetYearlySaleData } from "layouts/Api";
//const API_URL = 'https://localhost:7171';


export const getDailyRevenue = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetDailyRevenues, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching daily revenue:', error);
        throw error;
    }
};
export const getWeeklyRevenue = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetWeeklyRevenues, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching daily revenue:', error);
        throw error;
    }
};
export const getMonthlyRevenue = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetMonthlyRevenues, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching daily revenue:', error);
        throw error;
    }
};
export const getYearlyRevenue = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetYearlyRevenues, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching daily revenue:', error);
        throw error;
    }
};
export const getWeeklySalesData = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetWeeklySaleData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly sales data:', error);
        throw error;
    }
};
export const getDailySalesData = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetDailySaleData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly sales data:', error);
        throw error;
    }
};
export const getYearlySalesData = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetYearlySaleData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly sales data:', error);
        throw error;
    }
};

