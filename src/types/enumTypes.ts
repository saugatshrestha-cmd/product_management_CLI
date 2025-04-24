export enum OrderItemStatus {
    PENDING = 'Pending',
    CONFIRMED = 'Confirmed',
    SHIPPED = 'Shipped',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled'
}

export enum Status {
    PENDING = 'Pending',
    CONFIRMED = 'Confirmed',
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