import axios from 'axios';
import { GetTotalDalySales,GetTotalWeeklySales,GetTotalMonthlySales,GetWeeklySale,GetDailySale,GetYearlySale,GetTotalYearlySales } from "layouts/Api";

//const API_URL = 'https://localhost:7171';

export const GetTotalDalySale = async () => {
    try {
        const response = await axios.get(GetTotalDalySales);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily revenue:', error);
        throw error;
    }
};
export const GetTotalWeeklySale = async () => {
    try {
        const response = await axios.get(GetTotalWeeklySales);
        return response.data;
    } catch (error) {
        console.error('Error fetching GetTotalWeeklySale:', error);
        throw error;
    }
};
export const GetTotalMonthlySale = async () => {
    try {
        const response = await axios.get(GetTotalMonthlySales);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily revenue:', error);
        throw error;
    }
};
export const GetTotalYearlySale = async () => {
    try {
        const response = await axios.get(GetTotalYearlySales);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily revenue:', error);
        throw error;
    }
};
export const GetWeeklySales = async () => {
    try {
        const response = await axios.get(GetWeeklySale);
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly sales data:', error);
        throw error;
    }
};
export const GetDailySales = async () => {
    try {
        const response = await axios.get(GetDailySale);
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly sales data:', error);
        throw error;
    }
};
export const GetYearlySales = async () => {
    try {
        const response = await axios.get(GetYearlySale);
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly sales data:', error);
        throw error;
    }
};

