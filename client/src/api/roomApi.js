// client/src/api/roomApi.js
import { apiClient } from './apiClient';

// שימי לב: מחקנו את ה-token מהפרמטרים!
export const getAllRooms = async () => {
    // כשלא מעבירים 'POST' וכו', ברירת המחדל של apiClient היא 'GET'
    return await apiClient('/rooms/'); 
};

export const getMyRooms = async () => {
    return await apiClient('/rooms/my-rooms');
};

export const createRoom = async (roomData) => {
    return await apiClient('/rooms/create', 'POST', roomData);
};

export const updateRoom = async (roomId, roomData) => {
    return await apiClient(`/rooms/update/${roomId}`, 'PUT', roomData);
};

export const deleteRoom = async (roomId) => {
    return await apiClient(`/rooms/delete/${roomId}`, 'DELETE');
};