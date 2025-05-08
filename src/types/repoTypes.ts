import { User } from "./userTypes";
import { ProductInput, Product } from "./productTypes";
import { Cart, CartInput, CartItem } from "./cartTypes";
import { Order, OrderInput } from "./orderTypes";
import { OrderItemStatus } from "./enumTypes";
import { Seller } from "./sellerTypes";
import { Category } from "./categoryTypes";

export interface Repository<T> {
    getAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    add(entity: T): Promise<T>;
    update(id: string, updatedInfo: Partial<T>): Promise<void>;
}

export interface UserRepository extends Repository<User> {
    findByEmail(email: string): Promise<User | null>;
}

export interface SellerRepository extends Repository<Seller> {
    findByEmail(email: string): Promise<Seller | null>;
}

export interface ProductRepository extends Repository<Product> {
    findByName(name: string): Promise<Product | null>;
    updateMany(filter: object, update: object): Promise<void>;
    getBySellerId(sellerId: string): Promise<Product[]>;
    add(productData: ProductInput): Promise<Product>;
}

export interface OrderRepository extends Repository<Order> {
    getOrdersByUserId(userId: string): Promise<Order[]>;
    getOrderBySellerId(sellerId: string): Promise<Order[]>;
    add(orderData: OrderInput): Promise<Order>;
    updateOrderItemStatus(orderId: string, itemId: string, sellerId: string, newStatus: OrderItemStatus): Promise<void>;
}

export interface CategoryRepository extends Repository<Category> {
    findByName(name: string): Promise<Category | null>;
    deleteCategoryById(categoryId: string): Promise<boolean>;
}

export interface CartRepository extends Repository<Cart> {
    findCartByUserId(userId: string): Promise<Cart | null>;
    add(cartData: CartInput): Promise<Cart>;
    updateCart(userId: string, updatedItems: CartItem[]): Promise<void>;
    removeCartByUserId(userId: string): Promise<boolean>;
}
