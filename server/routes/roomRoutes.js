import express from 'express';
import roomController from '../controllers/roomController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// חסימה הרמטית: רק מפתחים יכולים לייצר, לעדכן או למחוק חדרים!
router.post('/create', authMiddleware.verifyToken, authMiddleware.restrictTo('developer'), roomController.createRoom);
router.put('/update/:id', authMiddleware.verifyToken, authMiddleware.restrictTo('developer'), roomController.updateRoom);
router.delete('/delete/:id', authMiddleware.verifyToken, authMiddleware.restrictTo('developer'), roomController.deleteRoom);

export default router;