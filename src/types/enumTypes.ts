export enum OrderItemStatus {
    PENDING = 'Pending',
    SHIPPED = 'Shipped',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled'
}

export enum Status {
    PENDING = 'Pending',
    PARTIALLYSHIPPED = 'Partially Shipped',
    SHIPPED = 'Shipped',
    PARTIALLYDELIVERED = 'Partially Delivered',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled'
}

export enum Role {
    ADMIN = 'admin',
    USER = 'user',
    SELLER = 'seller'
}