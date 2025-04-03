import { dataStore, saveCategory, getNewCategoryId } from "./fileService.js";

//Check if category exists
function isCategoryExists(name) {
    return dataStore.category.some(category => category.name.toLowerCase() === name.toLowerCase());
}

//Find category by id
function findCategoryById(categoryId) {
    return dataStore.category.find(category => category.id === categoryId);
}

//Find category by name
function findCategoryByName(categoryName) {
    return dataStore.category.find(category => category.name === categoryName);
}

//Create category
function createCategory(categoryData) {
    const { name } = categoryData;

    //Check if category exists
    if (isCategoryExists(name)) {
        return { message: "Category already exists" };
    }

    const newCategory = {
        id: getNewCategoryId(),
        name
    };

    dataStore.category.push(newCategory);
    saveCategory();
    return { message: "Category added successfully" };
}

//Get category by id
function getCategoryById(categoryId) {
    const category = findCategoryById(categoryId);
    return category || { message: "Category not found" };
}

//Get category by name
function getCategoryByName(categoryName) {
    const category = findCategoryByName(categoryName);
    return category || { message: "Category not found" };
}

//Get all category
function getAllCategory() {
    return dataStore.category;
}

//Update Category
function updateCategory(categoryId, updatedInfo) {
    const category = findCategoryById(categoryId);
    if (!category) return { message: "Category not found" };

    Object.assign(category, updatedInfo);
    saveCategory();
    return { message: "Category updated successfully" };
}

//Delete Category
function deleteCategory(categoryId) {
    const initialLength = dataStore.category.length;
    dataStore.category = dataStore.category.filter(category => category.id !== categoryId);
    saveCategory();
    return { message: initialLength !== dataStore.category.length ? "Category deleted successfully" : "Not found" };
}

export { 
    createCategory, 
    getCategoryById, 
    getAllCategory, 
    updateCategory, 
    deleteCategory, 
    getCategoryByName 
};
