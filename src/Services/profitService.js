import axios from 'axios';
import { DayProfit,GetWeeklyProfits,MonthProfit,YearProfit,GetDailyProfitsData,GetWeeklyProfitsData,GetYearlyProfitsData } from "layouts/Api";
//const API_URL = 'https://localhost:7171';

export const GetDayProfit = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(DayProfit, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching daily Profit:', error);
        throw error;
    }
};
export const GetWeeklyProfit = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetWeeklyProfits, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching Weekly Profit:', error);
        throw error;
    }
};
export const GetMonthProfit = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(MonthProfit, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching Month Profit:', error);
        throw error;
    }
};
export const GetYearProfit = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(YearProfit, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching Year Profit:', error);
        throw error;
    }
};
export const GetDailyProfitData = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetDailyProfitsData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching Daily Profit:', error);
        throw error;
    }
};
export const GetWeeklyProfitData = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetWeeklyProfitsData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly profit data:', error);
        throw error;
    }
};
export const GetYearlyProfitData = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(GetYearlyProfitsData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching Yearly data:', error);
        throw error;
    }
};

