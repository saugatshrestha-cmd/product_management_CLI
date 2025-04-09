import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface DataObject {
    data: any[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const getDataPath = (filename: string) =>
    path.join(__dirname, '..', '..', 'data', filename); 

export const loadData = (filename: string) => {
    const filePath = getDataPath(filename);
    const fileContent = readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
};

export const saveData = (filename: string, data: DataObject) => {
    const filePath = getDataPath(filename);
    writeFileSync(filePath, JSON.stringify(data, null, 2));
};
