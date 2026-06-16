import React, { useState, useEffect } from 'react';
import { getRoomElements, createRoomElement, deleteRoomElement } from '../../api/roomElementApi';
import './RoomElementsManager.css';

export default function RoomElementsManager({ roomId }) {
    const [elements, setElements] = useState([]);
    const [assets, setAssets] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    // סטייט לטופס יצירה חדש
    const [buttonLabel, setButtonLabel] = useState('');
    const [elementType, setElementType] = useState('scroll'); 
    const [elementText, setElementText] = useState('');
    const [selectedAssetId, setSelectedAssetId] = useState('');

    // 1. טעינת האלמנטים של החדר ברגע שהקומפוננטה עולה
    useEffect(() => {
        if (!roomId) return;
        
        const loadRoomData = async () => {
            try {
                const elementsData = await getRoomElements(roomId);
                setElements(elementsData);
                setLoading(false);
            } catch (err) {
                console.error("שגיאה בטעינת הרכיבים:", err);
                setLoading(false);
            }
        };

        loadRoomData();
    }, [roomId]);

    // 2. משיכת תמונות מהשרת באופן אוטומטי כשבוחרים בסוג "תמונה/מפה"
    useEffect(() => {
        if (elementType === 'image') {
            fetch('/api/assets?type=image')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setAssets(data.assets);
                    }
                })
                .catch(err => console.error("שגיאה בטעינת המאגר:", err));
        }
    }, [elementType]);

    // שמירת אלמנט חדש
    const handleAddElement = async (e) => {
        e.preventDefault();
        
        const payload = {
            element_type: elementType,
            button_label: buttonLabel,
            element_text: elementType === 'scroll' ? elementText : null,
            asset_id: elementType === 'image' ? selectedAssetId : null
        };

        try {
            await createRoomElement(roomId, payload);
            
            // רענון הרשימה לאחר הוספה
            const updatedData = await getRoomElements(roomId);
            setElements(updatedData);
            
            // איפוס שדות רלוונטיים
            setButtonLabel('');
            setElementText('');
            setSelectedAssetId('');
            alert('האלמנט נוסף לחדר בהצלחה! 🎉');
        } catch (err) {
            alert('תקלה בשמירת האלמנט');
        }
    };

    // מחיקת אלמנט
    const handleDelete = async (id) => {
        if (!window.confirm('האם למחוק אלמנט זה מהחדר?')) return;
        try {
            await deleteRoomElement(id);
            setElements(elements.filter(el => el.id !== id));
        } catch (err) {
            alert('תקלה במחיקת האלמנט');
        }
    };

    if (loading) return <div className="loading-state">טוען אלמנטים... ⏳</div>;

    return (
        <div className="elements-manager-card">
            <h3 className="manager-title">🛠️ ניהול אביזרים ופופ-אפים</h3>
            
            {/* רשימת האלמנטים הפעילים בחדר */}
            <div className="active-elements-section">
                <h4 className="section-subtitle">אלמנטים פעילים במשחק:</h4>
                {elements.length === 0 ? (
                    <p className="empty-state">אין עדיין אלמנטים מיוחדים בחדר זה.</p>
                ) : (
                    <div className="elements-list">
                        {elements.map(el => (
                            <div key={el.id} className="element-item">
                                <span className="element-info">
                                    {el.element_type === 'scroll' && '📜 '}
                                    {el.element_type === 'image' && '🗺️ '}
                                    {el.element_type === 'hourglass' && '⏳ '}
                                    <strong className="element-label">{el.button_label}</strong>
                                </span>
                                <button onClick={() => handleDelete(el.id)} className="element-delete-btn">
                                    ✖ מחק
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <hr className="manager-divider" />

            {/* טופס הוספה חדש */}
            <form onSubmit={handleAddElement} className="add-element-form">
                <h4 className="section-subtitle">הוספת אלמנט חדש:</h4>
                
                <div className="form-group">
                    <label className="form-label">שם הכפתור לשחקן:</label>
                    <input 
                        type="text" 
                        value={buttonLabel} 
                        onChange={(e) => setButtonLabel(e.target.value)} 
                        placeholder="למשל: פתח מגילה סודית, בדוק מפה" 
                        required 
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">סוג האלמנט שייפתח:</label>
                    <select 
                        value={elementType} 
                        onChange={(e) => setElementType(e.target.value)}
                        className="form-select"
                    >
                        <option value="scroll">📜 מגילה עתיקה (הזנת טקסט חופשי)</option>
                        <option value="image">🗺️ תמונה מוכנה / מפה מהמאגר</option>
                        <option value="hourglass">⏳ שעון חול (סנכרון דינמי לטיימר)</option>
                    </select>
                </div>

                {/* שדה טקסט דינמי למגילה */}
                {elementType === 'scroll' && (
                    <div className="form-group">
                        <label className="form-label">תוכן המגילה:</label>
                        <textarea 
                            value={elementText} 
                            onChange={(e) => setElementText(e.target.value)} 
                            placeholder="הקלידו את הסיפור או הרמז שיוצג על גבי הקלף..."
                            required
                            className="form-textarea"
                        />
                    </div>
                )}

                {/* בחירת קובץ מהמאגר עבור תמונה */}
                {elementType === 'image' && (
                    <div className="form-group">
                        <label className="form-label">בחר קובץ מהמאגר:</label>
                        <select 
                            value={selectedAssetId} 
                            onChange={(e) => setSelectedAssetId(e.target.value)} 
                            required
                            className="form-select"
                        >
                            <option value="">-- בחר תמונה --</option>
                            {assets.map(asset => (
                                <option key={asset.id} value={asset.id}>{asset.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {elementType === 'hourglass' && (
                    <p className="helper-text">
                        💡 אין צורך בקובץ או טקסט. המערכת תציג שעון חול אינטראקטיבי שמסונכרן עם הזמן שנותר לחדר.
                    </p>
                )}

                <button type="submit" className="submit-btn">
                    + הוסף אלמנט לחדר
                </button>
            </form>
        </div>
    );
}

