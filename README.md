# Zodiak - TypeScript Dependency Injection Framework

A lightweight, modular TypeScript framework for building scalable backend applications with dependency injection, decorators, and a clean architecture pattern.

## 🎯 Features

- **Dependency Injection Container** - Automatic service registration and resolution
- **Decorator-Based Architecture** - Clean, declarative code using TypeScript decorators
- **Module System** - Organize code into reusable, feature-based modules
- **Middleware Support** - First-class middleware support with easy registration
- **Express Integration** - Built on top of Express.js for HTTP handling
- **Type Safety** - Full TypeScript support with strict type checking
- **Testing Built-In** - Vitest configuration for unit and integration testing
- **ESLint & Prettier** - Code quality and formatting out of the box

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Core Concepts](#core-concepts)
- [Decorators](#decorators)
- [Creating Modules](#creating-modules)
- [Dependency Injection](#dependency-injection)
- [Middleware](#middleware)
- [Routing](#routing)
- [Testing](#testing)
- [Available Scripts](#available-scripts)
- [Project Requirements](#project-requirements)

### Prerequisites

- Node.js >= 18.x
- npm or yarn

### Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd zodiak
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Build the project:

```bash
npm run build
```

## ⚡ Quick Start

### Running the Application

Start the development server with hot-reload:

```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 3000).

### Example: Creating Your First Module

1. **Create a Service** (`src/modules/hello/hello.service.ts`):

```typescript
import { Injectable } from "../../../core/@Injectable";

@Injectable()
export class HelloService {
  getHello(): { message: string } {
    return { message: "Hello from Zodiak!" };
  }
}
```

2. **Create a Controller** (`src/modules/hello/hello.controller.ts`):

```typescript
import { Controller } from "../../../core/@Controller";
import { Route } from "../../../core/@Route";
import { HelloService } from "./hello.service";

@Controller("/hello")
export class HelloController {
  constructor(private helloService: HelloService) {}

  @Route("get", "/")
  getHello() {
    return this.helloService.getHello();
  }
}
```

3. **Create a Module** (`src/modules/hello/hello.module.ts`):

```typescript
import { Module } from "../../../core/@Module";
import { HelloController } from "./hello.controller";
import { HelloService } from "./hello.service";

@Module({
  controllers: [HelloController],
  providers: [HelloService],
})
export class HelloModule {}
```

4. **Register in AppModule** (`src/app.module.ts`):

```typescript
import { Module } from "../core/@Module";
import { HelloModule } from "./modules/hello/hello.module";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports: [HelloModule, UserModule, AuthModule],
})
export class AppModule {}
```

## 🗂️ Project Structure

```
zodiak/
├── core/                        # Framework core
│   ├── @Controller/             # Controller decorator
│   ├── @Injectable/             # Injectable decorator
│   ├── @Middleware/             # Middleware decorator
│   ├── @Module/                 # Module decorator
│   ├── @Route/                  # Route decorator
│   ├── container.ts             # DI container
│   ├── utils/
│   │   └── errors.ts            # Error handling
│   └── index.ts                 # Core exports
├── src/
│   ├── app.module.ts            # Root application module
│   ├── main.ts                  # Application entry point
│   ├── middlewares/             # Global middlewares
│   │   └── logger.middleware.ts # Logger middleware
│   └── modules/                 # Feature modules
│       ├── auth/
│       │   ├── auth.module.ts
│       │   └── auth.service.ts
│       └── user/
│           ├── user.module.ts
│           ├── user.controller.ts
│           └── user.service.ts
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## 🎓 Core Concepts

### Modules

Modules are containers for related features. Each module can have:

- **Controllers** - Handle HTTP requests
- **Providers** - Services for business logic
- **Imports** - Other modules that this module depends on

### Dependency Injection

The framework automatically resolves dependencies through the container. Services marked with `@Injectable()` can be injected into controllers and other services.

### Controllers

Controllers handle HTTP requests and return responses. Routes are defined using decorators.

### Providers

Providers are services that contain business logic. They are injectable and can be used throughout the application.

## 🏷️ Decorators

### @Module

Defines a module with its controllers, providers, and imports.

```typescript
@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [AuthModule],
})
export class UserModule {}
```

### @Injectable

Marks a class as a provider that can be injected.

```typescript
@Injectable()
export class UserService {
  // Service implementation
}
```

### @Controller

Marks a class as a controller and defines the base route.

```typescript
@Controller("/users")
export class UserController {
  // Route handlers
}
```

### @Route

Defines a route handler with HTTP method and path.

```typescript
@Controller("/users")
export class UserController {
  @Route("get", "/")
  getUsers() {}

  @Route("post", "/")
  createUser(req, res) {}

  @Route("get", "/:id")
  getUserById(req, res) {}

  @Route("put", "/:id")
  updateUser(req, res) {}

  @Route("delete", "/:id")
  deleteUser(req, res) {}
}
```

### @Middleware

Marks a class as middleware that processes requests.

```typescript
@Middleware()
export class LoggerMiddleware {
  handle(req, res, next) {
    console.log(`${req.method} ${req.path}`);
    next();
  }
}
```

## 📚 Creating Modules

Here's a complete example of creating a new module:

1. **Define the Service**:

```typescript
// src/modules/product/product.service.ts
import { Injectable } from "../../../core/@Injectable";

@Injectable()
export class ProductService {
  private products = [];

  getAllProducts() {
    return this.products;
  }

  getProductById(id: string) {
    return this.products.find((p) => p.id === id);
  }

  createProduct(product: any) {
    this.products.push(product);
    return product;
  }
}
```

2. **Create the Controller**:

```typescript
// src/modules/product/product.controller.ts
import { Controller } from "../../../core/@Controller";
import { Route } from "../../../core/@Route";
import { ProductService } from "./product.service";

@Controller("/products")
export class ProductController {
  constructor(private productService: ProductService) {}

  @Route("get", "/")
  getProducts(req, res) {
    res.json(this.productService.getAllProducts());
  }

  @Route("get", "/:id")
  getProductById(req, res) {
    res.json(this.productService.getProductById(req.params.id));
  }

  @Route("post", "/")
  createProduct(req, res) {
    const product = this.productService.createProduct(req.body);
    res.status(201).json(product);
  }
}
```

3. **Define the Module**:

```typescript
// src/modules/product/product.module.ts
import { Module } from "../../../core/@Module";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
```

4. **Register the Module**:

```typescript
// src/app.module.ts
import { Module } from "../core/@Module";
import { ProductModule } from "./modules/product/product.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [ProductModule, UserModule],
})
export class AppModule {}
```

## 💉 Dependency Injection

The framework provides automatic dependency injection. Services are automatically resolved and injected:

```typescript
@Injectable()
export class EmailService {
  send(to: string, message: string) {
    console.log(`Sending email to ${to}: ${message}`);
  }
}

@Injectable()
export class UserService {
  constructor(private emailService: EmailService) {}

  registerUser(email: string) {
    this.emailService.send(email, "Welcome!");
  }
}
```

## 🔌 Middleware

Register global middleware in `main.ts`:

```typescript
import { LoggerMiddleware } from "./middlewares/logger.middleware";

export default Server.create(app, AppModule, process.env.PORT, [
  LoggerMiddleware,
]);
```

Create middleware:

```typescript
import { Middleware } from "../../../core/@Middleware";

@Middleware()
export class LoggerMiddleware {
  handle(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  }
}
```

## 🛣️ Routing

Routes are defined using the `@Route` decorator with HTTP method and path:

```typescript
@Controller("/api/users")
export class UserController {
  @Route("get", "/") // GET /api/users
  getAllUsers(req, res) {}

  @Route("get", "/:id") // GET /api/users/:id
  getUserById(req, res) {}

  @Route("post", "/") // POST /api/users
  createUser(req, res) {}

  @Route("put", "/:id") // PUT /api/users/:id
  updateUser(req, res) {}

  @Route("delete", "/:id") // DELETE /api/users/:id
  deleteUser(req, res) {}

  @Route("patch", "/:id") // PATCH /api/users/:id
  partialUpdateUser(req, res) {}
}
```

## 🧪 Testing

### Running Tests

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

Run a specific test file:

```bash
npm test -- src/modules/user/user.service.test.ts
```

### Writing Tests

Create a test file next to your module:

```typescript
// src/modules/user/user.service.test.ts
import { describe, it, expect } from "vitest";
import { UserService } from "./user.service";

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  it("should create a user", () => {
    const user = userService.createUser({ name: "John" });
    expect(user).toBeDefined();
    expect(user.name).toBe("John");
  });

  it("should get a user by id", () => {
    const user = userService.createUser({ name: "John" });
    const found = userService.getUserById(user.id);
    expect(found).toEqual(user);
  });
});
```

## 📜 Available Scripts

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `npm start`         | Start development server with hot-reload |
| `npm run build`     | Build TypeScript to JavaScript           |
| `npm test`          | Run tests with Vitest                    |
| `npm run lint`      | Check code quality with ESLint           |
| `npm run lint:fix`  | Fix linting issues automatically         |
| `npm run typecheck` | Type check without emitting files        |

## 📦 Project Requirements

### Runtime Dependencies

- **express** - HTTP server framework
- **reflect-metadata** - TypeScript metadata reflection
- **dotenv** - Environment variable management
- **chalk** - Terminal string styling

### Development Dependencies

- **typescript** - Language and type system
- **ts-node** - TypeScript execution environment
- **nodemon** - Development server auto-reload
- **vitest** - Unit testing framework
- **supertest** - HTTP assertion library
- **eslint** - Code linting
- **prettier** - Code formatting
- **@types/\*** - TypeScript type definitions

## 🎨 Code Style

The project uses ESLint and Prettier for consistent code formatting. Run before committing:

```bash
npm run lint:fix
```

## 📄 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support

For issues and questions, please open an issue in the repository.

---

**Happy coding with Zodiak! 🚀**
