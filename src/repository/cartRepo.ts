import { loadData, saveData } from '../utils/fileHelper.js';
import FILE_PATHS from '../constants/filePaths.js';
import { Cart, CartItem } from '../types/cartTypes.js';

let carts: Cart [] = loadData(FILE_PATHS.CART).data;

function getNewId(): number {
    return carts.length ? carts[carts.length - 1].id + 1 : 1;
}

function addCart(cartData: Omit<Cart, 'id'>) {
    const newCart = {
        id: getNewId(),
        ...cartData,
    };

    carts.push(newCart);
    saveCarts();
    return newCart;
}


function updateCart(userId: number, updatedItems: CartItem[]) {
    const userCart = carts.find(cart => cart.userId === userId);

    if (!userCart) {
        return { message: `Cart not found for userId: ${userId}` };
    }

    userCart.items = updatedItems;
    saveCarts();
    return userCart;
}


function saveCarts(){
    saveData(FILE_PATHS.CART, { data: carts });
}

export {carts, saveCarts, addCart, updateCart}