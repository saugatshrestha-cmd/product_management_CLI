import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { AuthRequest } from '../types/authTypes';

const productService = new ProductService();

export class ProductController {
    static async createProduct(req: AuthRequest, res: Response): Promise<void> {
        try {
            const loggedInUser = (req as any).user;
            const productData = req.body;
            if (loggedInUser.role === 'seller') {
                productData.sellerId = loggedInUser._id;
            }
            const result = await productService.createProduct(productData);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error creating product' });
        }
    }

    static async getProductBySeller(req: AuthRequest, res: Response): Promise<void> {
        try {
            const sellerId = req.user?._id;
            if (!sellerId){
                res.status(400).json({ message: "No id in token" });
                return;
            }
            const products = await productService.getProductsBySeller(sellerId);
            if (!products){
                res.status(404).json({ message: "Product not found" });
                return;
            }
            res.json(products);
        } catch {
            res.status(500).json({ message: "Error fetching products" });
        }
    }

    static async updateProduct(req: AuthRequest, res: Response): Promise<void> {
        try {
            const sellerId = req.user?._id;
            if (!sellerId){
                res.status(400).json({ message: "No id in token" });
                return;
            }

            const result = await productService.updateProduct(sellerId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: "Error updating product" });
        }
    }

    static async getAllProducts(req: Request, res: Response): Promise<void> {
        try {
            const products = await productService.getAllProducts();
            res.json(products);
        } catch {
            res.status(500).json({ message: 'Error fetching products' });
        }
    }

    static async getProductById(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.id;
            const result = await productService.getProductById(productId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error fetching product' });
        }
    }

    static async adminUpdateProduct(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.id;
            const result = await productService.updateProduct(productId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error updating product' });
        }
    }

    static async adminDeleteProduct(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.id;
            const result = await productService.deleteProduct(productId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error deleting product' });
        }
    }
}

