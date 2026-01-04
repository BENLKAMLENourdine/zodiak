import "reflect-metadata";

import express from "express";
import "dotenv/config";

import { Server } from "../core";
import { AppModule } from "./app.module";
import { LoggerMiddleware } from "./middlewares/logger.middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default Server.create(app, AppModule, process.env.PORT, [
  LoggerMiddleware,
]);
