import axios from 'axios';

const API_URL = 'https://localhost:7171';

export const GetDayProfitComparison = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetDayProfitComparison`);
        return response.data;
    } catch (error) {
        console.error('Error fetching GetDailySaleMinusPaymentReceived', error);
        throw error;
    }
};
export const GetWeekProfitComparison = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetWeekProfitComparison`);
        return response.data;
    } catch (error) {
        console.error('Error fetching GetWeekProfitComparison', error);
        throw error;
    }
};
export const GetMonthProfitComparison = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetMonthProfitComparison`);
        return response.data;
    } catch (error) {
        console.error('Error fetching GetMonthlySaleMinusPaymentReceived', error);
        throw error;
    }
};
export const GetYearProfitComparison = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetYearProfitComparison`);
        return response.data;
    } catch (error) {
        console.error('Error fetching GetYearProfitComparison:', error);
        throw error;
    }
};



