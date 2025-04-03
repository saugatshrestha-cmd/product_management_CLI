import fs from 'fs';

//make this independent
const USER_FILE = 'data/users.json';
const PRODUCT_FILE = 'data/products.json';
const CATEGORY_FILE = 'data/category.json';

// Load data from JSON file
function loadData(file) {
    try {
        if (!fs.existsSync(file)) return { data: [] }; // Default structure
        const json = fs.readFileSync(file, 'utf8');
        return JSON.parse(json);
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

// Load users and products on startup
let usersData = loadData(USER_FILE);
let productsData = loadData(PRODUCT_FILE);
let categoryData = loadData(CATEGORY_FILE);

// Initialize counters in memory (start at 1 if no data exists)
let userIdCounter = usersData.data.length ? usersData.data[usersData.data.length - 1].id + 1 : 1;
let productIdCounter = productsData.data.length ? productsData.data[productsData.data.length - 1].id + 1 : 1;
let categoryIdCounter = categoryData.data.length ? categoryData.data[categoryData.data.length - 1].id + 1 : 1;

const dataStore = {
    users: usersData.data,
    products: productsData.data,
    category: categoryData.data,
};

// Generate new user ID
function getNewUserId() {
    return userIdCounter++;
}

// Generate new product ID
function getNewProductId() {
    return productIdCounter++;
}

// Generate new category ID
function getNewCategoryId() {
    return categoryIdCounter++;
}

// Save users to JSON file
function saveUsers() {
    saveData(USER_FILE, { data: dataStore.users, idCounter: dataStore.userIdCounter });
}

// Save products to JSON file
function saveProducts() {
    saveData(PRODUCT_FILE, { data: dataStore.products, idCounter: dataStore.productIdCounter });
}

// Save category to JSON file
function saveCategory() {
    saveData(CATEGORY_FILE, { data: dataStore.category, idCounter: dataStore.categoryIdCounter });
}

export { dataStore, saveUsers, saveProducts, saveCategory, getNewUserId, getNewProductId, getNewCategoryId };
