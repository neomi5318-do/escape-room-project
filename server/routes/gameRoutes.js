import express from 'express';
import gameController from '../controllers/gameController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// כל פעולות המשחק דורשות משתמש מחובר (בין אם הוא פלייר או מפתח שבודק את החדר)
router.post('/room/:roomId/enter', authMiddleware.verifyDeveloper, gameController.enterRoom);
router.post('/question/:questionId/hint', authMiddleware.verifyDeveloper, gameController.requestHint);
router.post('/question/:questionId/submit', authMiddleware.verifyDeveloper, gameController.submitAnswer);
router.post('/room/:roomId/finish', authMiddleware.verifyDeveloper, gameController.finishRoom);

export default router;