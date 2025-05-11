import "reflect-metadata";
import { container } from "tsyringe";

import { PasswordManager } from "@utils/passwordUtils";

import { UserRepositoryFactory } from "@factories/userFactory";
import { ProductRepositoryFactory } from "@factories/productFactory";
import { SellerRepositoryFactory } from "@factories/sellerFactory";
import { OrderRepositoryFactory } from "@factories/orderFactory";
import { CartRepositoryFactory } from "@factories/cartFactory";
import { CategoryRepositoryFactory } from "@factories/categoryFactory";
import { FileRepositoryFactory } from "@factories/fileFactory";

import { MongoUserRepository } from "@repository/userRepo";
import { MongoProductRepository } from "@repository/productRepo";
import { MongoCategoryRepository } from "@repository/categoryRepo";
import { MongoOrderRepository } from "@repository/orderRepo";
import { MongoSellerRepository } from "@repository/sellerRepo";
import { MongoCartRepository } from "@repository/cartRepo";
import { MongoFileRepository } from "@repository/fileRepo";

import { UserService } from "@services/userService";
import { ProductService } from "@services/productService";
import { CategoryService } from "@services/categoryService";
import { OrderService } from "@services/orderService";
import { SellerService } from "@services/sellerService";
import { CartService } from "@services/cartService";
import { AuthService } from "@services/authService";
import { EmailService } from "@services/etherealEmailService";
import { NotificationService } from "@services/notificationService";
import { CloudService } from "@services/cloudService";
import { FileService } from "@services/fileService";
import { AuditService } from "@services/auditService";

import { UserController } from "@controller/userController";
import { ProductController } from "@controller/productController";
import { CategoryController } from "@controller/categoryController";
import { OrderController } from "@controller/orderController";
import { SellerController } from "@controller/sellerController";
import { CartController } from "@controller/cartController";
import { AuthController } from "@controller/authController";
import { AdminController } from "@controller/adminController";
import { AuditController } from "@controller/auditController";

container.register("PasswordManager", { useClass: PasswordManager });

container.register("UserRepositoryFactory", { useClass: UserRepositoryFactory });
container.register("ProductRepositoryFactory", { useClass: ProductRepositoryFactory });
container.register("CategoryRepositoryFactory", { useClass: CategoryRepositoryFactory});
container.register("OrderRepositoryFactory", { useClass: OrderRepositoryFactory});
container.register("SellerRepositoryFactory", { useClass: SellerRepositoryFactory});
container.register("CartRepositoryFactory", { useClass: CartRepositoryFactory});
container.register("FileRepositoryFactory", { useClass: FileRepositoryFactory});

container.register("MongoUserRepository", { useClass: MongoUserRepository });
container.register("MongoProductRepository", { useClass: MongoProductRepository });
container.register("MongoCategoryRepository", { useClass: MongoCategoryRepository});
container.register("MongoOrderRepository", { useClass: MongoOrderRepository});
container.register("MongoSellerRepository", { useClass: MongoSellerRepository});
container.register("MongoCartRepository", { useClass: MongoCartRepository});
container.register("MongoFileRepository", { useClass: MongoFileRepository});

container.register("NotificationService", { useClass: NotificationService });
container.register("UserService", { useClass: UserService });
container.register("ProductService", { useClass: ProductService });
container.register("CategoryService", { useClass: CategoryService})
container.register("OrderService", { useClass: OrderService});
container.register("SellerService", { useClass: SellerService});
container.register("CartService", { useClass: CartService});
container.register("AuthService", { useClass: AuthService});
container.register("EmailService", { useClass: EmailService});
container.register("CloudService", { useClass: CloudService});
container.register("FileService", { useClass: FileService});
container.register("AuditService", { useClass: AuditService});

container.register("UserController", { useClass: UserController });
container.register("ProductController", { useClass: ProductController });
container.register("CategoryController", { useClass: CategoryController});
container.register("OrderController", { useClass: OrderController});
container.register("SellerController", { useClass: SellerController});
container.register("CartController", { useClass: CartController});
container.register("AuthController", { useClass: AuthController});
container.register("AdminController", { useClass: AdminController});
container.register("AuditController", { useClass: AuditController});

export { container };
