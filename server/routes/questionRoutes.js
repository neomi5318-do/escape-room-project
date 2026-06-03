import express from 'express';
import questionController from '../controllers/questionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// נתיבים שדורשים את ה-ID של החדר (נפוץ ביצירה ושליפה של הכל)
router.post('/:roomId/questions', authMiddleware.verifyDeveloper, questionController.createQuestion);
router.get('/:roomId/questions', authMiddleware.verifyDeveloper, questionController.getRoomQuestions);

// נתיבים שדורשים את ה-ID של השאלה עצמה (לצורך עדכון ומחיקה של שאלה ספציפית)
router.put('/questions/update/:id', authMiddleware.verifyDeveloper, questionController.updateQuestion);
router.delete('/questions/delete/:id', authMiddleware.verifyDeveloper, questionController.deleteQuestion);

export default router;
