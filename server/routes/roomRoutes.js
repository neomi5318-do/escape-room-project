
import express from 'express';
import roomController from '../controllers/roomController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validationMiddleware from '../middleware/validationMiddleware.js';

const router = express.Router();

// חסימה הרמטית וולידציה: יצירת חדר דורשת טוקן, הרשאת מפתח, ונתונים תקינים
router.post('/create',
    authMiddleware.verifyToken,
    authMiddleware.restrictTo('developer'),
    validationMiddleware.validateRoomInput,
    roomController.createRoom
);

// עדכון ומחיקה של חדרים
router.put('/update/:id',
     authMiddleware.verifyToken,
      authMiddleware.restrictTo('developer'),
       roomController.updateRoom
    );

router.delete('/delete/:id',
     authMiddleware.verifyToken, 
     authMiddleware.restrictTo('developer'),
      roomController.deleteRoom
    );

export default router;