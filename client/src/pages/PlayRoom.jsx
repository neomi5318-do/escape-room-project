import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { enterRoom, submitPlayerAnswer, finishPlayerRoom } from '../api/gameApi';
import Navbar from '../components/Navbar/Navbar';

const PlayRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    // שמירת הנתונים שמגיעים מהשרת
    const [gameData, setGameData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // מתחילים משאלה 0
    
    // ניהול הטופס וההודעות לשחקן
    const [answerInput, setAnswerInput] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // כשהעמוד עולה - נכנסים לחדר!
    useEffect(() => {
        const startGame = async () => {
            try {
                const res = await enterRoom(roomId);
                if (res && res.success) {
                    setGameData(res.gameData); // שומרים את נתוני החדר, השאלות והאלמנטים
                } else {
                    setMessage('שגיאה בטעינת החדר: ' + (res?.message || ''));
                }
            } catch (err) {
                setMessage('שגיאה בחיבור לשרת או שאין שאלות בחדר הזה.');
            } finally {
                setLoading(false);
            }
        };
        startGame();
    }, [roomId]);

    // פונקציה לבדיקת התשובה של השחקן
    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        setMessage('בודק תשובה... ⏳');

        const currentQuestion = gameData.questions[currentQuestionIndex];

        try {
            const res = await submitPlayerAnswer(currentQuestion.id, answerInput);
            
            if (res.isCorrect) {
                setMessage(`✅ ${res.message}`); // הודעת הצלחה מהשרת
                setAnswerInput(''); // מנקים את שדה הטקסט
                
                // בודקים אם יש עוד שאלות בחדר
                if (currentQuestionIndex + 1 < gameData.questions.length) {
                    setTimeout(() => {
                        setCurrentQuestionIndex(prev => prev + 1); // עוברים לשאלה הבאה
                        setMessage('');
                    }, 2500); // נותנים לשחקן שניה וחצי לראות שהוא צדק
                } else {
                    // אם זו הייתה השאלה האחרונה - מסיימים את החדר!
                    await finishPlayerRoom(roomId);
                    setTimeout(() => {
                        alert('🏆 אלופים! סיימתם את החדר בהצלחה!');
                        navigate('/lobby'); // חזרה ללובי (תשני לנתיב של הלובי שלך אם הוא שונה)
                    }, 2000);
                }
            } else {
                setMessage(`❌ ${res.message}`); // הודעת שגיאה מהשרת
            }
        } catch (err) {
            setMessage('שגיאה בבדיקת התשובה.');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '24px' }}>טוען את החדר ומכין את החידות... ⏳</div>;
    if (!gameData || !gameData.questions) return <div style={{ textAlign: 'center', color: 'red', marginTop: '100px' }}>{message || 'לא ניתן לטעון את המשחק.'}</div>;

    // שולפים את השאלה הנוכחית מתוך המערך כדי להציג אותה
    const currentQ = gameData.questions[currentQuestionIndex];
    // נתיב תמונת הרקע (אם יש)
    const bgUrl = gameData.room.bg_image_url ? `http://localhost:5000${gameData.room.bg_image_url}` : '';

    return (
        <div style={{ 
            minHeight: '100vh', direction: 'rtl', 
            backgroundImage: bgUrl ? `url(${bgUrl})` : 'none', 
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#1f2937' 
        }}>
            <Navbar />
            
            <div style={{ maxWidth: '650px', margin: '40px auto', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                
                {/* כותרת החדר והתקדמות */}
                <h1 style={{ color: '#8b5cf6', textAlign: 'center', margin: '0 0 10px 0' }}>{gameData.room.title}</h1>
                <div style={{ textAlign: 'center', marginBottom: '20px', color: '#4b5563', fontWeight: 'bold', fontSize: '18px' }}>
                    שלב {currentQuestionIndex + 1} מתוך {gameData.questions.length}
                </div>

                <hr style={{ borderColor: '#e5e7eb', marginBottom: '20px' }} />

                {/* תוכן השאלה */}
                <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #d1d5db' }}>
                    {currentQ.story_text && (
                        <p style={{ color: '#374151', marginBottom: '15px', fontStyle: 'italic', fontSize: '16px', lineHeight: '1.5' }}>
                            {currentQ.story_text}
                        </p>
                    )}
                    <h2 style={{ margin: '0', color: '#111827' }}>{currentQ.question_text}</h2>
                </div>

                {/* טופס התשובה */}
                <form onSubmit={handleAnswerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="text" 
                        value={answerInput} 
                        onChange={(e) => setAnswerInput(e.target.value)} 
                        placeholder="הזן את התשובה שלך כאן..." 
                        required 
                        style={{ padding: '15px', borderRadius: '8px', border: '2px solid #d1d5db', fontSize: '18px' }}
                    />
                    <button type="submit" style={{ padding: '15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
                        בדוק תשובה 🔍
                    </button>
                </form>

                {/* הודעות מערכת */}
                {message && (
                    <div style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px', backgroundColor: message.includes('❌') ? '#fee2e2' : '#d1fae5', color: message.includes('❌') ? '#ef4444' : '#10b981' }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayRoom;