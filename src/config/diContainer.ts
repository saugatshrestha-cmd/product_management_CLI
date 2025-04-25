import "reflect-metadata";
import { container } from "tsyringe";

import { PasswordManager } from "@utils/passwordUtils";

import { UserRepository } from "../repository/mongo_repo/userRepo";
import { ProductRepository } from "../repository/mongo_repo/productRepo";
import { CategoryRepository } from "../repository/mongo_repo/categoryRepo";
import { OrderRepository } from "../repository/mongo_repo/orderRepo";
import { SellerRepository } from "../repository/mongo_repo/sellerRepo";
import { CartRepository } from "../repository/mongo_repo/cartRepo";

import { UserService } from "../services/userService";
import { ProductService } from "../services/productService";
import { CategoryService } from "../services/categoryService";
import { OrderService } from "../services/orderService";
import { SellerService } from "../services/sellerService";
import { CartService } from "../services/cartService";
import { AuthService } from "../services/authService";

import { UserController } from "../controller/userController";
import { ProductController } from "../controller/productController";
import { CategoryController } from "../controller/categoryController";
import { OrderController } from "../controller/orderController";
import { SellerController } from "../controller/sellerController";
import { CartController } from "../controller/cartController";
import { AuthController } from "../controller/authController";
import { AdminController } from "../controller/adminController";

container.register("PasswordManager", { useClass: PasswordManager });

container.register("UserRepository", { useClass: UserRepository });
container.register("ProductRepository", { useClass: ProductRepository });
container.register("CategoryRepository", { useClass: CategoryRepository});
container.register("OrderRepository", { useClass: OrderRepository});
container.register("SellerRepository", { useClass: SellerRepository});
container.register("CartRepository", { useClass: CartRepository});


container.register("UserService", { useClass: UserService });
container.register("ProductService", { useClass: ProductService });
container.register("CategoryService", { useClass: CategoryService})
container.register("OrderService", { useClass: OrderService});
container.register("SellerService", { useClass: SellerService});
container.register("CartService", { useClass: CartService});
container.register("AuthService", { useClass: AuthService});

container.register("UserController", { useClass: UserController });
container.register("ProductController", { useClass: ProductController });
container.register("CategoryController", { useClass: CategoryController});
container.register("OrderController", { useClass: OrderController});
container.register("SellerController", { useClass: SellerController});
container.register("CartController", { useClass: CartController});
container.register("AuthController", { useClass: AuthController});
container.register("AdminController", { useClass: AdminController});

export { container };
