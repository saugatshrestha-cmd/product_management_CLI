import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { AuthRequest } from '../types/authTypes';
import { injectable, inject } from "tsyringe";


@injectable()
export class ProductController {
    constructor(
                @inject("ProductService") private productService: ProductService
            ) {}

    async createProduct(req: AuthRequest, res: Response): Promise<void> {
        try {
            const loggedInUser = req.user?._id;
            const productData = req.body;
            productData.sellerId = loggedInUser;
            const result = await this.productService.createProduct(productData);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error creating product' });
        }
    }

    async getProductBySeller(req: AuthRequest, res: Response): Promise<void> {
        try {
            const sellerId = req.user?._id;
            if (!sellerId){
                res.status(400).json({ message: "No id in token" });
                return;
            }
            const products = await this.productService.getProductsBySeller(sellerId);
            if (!products){
                res.status(404).json({ message: "Product not found" });
                return;
            }
            res.json(products);
        } catch {
            res.status(500).json({ message: "Error fetching products" });
        }
    }

    async updateProduct(req: AuthRequest, res: Response): Promise<void> {
        try {
            const sellerId = req.user?._id;
            if (!sellerId){
                res.status(400).json({ message: "No id in token" });
                return;
            }

            const result = await this.productService.updateProduct(sellerId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: "Error updating product" });
        }
    }

    async getAllProducts(req: Request, res: Response): Promise<void> {
        try {
            const products = await this.productService.getAllProducts();
            res.json(products);
        } catch {
            res.status(500).json({ message: 'Error fetching products' });
        }
    }

    async getProductById(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.id;
            const result = await this.productService.getProductById(productId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error fetching product' });
        }
    }

    async adminUpdateProduct(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.id;
            const result = await this.productService.updateProduct(productId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error updating product' });
        }
    }

    async adminDeleteProduct(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.id;
            const result = await this.productService.deleteProduct(productId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error deleting product' });
        }
    }
}

