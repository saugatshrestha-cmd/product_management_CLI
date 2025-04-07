import { products, addProduct, deleteProductById, saveProducts } from "../repository/productCatalogRepo.js";
import { findCategoryById } from "./categoryService.js"

//Find product by id
function findProductById(productId) {
    return products.find(product => product.id === productId);
}

//Create product
function createProduct(productData) {
    const { name, description = "", price, categoryId, quantity } = productData; // Allow empty category & description
    
    //Check if the product already exists
    const existingProduct = products.find(product => product.name.toLowerCase() === name.toLowerCase());
    if (existingProduct) {
        return { message: "Product already exists." };
    }

    //Check if the category exists
    const category = findCategoryById(categoryId);
    if (!categoryId) {
        return { message: "Invalid category Id. Category does not exist." };
    }

    const newProductData = {
        name,
        description,
        price,
        categoryId: category.id,
        quantity
    };

    const newProduct = addProduct(newProductData);
    return { message: "Product added successfully" };
}

//Get product by id
function getProductById(productId) {
    const product = findProductById(productId);
    return product || { message: "Product not found" };
}

//Get all products
function getAllProducts() {
    return products;
}

//Update product
function updateProduct(productId, updatedInfo) {
    const product = findProductById(productId);
    if (!product) return { message: "Product not found" };
    //Check if the category exists
    if (updatedInfo.categoryId) {
        const category = findCategoryById(updatedInfo.categoryId);
        if (!category.id) {
            return { message: "Invalid category ID. Category does not exist." };
        }
    }

    Object.assign(product, updatedInfo);
    saveProducts();
    return { message: "Product updated successfully" };
}

//Update quantity
function updateQuantity(productId, newQuantity) {
    const product = findProductById(productId);
    if (!product) return { message: "Product not found" };

    product.quantity += newQuantity; 
    if (product.quantity < 0) product.quantity = 0; // Prevent negative stock
    saveProducts();
    return { message: "Product quantity updated successfully" };
}

//Bulk update prices
function bulkUpdateAllPrices(newPrice) {
    if (newPrice < 0) {
        return { message: "Price cannot be negative" };
    }

    products = products.map(product => ({ ...product, price: newPrice }));
    saveProducts();
    return { message: `Updated price for all ${products.length} product(s)` };
}

//Bulk Update quantities
function bulkUpdateAllQuantities(quantityChange) {
    products = products.map(product => {
        let newQuantity = product.quantity + quantityChange;
        if (newQuantity < 0) newQuantity = 0; // Prevent negative stock

        return { ...product, quantity: newQuantity };
    });
    saveProducts();
    return { message: `Updated quantity for all ${products.length} product(s)` };
}

//Delete product
function deleteProduct(productId) {
    const success = deleteProductById(productId);
    return { message: success ? "Product deleted successfully" : "Not found" };
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
