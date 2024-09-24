import axios from 'axios';

const API_URL = 'https://localhost:7171';

export const GetDailySaleMinusPaymentReceived = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetDailySaleMinusPaymentReceived`);
        return response.data;
    } catch (error) {
        console.error('Error fetching GetDailySaleMinusPaymentReceived', error);
        throw error;
    }
};
export const GetWeeklySaleMinusPaymentReceived = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetWeeklySaleMinusPaymentReceived`);
        return response.data;
    } catch (error) {
        console.error('Error fetching GetWeeklySaleMinusPaymentReceived', error);
        throw error;
    }
};
export const GetMonthlySaleMinusPaymentReceived = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetMonthlySaleMinusPaymentReceived`);
        return response.data;
    } catch (error) {
        console.error('Error fetching GetMonthlySaleMinusPaymentReceived', error);
        throw error;
    }
};
export const GetYearlySaleMinusPaymentReceived = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetYearlySaleMinusPaymentReceived`);
        return response.data;
    } catch (error) {
        console.error('Error fetching GetYearlySaleMinusPaymentReceived:', error);
        throw error;
    }
};



