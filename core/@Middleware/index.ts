import { NextFunction, Request, Response } from "express";
import { Constructor } from "../container";

export interface Middleware {
  use(req: Request, res: Response, next: NextFunction): void;
}

export function Middleware() {
  return function (constructor: Constructor<Middleware>) {
    Reflect.defineMetadata("isMiddleware", true, constructor);
  };
}
