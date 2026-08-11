# PureYuna API

This repository contains the backend API for a skincare storefront. The app is built with Node.js, TypeScript, Express, Prisma, and PostgreSQL.

## Project setup

### Requirements

- Node.js 18+
- PostgreSQL database
- npm

### Environment variables

Create a `.env` file in the project root with:

```env
PORT=6000
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/pureyuna"
JWT_SECRET="your_super_secret_jwt_key"
```

The app loads environment variables from `.env` and throws an error at startup if `JWT_SECRET` is not defined.

### Install and run

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Production:

```bash
npm run build
npm start
```

Default server port: `6000` if `PORT` is not set.

## Base URL

```text
http://localhost:6000/api/v1
```

## Authentication

The API uses JWT bearer tokens.

```http
Authorization: Bearer <token>
```

Auth middleware behavior:

- No `Authorization` header => `401`
- Invalid or missing token => `401`
- Role restriction mismatch => `403`
- Valid token for allowed roles => request continues

## Routes and permissions

### Root

| Method | Endpoint | Access | Notes |
| --- | --- | --- | --- |
| GET | `/` | Public | Returns a welcome message from the app root |

### Auth

| Method | Endpoint | Access | Notes |
| --- | --- | --- | --- |
| POST | `/api/v1/auth/register` | Public | Registers a user. The backend forces `role` to `CUSTOMER` internally. |
| POST | `/api/v1/auth/login` | Public | Logs in a user and returns a JWT token. |
| GET | `/api/v1/auth/profile` | CUSTOMER, ADMIN | Returns the authenticated user's profile. |
| PATCH | `/api/v1/auth/profile` | CUSTOMER, ADMIN | Updates the authenticated user's profile. |

### Categories

| Method | Endpoint | Access | Notes |
| --- | --- | --- | --- |
| GET | `/api/v1/categories` | Public | Returns all categories. |
| POST | `/api/v1/categories` | ADMIN | Creates a category. |
| PATCH | `/api/v1/categories/:id` | ADMIN | Updates a category by id. |
| DELETE | `/api/v1/categories/:id` | ADMIN | Deletes a category by id. |

### Products

| Method | Endpoint | Access | Notes |
| --- | --- | --- | --- |
| GET | `/api/v1/products` | Public | Returns products with optional filtering, sorting, and pagination. |
| GET | `/api/v1/products/:id` | Public | Returns one product by id. |
| POST | `/api/v1/products` | ADMIN | Creates a product. |
| PATCH | `/api/v1/products/:id` | ADMIN | Updates a product by id. |
| DELETE | `/api/v1/products/:id` | ADMIN | Soft deletes a product by setting `isDeleted` to true. |

### Packages

| Method | Endpoint | Access | Notes |
| --- | --- | --- | --- |
| GET | `/api/v1/packages` | Public | Returns all non-deleted packages. |
| POST | `/api/v1/packages` | ADMIN | Creates a package and links product ids. |
| PATCH | `/api/v1/packages/:id` | ADMIN | Updates a package by id. |
| DELETE | `/api/v1/packages/:id` | ADMIN | Permanently deletes the package row from the database. |

### Orders

| Method | Endpoint | Access | Notes |
| --- | --- | --- | --- |
| GET | `/api/v1/orders/my-orders` | CUSTOMER, ADMIN | Returns the authenticated user's orders. |
| POST | `/api/v1/orders` | CUSTOMER, ADMIN | Creates an order for the authenticated user. |
| GET | `/api/v1/orders` | ADMIN | Returns all orders. |
| PATCH | `/api/v1/orders/:id/status` | ADMIN | Updates an order status by id. |

### Wishlists

| Method | Endpoint | Access | Notes |
| --- | --- | --- | --- |
| POST | `/api/v1/wishlists` | Any authenticated user | Adds a product to the authenticated user's wishlist. |
| GET | `/api/v1/wishlists` | Any authenticated user | Returns the authenticated user's wishlist. |
| DELETE | `/api/v1/wishlists/:id` | Any authenticated user | Removes a wishlist item by wishlist item id, not product id. |

## Request validation and payload rules

### Auth - register

Body required by validation:

```json
{
  "name": "Your Name",
  "email": "your@example.com",
  "password": "secret123"
}
```

Validation rules:

- `name`: string, minimum 1 character
- `email`: valid email
- `password`: string, minimum 6 characters

Important: the backend does not accept a `role` field in the register body. The service forces every registration to `CUSTOMER`.

### Auth - login

```json
{
  "email": "your@example.com",
  "password": "secret123"
}
```

Validation rules:

- `email`: valid email
- `password`: required string

### Auth - profile update

```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com"
}
```

