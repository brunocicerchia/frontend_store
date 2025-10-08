# API PixelPoint - Documentación de Endpoints

API RESTful para marketplace de dispositivos electrónicos construida con Spring Boot.

## 🔐 Autenticación

Todos los endpoints (excepto los públicos) requieren autenticación mediante JWT Token en el header:

```
Authorization: Bearer {token}
```

### Auth Endpoints

#### Registro de Usuario

```http
POST /api/v1/auth/register
```

**Body:**

```json
{
  "firstname": "string",
  "lastname": "string",
  "email": "string",
  "password": "string",
  "role": "BUYER | SELLER | ADMIN"
}
```

**Response:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login

```http
POST /api/v1/auth/authenticate
```

**Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK` - Mismo formato que registro

---

## 📱 Brands (Marcas)

### Listar Marcas

```http
GET /brands?page={page}&size={size}
```

🔓 **Público**

**Query Params:**

- `page` (opcional): Número de página (default: 0)
- `size` (opcional): Tamaño de página (default: todas)

**Response:** `200 OK`

```json
{
  "content": [
    {
      "id": 1,
      "name": "Samsung"
    }
  ],
  "pageable": { ... },
  "totalElements": 10
}
```

### Obtener Marca por ID

```http
GET /brands/{brandId}
```

🔓 **Público**

**Response:** `200 OK`

```json
{
  "id": 1,
  "name": "Samsung"
}
```

### Crear Marca

```http
POST /brands
```

🔒 **Requiere:** `ADMIN` o `SELLER`

**Body:**

```json
{
  "name": "Apple"
}
```

**Response:** `201 Created`

### Actualizar Marca

```http
PUT /brands/{id}
```

🔒 **Requiere:** `ADMIN` o `SELLER`

**Body:**

```json
{
  "name": "Apple Inc."
}
```

**Response:** `200 OK`

### Eliminar Marca

```http
DELETE /brands/{id}
```

🔒 **Requiere:** `ADMIN` o `SELLER`

**Response:** `204 No Content`

---

## 📲 Device Models (Modelos de Dispositivos)

### Listar Modelos

```http
GET /device-models?page={page}&size={size}
```

🔓 **Público**

**Response:** `200 OK`

```json
{
  "content": [
    {
      "id": 1,
      "brandId": 1,
      "brandName": "Samsung",
      "modelName": "Galaxy S23"
    }
  ]
}
```

### Obtener Modelo por ID

```http
GET /device-models/{id}
```

🔓 **Público**

### Crear Modelo

```http
POST /device-models
```

🔒 **Requiere:** `ADMIN` o `SELLER`

**Body:**

```json
{
  "brandId": 1,
  "modelName": "Galaxy S24"
}
```

**Response:** `201 Created`

### Actualizar Modelo

```http
PUT /device-models/{id}
```

🔒 **Requiere:** `ADMIN` o `SELLER`

**Body:**

```json
{
  "brandId": 1,
  "modelName": "Galaxy S24 Ultra"
}
```

### Eliminar Modelo

```http
DELETE /device-models/{id}
```

🔒 **Requiere:** `ADMIN` o `SELLER`

**Response:** `204 No Content`

---

## 🎨 Variants (Variantes)

Variantes de un modelo (RAM, almacenamiento, color, condición).

### Listar Variantes

```http
GET /variants?page={page}&size={size}
```

🔓 **Público**

**Response:** `200 OK`

```json
{
  "content": [
    {
      "id": 1,
      "deviceModelId": 1,
      "deviceModelName": "Galaxy S23",
      "ram": 8,
      "storage": 256,
      "color": "Black",
      "condition": "NEW | REFURB | USED"
    }
  ]
}
```

### Obtener Variante por ID

```http
GET /variants/{variantId}
```

🔓 **Público**

### Crear Variante

```http
POST /variants
```

🔒 **Requiere:** `ADMIN` o `SELLER`

**Body:**

```json
{
  "deviceModelId": 1,
  "ram": 12,
  "storage": 512,
  "color": "Phantom Black",
  "condition": "NEW"
}
```

**Response:** `201 Created`

### Actualizar Variante

```http
PUT /variants/{id}
```

🔒 **Requiere:** `ADMIN` o `SELLER`

### Eliminar Variante

```http
DELETE /variants/{id}
```

🔒 **Requiere:** `ADMIN` o `SELLER`

**Response:** `204 No Content`

---

## 🏪 Sellers (Vendedores)

### Listar Vendedores

```http
GET /seller?page={page}&size={size}
```

🔓 **Público**

**Response:** `200 OK`

```json
{
  "content": [
    {
      "id": 1,
      "user": { ... },
      "shopName": "TechStore",
      "description": "Los mejores dispositivos"
    }
  ]
}
```

### Obtener Vendedor por ID

```http
GET /seller/{id}
```

🔓 **Público**

### Crear Vendedor

```http
POST /seller
```

🔒 **Requiere:** `ADMIN` o `SELLER`

**Body:**

```json
{
  "shopName": "Mi Tienda Tech",
  "description": "Especialistas en smartphones"
}
```

**Response:** `201 Created`

**Nota:** El email del usuario se obtiene automáticamente del token JWT.

### Actualizar Vendedor

```http
PUT /seller/{id}
```

🔒 **Requiere:** `ADMIN` o `SELLER`

**Body:**

```json
{
  "shopName": "Mi Nueva Tienda",
  "description": "Nueva descripción"
}
```

### Eliminar Vendedor

```http
DELETE /seller/{id}
```

🔒 **Requiere:** `ADMIN` o `SELLER`

**Response:** `204 No Content`

---

## 📦 Listings (Publicaciones)

### Catálogo Público

```http
GET /listings?page={page}&size={size}
```

🔓 **Público** - Solo muestra listings activos con stock > 0

**Response:** `200 OK`

```json
{
  "content": [
    {
      "id": 1,
      "price": 899.99,
      "stock": 5,
      "active": true,
      "variantId": 1,
      "sellerId": 1
    }
  ]
}
```

### Obtener Listing por ID

```http
GET /listings/{id}
```

🔓 **Público**

### Crear Listing

```http
POST /listings
```

🔒 **Requiere autenticación**

**Body:**

```json
{
  "sellerId": 1,
  "variantId": 1,
  "price": 899.99,
  "stock": 10,
  "active": true
}
```

**Response:** `201 Created`

### Actualizar Listing

```http
PUT /listings/{id}
```

🔒 **Requiere autenticación**

**Body:**

```json
{
  "sellerId": 1,
  "price": 849.99,
  "stock": 8,
  "active": true
}
```

### Eliminar Listing

```http
DELETE /listings/{id}?sellerId={sellerId}
```

🔒 **Requiere autenticación**

**Response:** `204 No Content`

---

## 🛒 Carts (Carritos de Compra)

**Nota:** Solo usuarios con rol `BUYER` pueden tener carritos.

### Listar Carritos (Admin)

```http
GET /carts?page={page}&size={size}
```

🔒 **Requiere:** `ADMIN`

### Obtener Carrito por ID

```http
GET /carts/{id}
```

🔒 **Requiere:** `ADMIN` o `BUYER`

**Response:** `200 OK`

```json
{
  "cartId": 1,
  "items": [
    {
      "itemId": 1,
      "listingId": 5,
      "title": "Samsung Galaxy S23 - 8GB RAM/256GB - Black (NEW)",
      "quantity": 2,
      "unitPrice": 899.99,
      "subtotal": 1799.98
    }
  ],
  "total": 1799.98
}
```

### Crear Carrito

```http
POST /carts
```

🔒 **Requiere:** `ADMIN` o `BUYER`

**Body:**

```json
{
  "user": 1
}
```

**Response:** `201 Created`

### Agregar Item al Carrito

```http
POST /carts/{cartId}/items
```

🔒 **Requiere:** `ADMIN` o `BUYER`

**Body:**

```json
{
  "listing": 5,
  "quantity": 2
}
```

**Response:** `200 OK` - Devuelve el item creado/actualizado

### Listar Items del Carrito

```http
GET /carts/{cartId}/items
```

🔒 **Requiere:** `ADMIN` o `BUYER`

**Response:** `200 OK`

```json
[
  {
    "itemId": 1,
    "listingId": 5,
    "title": "Samsung Galaxy S23 - 8GB RAM/256GB - Black (NEW)",
    "quantity": 2,
    "unitPrice": 899.99,
    "subtotal": 1799.98
  }
]
```

### Actualizar Cantidad de Item

```http
PUT /carts/{cartId}/items/{itemId}
```

🔒 **Requiere:** `ADMIN` o `BUYER`

**Body:**

```json
{
  "quantity": 3
}
```

**Response:** `200 OK`

### Eliminar Item del Carrito

```http
DELETE /carts/{cartId}/items/{itemId}
```

🔒 **Requiere:** `ADMIN` o `BUYER`

**Response:** `204 No Content`

### Eliminar Carrito

```http
DELETE /carts/{id}
```

🔒 **Requiere:** `ADMIN`

**Response:** `204 No Content`

---

## 📊 Códigos de Estado HTTP

| Código | Descripción                                |
| ------ | ------------------------------------------ |
| 200    | OK - Solicitud exitosa                     |
| 201    | Created - Recurso creado exitosamente      |
| 204    | No Content - Eliminación exitosa           |
| 400    | Bad Request - Datos inválidos              |
| 401    | Unauthorized - Token inválido o ausente    |
| 403    | Forbidden - Sin permisos suficientes       |
| 404    | Not Found - Recurso no encontrado          |
| 500    | Internal Server Error - Error del servidor |

---

## 🔑 Roles y Permisos

| Rol      | Descripción   | Permisos                                   |
| -------- | ------------- | ------------------------------------------ |
| `BUYER`  | Comprador     | Crear/gestionar carritos, ver catálogo     |
| `SELLER` | Vendedor      | Crear marcas, modelos, variantes, listings |
| `ADMIN`  | Administrador | Acceso completo a todos los endpoints      |

---

## 🚀 Configuración

El proyecto usa Spring Boot 3.5.4 con:

- Java 21
- Spring Security + JWT
- Spring Data JPA
- MySQL / SQL Server
- Maven

### Variables de Entorno Requeridas

```properties
application.security.jwt.secretKey=tu_secret_key_aqui
application.security.jwt.expiration=86400000
```

### Configuración de Base de Datos

**SQL Server:**

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=pixelpoint
spring.datasource.username=springboot_user
spring.datasource.password=root
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect
```

