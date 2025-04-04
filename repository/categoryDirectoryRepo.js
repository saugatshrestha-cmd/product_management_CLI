import { loadData, saveData } from '../utils/fileHelper.js';
import FILE_PATHS from '../constants/filePaths.js';

let categories = loadData(FILE_PATHS.CATEGORIES).data;

let categoryIdCounter = categories.length ? categories[categories.length - 1].id + 1 : 1;

function getNewId() {
    return categoryIdCounter++;
}

// Save category to JSON file
function saveCategory() {
    saveData(FILE_PATHS.CATEGORIES, { data: categories });
}

function addCategory(categoryData) {
    const newCategory = { ...categoryData, id: getNewId() };
}

export { categories, addCategory, saveCategory}