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
    CUSTOMER = 'customer',
    SELLER = 'seller'
}

export enum ProductStatus{
    ACTIVE = 'active',
    ARCHIVED = 'archived',
    DELETED = 'deleted'
}
