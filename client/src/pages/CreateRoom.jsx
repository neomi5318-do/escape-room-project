import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../api/roomApi';
import Navbar from '../components/Navbar/Navbar';
import Modal from '../components/Modal/Modal';
import RoomForm from '../components/RoomForm/RoomForm'; // מייבאים את הטופס הגנרי!

const CreateRoom = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '', description: '', timer_minutes: 15,
        difficulty_level: 1, min_points_required: 0,
        cover_image_id: 1, bg_image_id: 1     
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successModal, setSuccessModal] = useState({ show: false, nextRoute: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');

        try {
            const roomDataForServer = {
                ...formData,
                timer_seconds: formData.timer_minutes * 60,
                bg_audio_id: null
            };

            const data = await createRoom(roomDataForServer);

            if (data.success) {
                const newRoomId = data.roomId || data.id;
                setSuccessModal({ show: true, nextRoute: newRoomId ? `/manage-room/${newRoomId}` : '/developer' });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'שגיאה ביצירת האתגר.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif', direction: 'rtl' }}>
            <Navbar />
            <div style={{ padding: '40px 20px' }}>
                {error && <div style={{ maxWidth: '800px', margin: '0 auto 20px auto', backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>{error}</div>}
                
                {/* קוראים לטופס הגנרי! */}
                <RoomForm 
                    formData={formData} 
                    handleChange={handleChange} 
                    handleSubmit={handleSubmit} 
                    loading={loading} 
                    isEdit={false} 
                />
            </div>

            {successModal.show && (
                <Modal title="פעולה הושלמה" titleColor="#10b981" message="ההגדרות נשמרו! אפשר להתקדם להוספת חידות." confirmText="המשך לשלב הבא 🚀" confirmType="success" onConfirm={() => navigate(successModal.nextRoute)} />
            )}
        </div>
    );
};

export default CreateRoom;