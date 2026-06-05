import db from '../config/db.js';

// 1. יצירת שאלה חדשה
const create = async (roomId, questionText, correctAnswer, hintText) => {
    const [result] = await db.query(
        'INSERT INTO questions (room_id, question_text, correct_answer, hint_text) VALUES (?, ?, ?, ?)',
        [roomId, questionText, correctAnswer, hintText]
    );
    return result.insertId;
};
const findSafeByRoom = async (roomId) => {
    // שולפים אך ורק את ה-ID והטקסט של השאלה
    const query = 'SELECT id, question_text FROM questions WHERE room_id = ?';
    const [rows] = await db.query(query, [roomId]);
    return rows;
};
// 2. מציאת כל השאלות של חדר מסוים
const findByRoom = async (roomId) => {
    const [rows] = await db.query('SELECT * FROM questions WHERE room_id = ?', [roomId]);
    return rows;
};

// 3. מציאת שאלה ספציפית לפי ה-ID שלה (מעולה לבדיקות אבטחה ותקינות)
const findById = async (questionId) => {
    const [rows] = await db.query('SELECT * FROM questions WHERE id = ?', [questionId]);
    return rows[0]; // מחזיר את השאלה הבודדת או undefined
};

// 4. עדכון שאלה קיימת
const update = async (questionId, questionText, correctAnswer, hintText) => {
    await db.query(
        'UPDATE questions SET question_text = ?, correct_answer = ?, hint_text = ? WHERE id = ?',
        [questionText, correctAnswer, hintText, questionId]
    );
};

// 5. מחיקת שאלה בודדת
const remove = async (questionId) => {
    await db.query('DELETE FROM questions WHERE id = ?', [questionId]);
};

export default {
    create,
    findSafeByRoom,
    findByRoom,
    findById,
    update,
    remove
};