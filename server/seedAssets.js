
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './config/db.js';

// הגדרת __dirname בסביבת ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// התיקייה הראשית שבה נמצאים הנכסים (server/public/assets)
const BASE_ASSETS_DIR = path.join(__dirname, 'public', 'assets');

// מיפוי התיקיות הפיזיות לסוג ה-ENUM המתאים בבסיס הנתונים
const foldersToScan = [
    { name: 'images', type: 'image' },
    { name: 'audio', type: 'audio' }
];
