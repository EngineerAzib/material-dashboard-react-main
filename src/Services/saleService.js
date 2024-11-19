import axios from 'axios';
import { GetTotalDalySales,GetTotalWeeklySales,GetTotalMonthlySales,GetWeeklySale,GetDailySale,GetYearlySale,GetTotalYearlySales } from "layouts/Api";

//const API_URL = 'https://localhost:7171';

export const GetTotalDalySale = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetTotalDalySales, {
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
export const GetTotalWeeklySale = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetTotalWeeklySales, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching GetTotalWeeklySale:', error);
        throw error;
    }
};
export const GetTotalMonthlySale = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetTotalMonthlySales, {
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
export const GetTotalYearlySale = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetTotalYearlySales, {
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
export const GetWeeklySales = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetWeeklySale, {
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
export const GetDailySales = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetDailySale, {
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
export const GetYearlySales = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetYearlySale, {
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