---

## 📝 Notas Adicionales

- Todos los endpoints de paginación usan `page` (base 0) y `size`
- Los timestamps se manejan automáticamente por JPA
- Las relaciones entre entidades se validan antes de crear/actualizar
- Los precios se manejan como `Float` para mayor precisión
- Las condiciones de productos son: `NEW`, `REFURB`, `USED`

---

## 🛠️ Testing

Para probar los endpoints, puedes usar:

- Postman
- cURL
- Thunder Client (VSCode)
- Insomnia

**Ejemplo con cURL:**

```bash
# Login
curl -X POST http://localhost:8080/api/v1/auth/authenticate \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Usar el token
curl -X GET http://localhost:8080/brands \
  -H "Authorization: Bearer {tu_token}"
```

**Ejemplo con PowerShell:**

```powershell
# Login
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/authenticate" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"email":"user@example.com","password":"password123"}'

# Usar el token
$headers = @{ Authorization = "Bearer $($loginResponse.token)" }
Invoke-RestMethod -Uri "http://localhost:8080/brands" -Headers $headers
```

---

## 📁 Estructura del Proyecto

```
pixelpoint/
├── src/
│   ├── main/
│   │   ├── java/com/uade/tpo/pixelpoint/
│   │   │   ├── controllers/        # Controladores REST
│   │   │   ├── entity/             # Entidades JPA
│   │   │   │   ├── cart/           # Entidades de carrito
│   │   │   │   ├── catalog/        # Entidades de catálogo
│   │   │   │   ├── marketplace/    # Entidades de marketplace
│   │   │   │   └── dto/            # DTOs de request/response
│   │   │   ├── repository/         # Repositorios JPA
│   │   │   ├── services/           # Lógica de negocio
│   │   │   └── exceptions/         # Excepciones personalizadas
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

---

**Desarrollado por:** Grupo 08 - UADE TPO APIs
