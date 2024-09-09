import axios from 'axios';

const API_URL = 'https://localhost:7171';

export const getDailyRevenue = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetDailyRevenue`);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily revenue:', error);
        throw error;
    }
};
export const getWeeklyRevenue = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetWeeklyRevenue`);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily revenue:', error);
        throw error;
    }
};
export const getMonthlyRevenue = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetMonthlyRevenue`);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily revenue:', error);
        throw error;
    }
};
export const getYearlyRevenue = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetYearlyRevenue`);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily revenue:', error);
        throw error;
    }
};
export const getWeeklySalesData = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetWeeklySalesData`);
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly sales data:', error);
        throw error;
    }
};
export const getDailySalesData = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetDailySalesData`);
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly sales data:', error);
        throw error;
    }
};
export const getYearlySalesData = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetYearlySalesData`);
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly sales data:', error);
        throw error;
    }
};

