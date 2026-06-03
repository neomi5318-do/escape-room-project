import db from '../config/db.js';
// שליפת פרטי החדר המלאים יחד עם הקישורים (URL) של התמונה והסאונד מה-assets
const getFullRoomDetails = async (roomId) => {
    const query = `
        SELECT r.id, r.title, r.timer_seconds, r.difficulty_level,
               img.file_path AS bg_image_url,
               aud.file_path AS bg_audio_url
        FROM rooms r
        LEFT JOIN assets img ON r.bg_image_id = img.id
        LEFT JOIN assets aud ON r.bg_audio_id = aud.id
        WHERE r.id = ?
    `;
    const [rows] = await db.query(query, [roomId]);
    return rows[0];
};

// שליפת אלמנטים מיוחדים שיש בחדר (כמו פופ-אפים ומפות)
const getRoomElements = async (roomId) => {
    const query = `
        SELECT e.id, e.element_type, e.button_label, a.file_path AS asset_url
        FROM room_elements e
        LEFT JOIN assets a ON e.asset_id = a.id
        WHERE e.room_id = ?
    `;
    const [rows] = await db.query(query, [roomId]);
    return rows;
};


const create = async (title, creatorId, bg_image_id, bg_audio_id, timer_seconds, min_points_required, difficulty_level) => {
    const [result] = await db.query(
        `INSERT INTO rooms 
        (title, creator_id, bg_image_id, bg_audio_id, timer_seconds, min_points_required, difficulty_level) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, creatorId, bg_image_id, bg_audio_id, timer_seconds, min_points_required, difficulty_level]
    );
    return result.insertId;
};

// 2. מציאת כל החדרים שנוצרו על ידי מפתח ספציפי
const findByCreator = async (creatorId) => {
    const [rows] = await db.query('SELECT * FROM rooms WHERE creator_id = ?', [creatorId]);
    return rows;
};

// 3. עדכון חדר קיים
const update = async (roomId, title, bgImageId, bgAudioId, timerSeconds, minPoints, difficulty) => {
    await db.query(
        `UPDATE rooms 
        SET title = ?, bg_image_id = ?, bg_audio_id = ?, timer_seconds = ?, min_points_required = ?, difficulty_level = ? 
        WHERE id = ?`,
        [title, bgImageId, bgAudioId, timerSeconds, minPoints, difficulty, roomId]
    );
};

// 4. מחיקת חדר (בגלל שהגדרנו ON DELETE CASCADE ב-SQL, זה ימחק אוטומטית גם את השאלות שלו!)
const remove = async (roomId) => {
    await db.query('DELETE FROM rooms WHERE id = ?', [roomId]);
};

export default {
    getFullRoomDetails,
    getRoomElements,
    create,
    findByCreator,
    update,
    remove
};