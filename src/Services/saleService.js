import axios from 'axios';

const API_URL = 'https://localhost:7171';

export const GetTotalDalySale = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetTotalDalySale`);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily revenue:', error);
        throw error;
    }
};
export const GetTotalWeeklySale = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetTotalWeeklySale`);
        return response.data;
    } catch (error) {
        console.error('Error fetching GetTotalWeeklySale:', error);
        throw error;
    }
};
export const GetTotalMonthlySale = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetTotalMonthlySale`);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily revenue:', error);
        throw error;
    }
};
export const GetTotalYearlySale = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetTotalYearlySale`);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily revenue:', error);
        throw error;
    }
};
export const GetWeeklySales = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetWeeklySales`);
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly sales data:', error);
        throw error;
    }
};
export const GetDailySales = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetDailySales`);
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly sales data:', error);
        throw error;
    }
};
export const GetYearlySales = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetYearlySales`);
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly sales data:', error);
        throw error;
    }
};

