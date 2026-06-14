import db from '../config/db.js'; // השורה הקריטית שחסרה לנו!
export const getAssetsPaginated = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const type = req.query.type; // 'image' או 'audio'
        const offset = (page - 1) * limit;

        // סופרים כמה פריטים יש בסך הכל (עם השם החדש והנקי: type)
        const [countResult] = await db.query(
            'SELECT COUNT(*) as total FROM assets WHERE type = ?',
            [type]
        );
        const totalAssets = countResult[0].total;

        // שולפים את הנתונים (עם השמות החדשים והנקיים: type, file_url)
        const [assets] = await db.query(
            'SELECT id, type, name, file_url FROM assets WHERE type = ? LIMIT ? OFFSET ?',
            [type, limit, offset]
        );

        res.json({
            success: true,
            assets: assets,
            hasMore: offset + assets.length < totalAssets
        });
    } catch (error) {
        console.error('Error fetching paginated assets:', error);
        res.status(500).json({ success: false, message: 'שגיאה במשיכת מאגר האלמנטים' });
    }
};