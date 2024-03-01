"use strict";

import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from 'morgan';
import userRoutes from '../src/users/user.routes.js';

import { dbConnection } from "./mongo.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.conectarDB();
    this.middlewares();
    this.routes();

    this.userPath = '/OpinionsManager/v1/users';
    this.authPath = '/OpinionsManager/v1/auth';
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extend: false }));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
  }

  routes() {
    this.app.use(this.userPath, userRoutes);
    this.app.use(this.authPath, authRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port ", this.port);
    });
  }
}

export default Server;
