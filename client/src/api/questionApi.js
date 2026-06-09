// client/src/api/questionApi.js
import { apiClient } from './apiClient';

// הוספת שאלה לחדר (יופעל מעמוד ה-ManageRoomContent)
export const createQuestion = async (roomId, questionData) => {
    return await apiClient(`/questions/room/${roomId}`, 'POST', questionData);
};

// שליפת שאלות של חדר ספציפי (למשל כשהשחקן מתחיל לשחק)
export const getQuestionsByRoom = async (roomId) => {
    return await apiClient(`/questions/room/${roomId}`, 'GET');
};