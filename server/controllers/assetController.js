import db from '../config/db.js'; 

export const getAssetsPaginated = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const type = req.query.type; // 'image', 'audio', או 'popup'
        const offset = (page - 1) * limit;

        // 1. ספירה (חשוב לשים לב לשם העמודה המדויק)
        const [countResult] = await db.query(
            'SELECT COUNT(*) as total FROM assets WHERE asset_type = ?',
            [type]
        );
        const totalAssets = countResult[0].total;

        // 2. שליפה (כאן נעשה את ה-AS כדי שה-React יקבל מה שהוא מצפה לו)
        const [assets] = await db.query(
            `SELECT id, asset_type AS type, name, file_path AS file_url 
             FROM assets 
             WHERE asset_type = ? 
             LIMIT ? OFFSET ?`,
            [type, limit, offset]
        );

        res.json({
            success: true,
            assets: assets, // כאן ה-assets יגיעו עם השדות: id, type, name, file_url
            hasMore: offset + assets.length < totalAssets
        });
    } catch (error) {
        console.error('Error fetching paginated assets:', error);
        res.status(500).json({ success: false, message: 'שגיאה במשיכת מאגר האלמנטים' });
    }
};
