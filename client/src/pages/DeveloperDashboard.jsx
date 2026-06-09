import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getMyRooms, deleteRoom } from '../api/roomApi'; // החיבור האמיתי לשרת שלנו!

const DeveloperDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    // סטייטים לשמירת הנתונים שמגיעים מהשרת
    const [myRooms, setMyRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');

    // ברגע שהעמוד עולה - מבקשים מהשרת את רשימת האתגרים שהמפתח הזה יצר
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await getMyRooms(token);
                if (data.success) {
                    setMyRooms(data.rooms);
                }
            } catch (err) {
                setError('שגיאה בטעינת האתגרים שלך.');
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchRooms();
        else navigate('/login');
    }, [token, navigate]);

    // פונקציית התנתקות
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // הפונקציה שמופעלת בלחיצה על "צור אתגר חדש" - מעבירה לעמוד הטופס שבנינו!
    const handleCreateNewRoom = () => {
        navigate('/developer/create-room'); 
    };

    // פונקציית מעבר לעריכת חדר
    const handleEditRoom = (roomId) => {
        navigate(`/developer/edit-room/${roomId}`);
    };

    // פונקציית מחיקת חדר
    const handleDeleteRoom = async (roomId) => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק אתגר זה לצמיתות?')) {
            try {
                await deleteRoom(roomId, token);
                // מעדכנים את המסך מיד: מסננים החוצה את החדר שנמחק
                setMyRooms(myRooms.filter(room => room.id !== roomId));
                alert('האתגר נמחק בהצלחה! 🗑️');
            } catch (err) {
                alert('שגיאה במחיקת האתגר.');
            }
        }
    };

    // מסך טעינה בזמן שהנתונים מגיעים
    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '20px' }}>טוען את נתוני הדאשבורד... ⏳</div>;

    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif', color: '#1f2937' }}>
            
            {/* סרגל ניווט מפתחים */}
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#ffffff', borderBottom: '3px solid #8b5cf6', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2 style={{ margin: 0, color: '#8b5cf6', letterSpacing: '1px' }}>🛠️ סטודיו מפתחים</h2>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <span>שלום יוצר, <b>{user?.username}</b></span>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}>התנתקות</button>
                </div>
            </nav>

            <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
                
                {/* אזור פעולה ראשי */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>ניהול האתגרים שלי</h1>
                        <p style={{ margin: 0, color: '#6b7280' }}>כאן תוכל ליצור ולנהל את ההרפתקאות שהשחקנים יחוו.</p>
                    </div>
                    
                    {/* הכפתור שמנווט לעמוד יצירת החדר */}
                    <button 
                        onClick={handleCreateNewRoom}
                        style={{ backgroundColor: '#8b5cf6', color: 'white', border: 'none', padding: '15px 30px', fontSize: '18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(139, 92, 246, 0.3)' }}
                    >
                        ➕ צור אתגר חדש
                    </button>
                </div>

                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                <h2 style={{ fontSize: '22px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px', marginBottom: '20px' }}>היצירות שלי</h2>
                
                {/* הצגת החדרים שחזרו מהשרת */}
                {myRooms.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '12px', color: '#9ca3af' }}>
                        עדיין לא יצרת אתגרים. לחץ על "צור אתגר חדש" כדי להתחיל את הקסם! ✨
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {myRooms.map(room => (
                            <div key={room.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
                                <h3 style={{ margin: '0 0 10px 0', color: '#111827' }}>{room.title}</h3>
                                <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#6b7280' }}>
                                    ⏱️ זמן: {Math.floor(room.timer_seconds / 60)} דקות
                                </p>
                                
                                <div style={{ display: 'flex', gap: '10px', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #f3f4f6' }}>
                                    <button onClick={() => handleEditRoom(room.id)} style={{ flex: 1, padding: '8px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#4b5563' }}>✏️ עריכה</button>
                                    <button onClick={() => handleDeleteRoom(room.id)} style={{ flex: 1, padding: '8px', backgroundColor: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#ef4444' }}>🗑️ מחיקה</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeveloperDashboard;