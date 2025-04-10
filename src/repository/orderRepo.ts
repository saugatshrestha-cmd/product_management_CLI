import { loadData, saveData } from '../utils/fileHelper.js';
import FILE_PATHS from '../constants/filePaths.js';
import { Order, OrderStatus } from '../types/orderTypes.js';

let orders: Order [] = loadData(FILE_PATHS.ORDERS).data;

function getNewId(): number {
    return orders.length ? orders[orders.length - 1].id + 1 : 1;
}

function addOrder(cartData: Omit<Order, 'id'>) {
    const newOrder = {
        id: getNewId(),
        ...cartData,
    };

    orders.push(newOrder);
    saveOrders();
    return newOrder;
}




function saveOrders(){
    saveData(FILE_PATHS.ORDERS, { data: orders });
}

export {orders, saveOrders, addOrder}