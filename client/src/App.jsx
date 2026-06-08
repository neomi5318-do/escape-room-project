
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
function App() {
  return (
    <Routes>
      {/* אם מישהו נכנס לנתיב הראשי, נעביר אותו ישר לדף ההתחברות */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* הנתיב של עמוד ההתחברות */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* פה נוסיף בהמשך את ה-Register, ואת העמודים של המפתח והשחקן */}
    </Routes>
  );
}

export default App;