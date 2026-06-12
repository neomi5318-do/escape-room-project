import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyRooms, deleteRoom } from '../api/roomApi'; 

import Navbar from '../components/Navbar';
import RoomCard from '../components/RoomCard';
import Modal from '../components/Modal'; // הייבוא של המודאל!
import { useFetch } from '../hooks/useFetch'; 

const DeveloperDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // שואבים נתונים עם ההוק שלנו
    const { data, loading, error } = useFetch(getMyRooms, token);
    const [myRooms, setMyRooms] = useState([]);

    // סטייטים חדשים לשליטה על המודאלים!
    const [roomToDelete, setRoomToDelete] = useState(null); // ישמור איזה חדר למחוק
    const [successMessage, setSuccessMessage] = useState(''); // ישמור הודעת הצלחה אם צריך

    useEffect(() => {
        if (data && data.rooms) {
            setMyRooms(data.rooms);
        }
    }, [data]);

    useEffect(() => {
        if (!token) navigate('/login');
    }, [token, navigate]);

    const handleCreateNewRoom = () => navigate('/developer/create-room');
    const handleEditRoom = (roomId) => navigate(`/developer/edit-room/${roomId}`);
    const handleManageQuestions = (roomId) => navigate(`/manage-room/${roomId}`);

    // פונקציה 1: מדליקה את מודאל האזהרה (נשלחת לכרטיסייה)
    const handleDeleteClick = (roomId) => {
        setRoomToDelete(roomId); 
    };

    // פונקציה 2: מופעלת רק אם המשתמש לחץ "כן, מחק!" בתוך המודאל
    const executeDelete = async () => {
        try {
            await deleteRoom(roomToDelete, token);
            setMyRooms(myRooms.filter(room => room.id !== roomToDelete));
            setRoomToDelete(null); // מכבה את מודאל האזהרה
            setSuccessMessage('האתגר נמחק בהצלחה! 🗑️'); // מדליק את מודאל ההצלחה
        } catch (err) {
            alert('שגיאה במחיקת האתגר.');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '20px' }}>טוען את נתוני הדאשבורד... ⏳</div>;

    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif', color: '#1f2937' }}>
            <Navbar />

            <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>ניהול האתגרים שלי</h1>
                        <p style={{ margin: 0, color: '#6b7280' }}>כאן תוכל ליצור ולנהל את ההרפתקאות שהשחקנים יחוו.</p>
                    </div>

                    <button
                        onClick={handleCreateNewRoom}
                        style={{ backgroundColor: '#8b5cf6', color: 'white', border: 'none', padding: '15px 30px', fontSize: '18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(139, 92, 246, 0.3)' }}
                    >
                        ➕ צור אתגר חדש
                    </button>
                </div>

                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                <h2 style={{ fontSize: '22px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px', marginBottom: '20px' }}>היצירות שלי</h2>

                {myRooms.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '12px', color: '#9ca3af' }}>
                        עדיין לא יצרת אתגרים. לחץ על "צור אתגר חדש" כדי להתחיל את הקסם! ✨
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {myRooms.map(room => (
                            <RoomCard 
                                key={room.id} 
                                room={room} 
                                onManage={handleManageQuestions} 
                                onEdit={handleEditRoom} 
                                onDelete={handleDeleteClick} // שלחנו את הפונקציה שרק מדליקה את המודאל
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* אזור המודאלים - הם לא תופסים מקום על המסך אלא קופצים רק כשהסטייט מתמלא */}
            
            {/* מודאל 1: אזהרה לפני מחיקה */}
            {roomToDelete && (
                <Modal 
                    title="מחיקת חדר"
                    message="האם אתה בטוח שברצונך למחוק אתגר זה לצמיתות? הפעולה הזו תמחק גם את כל החידות שבתוכו."
                    confirmText="כן, מחק הכל"
                    confirmType="danger"
                    onConfirm={executeDelete} 
                    cancelText="ביטול"
                    onCancel={() => setRoomToDelete(null)} 
                />
            )}

            {/* מודאל 2: הודעת הצלחה */}
            {successMessage && (
                <Modal 
                    title="פעולה הושלמה"
                    titleColor="#10b981"
                    message={successMessage}
                    confirmText="המשך"
                    confirmType="success"
                    onConfirm={() => setSuccessMessage('')} // לחיצה על המשך מאפסת את ההודעה וסוגרת את המודאל
                />
            )}

        </div>
    );
};

export default DeveloperDashboard;