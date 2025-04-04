import { createUser, getUserById, getAllUsers, updateUser, updateEmail, updatePassword, deleteUser } from "./services/userService.js";
import { createProduct, getProductById, getAllProducts, updateProduct, updateQuantity, bulkUpdateAllPrices, bulkUpdateAllQuantities, deleteProduct } from "./services/productService.js";
import { createCategory, getCategoryById, getAllCategory, updateCategory, deleteCategory } from "./services/categoryService.js";

console.log(createUser({firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password123', phone: '123-456-7890', address: 'Kathmandu'}));
console.log(createUser({firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', password: 'password456', phone: '987-654-3210', address: 'Pokhara'}));
console.log(createUser({firstName: 'Patrick', lastName: 'Reeves', email: 'john@example.com', password: 'password123', phone: '456-132-3574', address: 'Kathmandu'}));

// console.log(getUserById(1));
// console.log(getUserById(3));

// console.log(updateUser(1, { firstName: 'Updated' }));
// console.log(updateEmail(1, 'john@updated.com' ));
// console.log(updatePassword(1, '123password' ));

// console.log(getUserById(1));

// console.log(deleteUser(1));
// console.log(getAllUsers());

console.log(createCategory({name: "Electronics"}));
console.log(createCategory({name: "Clothes"}));
console.log(createCategory({name: "Foods"}));

// console.log(getCategoryById(1));
// console.log(getAllCategory());

// console.log(updateCategory(1,{name: "Updated"}));

// console.log(deleteCategory(1));

console.log(createProduct({name: "Laptop", price: 999.99, categoryName: "Electronics", quantity: 10}));
console.log(createProduct({name: "PC", price: 1999.99, categoryName: "Electronics", quantity: 10}));
console.log(createProduct({name: "Phone", price: 599.99, categoryName: "Electronics", quantity: 10}));
console.log(createProduct({name: "Shirt", price: 19.99, categoryName: "Clothes", quantity: 100}));
console.log(createProduct({name: "Carrot", price: 1.99, categoryName: "Foods", quantity: 100}));

// console.log(getProductById(1));
// console.log(getAllProducts());

// console.log(updateProduct(1, {name: "Laptop updated", price: 799.99}));
// console.log(getProductById(1));

// console.log(updateQuantity(1, -11));
// console.log(getProductById(1));

// console.log(bulkUpdateAllPrices(6999.99));
// console.log(getAllProducts());

// console.log(bulkUpdateAllQuantities(-20));
// console.log(getAllProducts());

// console.log(deleteProduct(1));
// console.log(getAllProducts());
