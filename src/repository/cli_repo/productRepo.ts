import { FileService } from '../../utils/fileHelper';
import FILE_PATHS from '../../constants/filePaths';
import { Product } from '../../types/productTypes';

export class ProductRepository {
  private fileService: FileService;
  private products: Product[];

  constructor() {
    this.fileService = new FileService(FILE_PATHS.PRODUCTS);
    this.products = this.fileService.load();
  }

  private getNewId(): number {
    return this.products.length ? this.products[this.products.length - 1].id + 1 : 1;
  }
  
  private getProducts(): Product[] {
      return this.fileService.load();
  }

  public saveProducts(): void {
    this.fileService.save({ data: this.products });
  }

  getAll(): Product[] {
    return this.getProducts();
  }

  addProduct(productData: Omit<Product, 'id'>): void {
    const newProduct: Product = {
      id: this.getNewId(),
      ...productData,
    };
    this.products.push(newProduct);
    this.saveProducts();
  }

  deleteProductById(productId: number): boolean {
    const initialLength = this.products.length;
    this.products = this.products.filter(product => product.id !== productId);
    this.saveProducts();
    return initialLength !== this.products.length;
  }
}
