
import React, { createContext, useState, useEffect } from 'react';

// יצירת ה-Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // בדיקה אוטומטית ברענון הדף (F5) - האם המשתמש כבר היה מחובר?
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser)); // הופכים את הטקסט חזרה לאובייקט JavaScript
        }
        setLoading(false); // סיימנו לבדוק, האפליקציה מוכנה לפעולה
    }, []);

    // פונקציה שתופעל מהעמוד של ה-Login אחרי שהשרת החזיר תשובה מושלמת
    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // לוקל סטורג' יודע לשמור רק טקסט
        localStorage.setItem('token', token); // שומרים את ה-JWT
    };

    // פונקציית התנתקות מהמערכת
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};