Validation rules:

- `name`: optional string
- `email`: optional valid email

### Product create

Endpoint: `POST /api/v1/products`

Body:

```json
{
  "name": "Glow Serum",
  "description": "Daily hydration serum",
  "price": 29.99,
  "stock": 100,
  "categoryId": "category_id_here",
  "skinType": "NORMAL",
  "targetAudience": "ALL",
  "productType": "ORGANIC",
  "image": "https://example.com/images/glow-serum.jpg"
}
```

Validation rules:

- `name`: required string
- `description`: required string
- `price`: number greater than 0
- `stock`: integer greater than or equal to 0
- `categoryId`: required string
- `skinType`: required string
- `targetAudience`: required string
- `productType`: required string
- `image`: required string

### Product update

Endpoint: `PATCH /api/v1/products/:id`

Example body:

```json
{
  "name": "Glow Serum Premium",
  "price": 34.99,
  "stock": 80,
  "image": "https://example.com/images/glow-serum-premium.jpg"
}
```

Fields are optional in the validator.

### Product query parameters

Endpoint: `GET /api/v1/products`

Supported query parameters:

- `search`: string, matches product name with a case-insensitive `contains` filter
- `category`: category id filter
- `skinType`: product skin type filter
- `targetAudience`: target audience filter
- `productType`: product type filter
- `sort`: one of `price-low`, `price-high`, `newest`
- `page`: page number, default `1`
- `limit`: page size, default `12`

Example:

```text
GET /api/v1/products?search=serum&category=abc123&skinType=NORMAL&targetAudience=ALL&productType=ORGANIC&sort=price-low&page=1&limit=12
```

### Package create

Endpoint: `POST /api/v1/packages`

Body:

```json
{
  "name": "Hydration Bundle",
  "description": "Bundle for dry skin",
  "price": 79.99,
  "image": "https://example.com/images/hydration-bundle.jpg",
  "images": [
    "https://example.com/images/hydration-bundle-1.jpg",
    "https://example.com/images/hydration-bundle-2.jpg"
  ],
  "productIds": [
    "product_id_1",
    "product_id_2"
  ]
}
```

Validation rules:

- `name`: required string
- `description`: required string
- `price`: positive number
- `image`: required string
- `images`: optional array of strings
- `productIds`: required array with at least one string id

### Package update

Endpoint: `PATCH /api/v1/packages/:id`

Example body:

```json
{
  "name": "Hydration Bundle Plus",
  "price": 89.99,
  "productIds": [
    "product_id_1",
    "product_id_3"
  ]
}
```

Fields are optional in the validator.

### Order create

Endpoint: `POST /api/v1/orders`

Required body:

```json
{
  "address": "123 Main Street",
  "city": "Dhaka",
  "phone": "01712345678",
  "items": [
    {
      "productId": "product_id_1",
      "quantity": 2
    },
    {
      "productId": "product_id_2",
      "quantity": 1
    }
  ]
}
```

Validation rules:

- `address`: string, minimum 5 characters
- `city`: string, minimum 2 characters
- `phone`: string, minimum 10 characters
- `items`: array of objects, minimum length 1
- `items[].productId`: required non-empty string
- `items[].quantity`: integer greater than 0

### Order status update

Endpoint: `PATCH /api/v1/orders/:id/status`

Body:

```json
{
  "status": "PENDING"
}
```

Allowed values:

- `PENDING`
- `PROCESSING`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

### Wishlist add

Endpoint: `POST /api/v1/wishlists`

Body:

```json
{
  "productId": "product_id_1"
}
```

### Wishlist remove

Endpoint: `DELETE /api/v1/wishlists/:id`

The `:id` value is the wishlist item id, not the product id.

Example:

```text
DELETE /api/v1/wishlists/wishlist_item_id_here
```

## Success response patterns

The backend uses two response patterns:

1. `sendResponse(...)` for most CRUD operations
2. direct `res.status(...).json(...)` for some auth and order flows

`sendResponse` always returns:

```json
{
  "success": true,
  "message": "...",
  "meta": null,
  "data": null
}
```

If a controller passes `meta`, it is returned as an object.

### Example: register success

```json
{
  "success": true,
  "message": "User registered successfully!",
  "data": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "CUSTOMER",
    "createdAt": "2026-08-11T00:00:00.000Z"
  }
}
```

### Example: login success

```json
{
  "success": true,
  "message": "User logged in successfully!",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "CUSTOMER"
    }
  }
}
```

### Example: profile success

```json
{
  "success": true,
  "message": "Profile retrieved successfully!",
  "data": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "CUSTOMER",
    "createdAt": "2026-08-11T00:00:00.000Z",
    "updatedAt": "2026-08-11T00:00:00.000Z"
  }
}
```

