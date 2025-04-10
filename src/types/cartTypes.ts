export interface CartItem{
    productId: number,
    quantity: number
}

export interface Cart{
    id: number,
    userId: number,
    items: CartItem[]
}