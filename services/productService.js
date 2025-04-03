import { dataStore, saveProducts, getNewProductId } from "./fileService.js";
import { getCategoryByName } from "./categoryService.js"

//Find product by id
function findProductById(productId) {
    return dataStore.products.find(product => product.id === productId);
}

//Create product
function createProduct(productData) {
    const { name, description = "", price, categoryName, quantity } = productData; // Allow empty category & description
    
    //Check if the product already exists
    const existingProduct = dataStore.products.find(product => product.name.toLowerCase() === name.toLowerCase());
    if (existingProduct) {
        return { message: "Product already exists." };
    }

    //Check if the category exists
    const category = getCategoryByName(categoryName);
    if (!category.id) {
        return { message: "Invalid category name. Category does not exist." };
    }

    const newProduct = {
        id: getNewProductId(),
        name,
        description,
        price,
        categoryId: category.id,
        quantity
    };

    // Add the product
    dataStore.products.push(newProduct);
    //Save the products to json file
    saveProducts();
    return { message: "Product added successfully" };
}

//Get product by id
function getProductById(productId) {
    const product = findProductById(productId);
    return product || { message: "Product not found" };
}

//Get all products
function getAllProducts() {
    return dataStore.products;
}

//Update product
function updateProduct(productId, updatedInfo) {
    const product = findProductById(productId);
    if (!product) return { message: "Product not found" };
    //Check if the category exists
    if (updatedInfo.categoryName) {
        const category = getCategoryByName(updatedInfo.categoryName);
        if (!category.id) {
            return { message: "Invalid category ID. Category does not exist." };
        }
    }

    Object.assign(product, updatedInfo);
    saveProducts();
    return { message: "Product updated successfully" };
}

//Update quantity
function updateQuantity(productId, updateQuantity) {
    const product = findProductById(productId);
    if (!product) return { message: "Product not found" };

    product.quantity += updateQuantity; 
    if (product.quantity < 0) product.quantity = 0; // Prevent negative stock
    saveProducts();
    return { message: "Product quantity updated successfully" };
}

//Bulk update prices
function bulkUpdateAllPrices(newPrice) {
    if (newPrice < 0) {
        return { message: "Price cannot be negative" };
    }

    dataStore.products = dataStore.products.map(product => ({ ...product, price: newPrice }));
    saveProducts();
    return { message: `Updated price for all ${dataStore.products.length} product(s)` };
}

//Bulk Update quantities
function bulkUpdateAllQuantities(quantityChange) {
    dataStore.products = dataStore.products.map(product => {
        let newQuantity = product.quantity + quantityChange;
        if (newQuantity < 0) newQuantity = 0; // Prevent negative stock

        return { ...product, quantity: newQuantity };
    });
    saveProducts();
    return { message: `Updated quantity for all ${dataStore.products.length} product(s)` };
}

//Delete product
function deleteProduct(productId) {
    const initialLength = dataStore.products.length;
    dataStore.products = dataStore.products.filter(product => product.id !== productId);
    saveProducts();
    return { message: initialLength !== dataStore.products.length ? "Product deleted successfully" : "Not found" };
}

export {
    createProduct,
    getProductById,
    getAllProducts,
    updateProduct,
    updateQuantity,
    bulkUpdateAllPrices,
    bulkUpdateAllQuantities,
    deleteProduct
};
