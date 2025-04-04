import { loadData, saveData } from '../utils/fileHelper.js';
import FILE_PATHS from '../constants/filePaths.js';

let products = loadData(FILE_PATHS.PRODUCTS).data;

let productIdCounter = products.length ? products[products.length - 1].id + 1 : 1;

function getNewId() {
    return productIdCounter++;
}

// Save users to JSON file
function saveProducts() {
    saveData(FILE_PATHS.PRODUCTS, { data: products });
}

function addProduct(productData) {
    const newProduct = { ...productData, id: getNewId() }; 
}

export { products, addProduct, saveProducts}