### Example: products list success

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 1,
    "totalPages": 1
  },
  "data": [
    {
      "id": "product_id_1",
      "name": "Glow Serum",
      "description": "Daily hydration serum",
      "price": 29.99,
      "stock": 100,
      "image": "https://example.com/images/glow-serum.jpg",
      "categoryId": "category_id_here",
      "skinType": "NORMAL",
      "targetAudience": "ALL",
      "productType": "ORGANIC",
      "isDeleted": false,
      "createdAt": "2026-08-11T00:00:00.000Z",
      "updatedAt": "2026-08-11T00:00:00.000Z",
      "category": {
        "id": "category_id_here",
        "name": "Skincare",
        "isDeleted": false,
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z"
      }
    }
  ]
}
```

### Example: order create success

```json
{
  "success": true,
  "message": "Order created successfully!",
  "data": {
    "id": "order_id_here",
    "userId": "user_id_here",
    "totalAmount": 59.98,
    "status": "PENDING",
    "address": "123 Main Street",
    "city": "Dhaka",
    "phone": "01712345678",
    "isDeleted": false,
    "createdAt": "2026-08-11T00:00:00.000Z",
    "updatedAt": "2026-08-11T00:00:00.000Z",
    "orderItems": [
      {
        "id": "order_item_id_here",
        "orderId": "order_id_here",
        "productId": "product_id_1",
        "quantity": 2,
        "price": 29.99
      }
    ],
    "user": {
      "id": "user_id_here",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "CUSTOMER",
      "isDeleted": false,
      "createdAt": "2026-08-11T00:00:00.000Z",
      "updatedAt": "2026-08-11T00:00:00.000Z"
    }
  }
}
```

## Error response patterns

### Validation error from Zod

This is the response shape when validation fails through the global error handler:

```json
{
  "success": false,
  "message": "Validation Error",
  "errorSources": [
    {
      "path": "body.email",
      "message": "Invalid email format"
    }
  ]
}
```

This is triggered by `validateRequest(...)` and by the custom order validation middleware under `src/validations/order.validation.ts`.

### Auth error

```json
{
  "success": false,
  "message": "You are not authorized!"
}
```

Returned when no Authorization header is present.

### Forbidden error

```json
{
  "success": false,
  "message": "Forbidden! You do not have permission."
}
```

Returned when the token is valid but the role does not match the route restriction.

### Invalid token error

```json
{
  "success": false,
  "message": "Invalid Token!"
}
```

Returned when the JWT verification fails.

### Not found route

```json
{
  "success": false,
  "message": "API Not Found!",
  "error": {
    "path": "/missing-route",
    "message": "Your requested path is not found!"
  }
}
```

### Duplicate entry / conflict

The global error handler responds with `409` when Prisma reports a duplicate key error.

Example:

```json
{
  "success": false,
  "message": "Duplicate key error. This record already exists.",
  "errorSources": [
    {
      "path": "email",
      "message": "A record with this value already exists."
    }
  ]
}
```

### Record not found

The global error handler responds with `404` when Prisma finds no record.

Example:

```json
{
  "success": false,
  "message": "Requested record not found.",
  "errorSources": [
    {
      "path": "",
      "message": "Record not found"
    }
  ]
}
```

## Deletion behavior

Important backend behavior:

- Product deletion is a soft delete: `isDeleted` is set to `true` and the product remains in the database.
- Package deletion is a hard delete: the package row is removed from the database with `prisma.package.delete(...)`.
- Wishlist removal uses the wishlist record id, not the product id.

## Frontend integration notes

When integrating with the frontend:

- Store the JWT from `/api/v1/auth/login` in localStorage, sessionStorage, or a secure cookie.
- Include the token in the `Authorization` header for protected routes.
- For product filtering, pass query parameters exactly as documented above.
- For order creation, send the object with `address`, `city`, `phone`, and `items`.
- For wishlist deletion, call `DELETE /api/v1/wishlists/:wishlistId` where `:wishlistId` is the wishlist item id.
- Do not send a `role` field in register requests; the backend overrides it to `CUSTOMER`.

## Database summary

Main Prisma models:

- User
- Category
- Product
- Package
- PackageItem
- Wishlist
- Order
- OrderItem

Enum values:

- Role: `CUSTOMER`, `ADMIN`
- OrderStatus: `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`
- SkinType: `OILY`, `DRY`, `NORMAL`, `COMBINATION`, `SENSITIVE`
- ProductType: `ORGANIC`, `FORMULATED`

## Scripts

```json
{
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

## License

This project is currently licensed as ISC in `package.json`.
