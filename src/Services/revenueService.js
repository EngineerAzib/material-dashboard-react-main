import axios from 'axios';
import { GetDailyRevenues,GetWeeklyRevenues,GetMonthlyRevenues,GetYearlyRevenues,GetWeeklySaleData,GetDailySaleData,GetYearlySaleData } from "layouts/Api";
//const API_URL = 'https://localhost:7171';


export const getDailyRevenue = async () => {
    try {
        const response = await axios.get(GetDailyRevenues);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily revenue:', error);
        throw error;
    }
};
export const getWeeklyRevenue = async () => {
    try {
        const response = await axios.get(GetWeeklyRevenues);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily revenue:', error);
        throw error;
    }
};
export const getMonthlyRevenue = async () => {
    try {
        const response = await axios.get(GetMonthlyRevenues);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily revenue:', error);
        throw error;
    }
};
export const getYearlyRevenue = async () => {
    try {
        const response = await axios.get(GetYearlyRevenues);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily revenue:', error);
        throw error;
    }
};
export const getWeeklySalesData = async () => {
    try {
        const response = await axios.get(GetWeeklySaleData);
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly sales data:', error);
        throw error;
    }
};
export const getDailySalesData = async () => {
    try {
        const response = await axios.get(GetDailySaleData);
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly sales data:', error);
        throw error;
    }
};
export const getYearlySalesData = async () => {
    try {
        const response = await axios.get(GetYearlySaleData);
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly sales data:', error);
        throw error;
    }
};

