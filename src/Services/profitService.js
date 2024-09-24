import axios from 'axios';

const API_URL = 'https://localhost:7171';

export const GetDayProfit = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetDayProfit`);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily Profit:', error);
        throw error;
    }
};
export const GetWeeklyProfit = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetWeeklyProfit`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Weekly Profit:', error);
        throw error;
    }
};
export const GetMonthProfit = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetMonthProfit`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Month Profit:', error);
        throw error;
    }
};
export const GetYearProfit = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetYearProfit`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Year Profit:', error);
        throw error;
    }
};
export const GetDailyProfitData = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetDailyProfitData`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Daily Profit:', error);
        throw error;
    }
};
export const GetWeeklyProfitData = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetWeeklyProfitData`);
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly profit data:', error);
        throw error;
    }
};
export const GetYearlyProfitData = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetYearlyProfitData`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Yearly data:', error);
        throw error;
    }
};

