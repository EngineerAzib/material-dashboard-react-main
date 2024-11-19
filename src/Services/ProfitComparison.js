import axios from 'axios';
import { GetDayProfit,GetWeekProfitProfit,GetMonthProfit,GetYearProfit } from "layouts/Api";
//const API_URL = 'https://localhost:7171';

export const GetDayProfitComparison = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetDayProfit, {
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
export const GetWeekProfitComparison = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetWeekProfitProfit, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching GetWeekProfitComparison', error);
        throw error;
    }
};
export const GetMonthProfitComparison = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetMonthProfit, {
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
export const GetYearProfitComparison = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetYearProfit, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching GetYearProfitComparison:', error);
        throw error;
    }
};



