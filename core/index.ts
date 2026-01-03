/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import chalk from "chalk";
import { Constructor, Container } from "./container";
import core from "express";
import { Route } from "./@Route";
import { AppError, HTTP_ERRORS } from "./utils/errors";
import { AppModule } from "../src/app.module";
import { ModuleMetadata } from "./@Module";

export type Method = "get" | "post" | "put" | "delete" | "patch";

export class Server {
  private controllers: Constructor<unknown>[];
  private providers: Constructor<unknown>[];
  private imports: Constructor<unknown>[];

  private container: Container;
  private app: core.Express;
  private port: string | undefined;

  public constructor(
    appModule: typeof AppModule,
    port: string,
    app: core.Express,
  ) {
    this.container = new Container();
    this.app = app;
    this.port = port;

    const moduleMetadata = Reflect.getMetadata(
      "module:metadata",
      appModule,
    ) as ModuleMetadata;

    console.log(
      chalk.hex("#8B5CF6")(`[BOOTSTRAP] Scanning module: ${appModule.name}`),
    );

    this.providers = [];
    this.controllers = [];
    this.imports = [];

    this.scanModuleMetadata(moduleMetadata);
  }

  private scanModuleMetadata(moduleMetadata: ModuleMetadata) {
    this.providers.push(...(moduleMetadata.providers || []));
    this.controllers.push(...(moduleMetadata.controllers || []));
    this.imports.push(...(moduleMetadata.imports || []));

    for (const importedModule of moduleMetadata.imports || []) {
      console.log(
        chalk.hex("#8B5CF6")(
          `[MODULE] Scanning module: ${importedModule.name}`,
        ),
      );

      const importedMetadata = Reflect.getMetadata(
        "module:metadata",
        importedModule,
      ) as ModuleMetadata;

      this.scanModuleMetadata(importedMetadata);
    }
  }

  public static create(
    app: core.Express,
    appModule: typeof AppModule,
    port: string | undefined,
  ): core.Express {
    const server = new Server(appModule, port || "3000", app);

    server.registerProviders();
    server.registerControllers();
    server.start();

    return server.app;
  }

  private start() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  private registerProviders() {
    for (const provider of this.providers) {
      console.log(
        chalk.hex("#22C55E")(
          `[PROVIDER] Registering provider: ${provider.name}`,
        ),
      );
      this.container.get(provider);
    }
  }

  private registerControllers() {
    for (const controller of this.controllers) {
      console.log(
        chalk.hex("#06B6D4")(
          `[CONTROLLER] Registering routes for controller: ${controller.name}`,
        ),
      );
      const instance = this.container.get(controller);

      const prefix = Reflect.getMetadata("controller:prefix", controller) || "";
      const routes = (Reflect.getMetadata("controller:routes", controller) ||
        []) as Route[];

      for (const route of routes) {
        const fullPath = prefix + route.url;

        console.log(
          chalk.hex("#E5E7EB")(
            `[ROUTE] Registering route: [${route.method.toUpperCase()}] ${fullPath} -> ${controller.name}.${route.handlerName}`,
          ),
        );

        this.app[route.method.toLowerCase() as Method](
          fullPath,
          async (req: core.Request, res: core.Response) => {
            try {
              const handler = (instance as any)[
                route.handlerName as keyof typeof instance
              ] as (
                req: core.Request,
                res: core.Response,
              ) => Promise<unknown> | undefined;

              if (typeof handler !== "function") {
                console.log(
                  chalk.hex("#FF0000")(
                    `[BOOTSTRAP][ERROR] Handler ${route.handlerName} not found on controller ${controller.name}`,
                  ),
                );
                throw new AppError(
                  HTTP_ERRORS.INTERNAL_SERVER_ERROR.message,
                  500,
                  `Handler ${route.handlerName} not found on controller ${controller.name}`,
                );
              }

              const result = await handler.call(instance, req, res);

              const status = route.method.toLowerCase() === "post" ? 201 : 200;
              if (result !== undefined) {
                res.status(status).send({
                  success: true,
                  data: result,
                });
              } else {
                res.status(status).send({
                  success: true,
                });
              }
            } catch (error) {
              if (
                error instanceof AppError &&
                "status" in error &&
                "code" in error
              ) {
                const status = error.status || 500;
                res.status(status).send({
                  success: false,
                  code: error.code,
                  message: error.message,
                });
              } else {
                res.status(500).send({
                  success: false,
                  message: "Internal Server Error",
                });
              }
            }
          },
        );
      }
    }
  }
}
