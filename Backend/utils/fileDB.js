import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, '../data/threads.json');

// Ensure data directory exists
const ensureDataDir = () => {
    const dataDir = path.dirname(DB_FILE);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
};

// Read threads from file
const readThreads = () => {
    ensureDataDir();
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error('Error reading threads:', error);
        return [];
    }
};

// Write threads to file
const writeThreads = (threads) => {
    ensureDataDir();
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(threads, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing threads:', error);
        return false;
    }
};

export { readThreads, writeThreads };
