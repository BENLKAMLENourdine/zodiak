import { NextFunction, Request, Response } from "express";
import { Middleware } from "../../core/@Middleware";

@Middleware()
export class LoggerMiddleware implements Middleware {
  use(req: Request, res: Response, next: NextFunction): void {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  }
}
