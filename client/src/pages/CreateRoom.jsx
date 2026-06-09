import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createRoom } from '../api/roomApi';

const CreateRoom = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // סטייט שמחזיק את כל נתוני הטופס
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        timer_minutes: 15, // הלקוח יבחר בדקות, אנחנו נמיר לשניות לשרת
        difficulty_level: 1,
        min_points_required: 0,
        theme_id: 1 // נושא/אווירה (יקבע איזה תמונה תהיה מהמאגר)
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // עדכון הסטייט כשמשנים שדה בטופס
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // שליחת הטופס לשרת
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // הכנת הנתונים בדיוק כמו שה-SQL שלנו מצפה לקבל
            const roomDataForServer = {
                title: formData.title,
                description: formData.description,
                timer_seconds: formData.timer_minutes * 60, // המרה לשניות
                difficulty_level: formData.difficulty_level,
                min_points_required: formData.min_points_required,
                // נשתמש ב-theme_id בתור ה-ID של התמונה בטבלת assets
                cover_image_id: formData.theme_id, 
                bg_image_id: formData.theme_id,
                bg_audio_id: null // בינתיים נשאיר בלי סאונד עד שנוסיף מנגינות
            };

            const data = await createRoom(roomDataForServer, token);
            if (data.success) {
                alert('האתגר נוצר בהצלחה! 🎉');
                navigate('/developer'); // מחזירים אותו לדאשבורד
            }
        } catch (err) {
            setError(err.response?.data?.message || 'שגיאה ביצירת האתגר.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px', marginBottom: '30px' }}>
                    <h1 style={{ margin: 0, color: '#8b5cf6' }}>יצירת אתגר חדש</h1>
                    <button onClick={() => navigate('/developer')} style={{ background: 'none', border: '1px solid #d1d5db', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}>
                        חזור לדאשבורד
                    </button>
                </div>

                {error && <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* שם האתגר */}
                    <div>
                        <label style={labelStyle}>שם האתגר (קצר ומושך):</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required style={inputStyle} placeholder="לדוגמה: הפריצה למעבדת הסייבר..." />
                    </div>

                    {/* סיפור רקע */}
                    <div>
                        <label style={labelStyle}>סיפור עלילתי / תיאור המשימה:</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="ספר לשחקן מה קרה פה ומה המטרה שלו..."></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '20px' }}>
                        {/* בחירת אווירה */}
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>אווירת החדר (תמונת רקע):</label>
                            <select name="theme_id" value={formData.theme_id} onChange={handleChange} style={inputStyle}>
                                <option value="1">💻 מעבדת האקרים סודית</option>
                                <option value="2">🌲 יער מכושף ורפאים</option>
                                <option value="3">🏰 טירה עתיקה וקסומה</option>
                                <option value="4">🏢 משרד מנכ"ל נעול</option>
                            </select>
                        </div>

                        {/* זמן מוקצב */}
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>זמן לפתרון (בדקות):</label>
                            <input type="number" name="timer_minutes" min="1" max="60" value={formData.timer_minutes} onChange={handleChange} required style={inputStyle} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px' }}>
                        {/* רמת קושי */}
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>רמת קושי (1-5):</label>
                            <input type="number" name="difficulty_level" min="1" max="5" value={formData.difficulty_level} onChange={handleChange} required style={inputStyle} />
                        </div>

                        {/* נקודות לפתיחה */}
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>נקודות דרושות לכניסה:</label>
                            <input type="number" name="min_points_required" min="0" step="50" value={formData.min_points_required} onChange={handleChange} required style={inputStyle} />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={{ marginTop: '20px', padding: '15px', backgroundColor: '#8b5cf6', color: 'white', fontSize: '18px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                        {loading ? 'שומר נתונים...' : '🚀 צור אתגר והמשך להוספת חידות'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// עיצובים חוזרים
const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#4b5563' };
const inputStyle = { width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px', boxSizing: 'border-box' };

export default CreateRoom;