// middleware/validationMiddleware.js

const validateRoomInput = (req, res, next) => {
    const { title, timer_seconds } = req.body;
    
    // בדיקה האם הנתונים חסרים או ריקים
    if (!title || !timer_seconds) {
        return res.status(400).json({ 
            success: false, 
            message: "שגיאת ולידציה: חובה לספק כותרת (title) וטיימר (timer_seconds)" 
        });
    }
    
    // אם הכל תקין, מעבירים את השרביט לקונטרולר
    next();
};

export default { validateRoomInput };