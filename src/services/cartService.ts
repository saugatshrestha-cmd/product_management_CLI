import { Product } from '../types/productTypes.js';
import { getProductById } from './productService.js';
import { carts, saveCarts, addCart, updateCart } from '../repository/cartRepo.js';
import { decreaseQuantity } from './productService.js';

function isProduct(product: any): product is Product {
    return product && typeof product.id === 'number' && typeof product.price === 'number';
}

function createCart(item: Product, quantity: number, userId: number) {
    const product = getProductById(item.id);

    if (!isProduct(product)) {
        return { message: "Product not found" };
    }

    const cartData = {
        userId,
        items: [{ productId: item.id, quantity }],
    };

    const userCart = carts.find(cart => cart.userId === userId);

    if (!userCart) {
        addCart(cartData);
    } else {
        const userCartItemIndex = userCart.items.findIndex(
            cartItem => cartItem.productId === product.id
        );

        if (userCartItemIndex === -1) {
            userCart.items.push({ productId: item.id, quantity });
        } else {
            userCart.items[userCartItemIndex].quantity += quantity;
        }

        updateCart(userId, userCart.items);
    }
    decreaseQuantity(product.id, quantity);

    return { message: 'Product added to cart successfully' };
}

function removeFromCart(productId: number, userId: number) {
    const userCart = carts.find(cart => cart.userId === userId);

    if (!userCart) {
        return { message: `Cart not found for userId: ${userId}` };
    }

    const itemIndex = userCart.items.findIndex(item => item.productId === productId);
    if (itemIndex !== -1) {
        userCart.items.splice(itemIndex, 1);
    }

    saveCarts();
    return { message: 'Product removed from cart successfully' };
}

function calculateTotal(userId: number) {
    const userCart = carts.find(cart => cart.userId === userId);

    if (!userCart) {
        return { message: `Cart not found for userId: ${userId}` };
    }

    const total = userCart.items.reduce((acc: number, current) => {
        const product = getProductById(current.productId);
        if (isProduct(product)) {
            acc += product.price * current.quantity;
        }
        return acc;
    }, 0);

    return { total };
}

function getCartByUserId(userId: number) {
    const userCart = carts.find(cart => cart.userId === userId);
    return userCart || { message: `Cart not found for userId: ${userId}` };
}

export {
    createCart,
    removeFromCart,
    calculateTotal,
    getCartByUserId,
};
