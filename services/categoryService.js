import { categories, addCategory, deleteCategoryById, saveCategory } from "../repository/categoryDirectoryRepo.js";

//Check if category exists
function isCategoryExists(name) {
    return categories.some(category => category.name.toLowerCase() === name.toLowerCase());
}

//Find category by id
function findCategoryById(categoryId) {
    return categories.find(category => category.id === categoryId);
}

//Create category
function createCategory(categoryData) {
    const { name } = categoryData;

    //Check if category exists
    if (isCategoryExists(name)) {
        return { message: "Category already exists" };
    }

    const newCategoryData = {
        name
    };

    const newCategory = addCategory(newCategoryData);
    return { message: "Category added successfully" };
}

//Get category by id
function getCategoryById(categoryId) {
    const category = findCategoryById(categoryId);
    return category || { message: "Category not found" };
}

//Get all category
function getAllCategory() {
    return categories;
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
    const success = deleteCategoryById(categoryId);
    return { message: success ? "Category deleted successfully" : "Not found" };
}

export { 
    createCategory, 
    getCategoryById, 
    getAllCategory, 
    updateCategory, 
    deleteCategory,
    findCategoryById
};
