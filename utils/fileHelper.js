import fs from 'fs';

// Load data from JSON file
function loadData(file) {
    try {
        const json = fs.readFileSync(file, 'utf8');
        return json ? JSON.parse(json) : { data: [] };
    } catch (error) {
        console.error(`Error loading ${file}:`, error);
        return { data: [] };
    }
}


// Save data to JSON file
function saveData(file, dataObj) {
    try {
        fs.writeFileSync(file, JSON.stringify(dataObj, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error saving ${file}:`, error);
    }
}


export { loadData, saveData };
