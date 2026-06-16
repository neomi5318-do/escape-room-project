import React, { useState, useContext } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom'; // 1. הוספנו את Navigate לייבוא
import { loginUser } from '../api/authApi';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal/Modal';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // 2. משכנו גם את ה-user מהקונטקסט כדי לדעת אם מישהו כבר מחובר
    const { authenticate, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // ==== שומר הסף של הלוגין (הגנה מפני החץ "אחורה") ====
    // אם המערכת מזהה שאת כבר מחוברת, היא בועטת אותך מיד לעמוד שלך 
    // ה-replace מוחק את העמוד הזה מההיסטוריה כדי שלא תוכלי לחזור אליו שוב!
    if (user) {
        return <Navigate to={user.role === 'developer' ? '/developer' : '/lobby'} replace />;
    }
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError(''); 

        try {
            const data = await loginUser(username, password);
            
            if (data.success) {
                authenticate(data.user, data.token);

                // 3. הוספנו את { replace: true } לניווט אחרי התחברות מוצלחת
                // זה מבטיח שהלוגין נמחק מהיסטוריית הדפדפן מרגע שנכנסת
                if (data.user.role === 'developer') {
                    navigate('/developer', { replace: true }); 
                } else {
                    navigate('/lobby', { replace: true }); 
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'אירעה שגיאה בהתחברות. אנא נסה שוב.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h2>התחברות למערכת</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <input
                    type="text"
                    placeholder="שם משתמש"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <input
                    type="password"
                    placeholder="סיסמה"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ padding: '10px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
                    היכנס
                </button>
            </form>
            
            <p style={{ marginTop: '20px' }}>
                עדיין אין לך משתמש? <Link to="/register" style={{ color: '#008CBA', fontWeight: 'bold' }}>הירשם כאן</Link>
            </p>

            {error && (
                <Modal 
                    title="שגיאה בהתחברות"
                    titleColor="#ef4444"
                    message={error}
                    confirmText="סגור ונסה שוב"
                    confirmType="danger"
                    onConfirm={() => setError('')} 
                />
            )}
        </div>
    );
};

export default Login;