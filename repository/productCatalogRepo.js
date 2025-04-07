import { loadData, saveData } from '../utils/fileHelper.js';
import FILE_PATHS from '../constants/filePaths.js';

let products = loadData(FILE_PATHS.PRODUCTS).data;

function getNewId() {
    return products.length ? products[products.length - 1].id + 1 : 1;
}

// Save users to JSON file
function saveProducts() {
    saveData(FILE_PATHS.PRODUCTS, { data: products });
}

function addProduct(productData) {
    const newProductId = getNewId(); 
    const newProduct = {  id: newProductId, ...productData };  
    products.push(newProduct);
    saveProducts();

}

function deleteProductById(productId) {
    const initialLength = products.length;
    products = products.filter(product => product.id !== productId);
    saveProducts();
    return initialLength !== products.length;
}

export { products, addProduct, deleteProductById, saveProducts}