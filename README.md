# E-Commerce Backend API

## Tech Stack

- **Backend:** Node.js, Express, TypeScript  
- **Database:** MongoDB  
- **Authentication:** JWT (Role-based access control)  
- **Dependency Injection:** tsyringe  
- **Validation:** Joi  
- **Cloud:** Cloudinary
- **Email:** Node Mailer
- **Logger:** Winston

---

## Roles

1. **Customer**  
2. **Seller**  
3. **Admin**

---

## Functional Features

### Authentication

- **Register/Login:**
  - Separate endpoints for Customer, Seller, and Admin (e.g., `/auth/register`, `/seller`)
  - JWT tokens include a role claim for role-based access

- **Password Management:**
  - Users can update passwords securely
  - Email and password updates handled via separate routes

---

### Customer Features

- **Cart:**
  - Each user has a single cart
  - Cannot add more items than are in stock
  - Calculates cart summary (subtotal, total)
  - Cannot create a new cart if one already exists

- **Orders:**
  - Place orders from cart
  - Track order status (`Shipped`, `Delivered`)
  - Cancel own orders if not delivered

---

### Seller Features

- **Product Management:**
  - Full CRUD operations (Create, Read, Update, Delete)
  - Upload image of product to cloud.

- **Order Fulfillment:**
  - View orders for products they added
  - Update order status for their products

---

### Admin Features

- **Category Management:**
  - Full CRUD operations

- **Order Management:**
  - View all orders
  - Cancel orders
  - Soft delete orders

- **Product Management:**
  - View all products
  - Get product by ID
  - Delete any product

- **User & Seller Management:**
  - View and manage all registered customers and sellers

---

## Non-Functional Features

### Security

- **JWT:**
  - Token expiration (e.g., `1h` for users and admins)
  - Tokens can be securely stored in HTTP-only cookies for web clients

- **Data Protection:**
  - Passwords and sensitive fields are encrypted

---

### Email Notification

- Email notification send when registering user, order confirmed, order status change.

---

### Error Handling

- Centralized error-handling middleware
- `AppError` class with custom messages and status codes

---

### Logger

- Success and Error logs is shown in the console.

---

### Input Validation

- **Joi** is used for request body validation
- Each route has its own validation schema stored in the `validation/` folder

---

### ⚙️ Architecture

- **Factory Pattern**
  - Factory pattern implementation to accommodate future database addition.
- **Layered Structure:**
  - Clear separation: Controller → Service → Repository
- **Standardized Responses:**
  - `SuccessResponse` and `ErrorResponse` format all API responses
- **Audit Trail:**
  - Each action is audited and stored in database.

---

### Health Check

- A simple `/health` endpoint is available to monitor API uptime
