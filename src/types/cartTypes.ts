
export interface CartItem{
    productId: string,
    productName: string,
    quantity: number,
    sellerId: string,
}

export interface Cart{
    _id: string;
    userId: string,
    items: CartItem[]
}

export interface CartInput{
    _id?: string;
    userId: string,
    items: CartItem[]
}