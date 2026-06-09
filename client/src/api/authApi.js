// client/src/api/authApi.js
import { apiClient } from './apiClient';

// התחברות
export const loginUser = async (username, password) => {
    return await apiClient('/auth/login', 'POST', { username, password });
};

// הרשמה
export const registerUser = async (username, password, role) => {
    return await apiClient('/auth/register', 'POST', { username, password, role });
};