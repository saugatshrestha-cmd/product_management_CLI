import { loadData, saveData } from '../utils/fileHelper.js';
import FILE_PATHS from '../constants/filePaths.js';

let categories = loadData(FILE_PATHS.CATEGORIES).data;


function getNewId() {
    return categories.length ? categories[categories.length - 1].id + 1 : 1;
}

// Save category to JSON file
function saveCategory() {
    saveData(FILE_PATHS.CATEGORIES, { data: categories });
}

function addCategory(categoryData) {
    const newCategoryId = getNewId();
    const newCategory = {  id: newCategoryId, ...categoryData }; 
    categories.push(newCategory);
    saveCategory();
}

function deleteCategoryById(categoryId) {
    const initialLength = categories.length;
    categories = categories.filter(category => category.id !== categoryId);
    saveCategory();
    return initialLength !== categories.length;
}

export { categories, addCategory, deleteCategoryById, saveCategory}