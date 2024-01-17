import express from 'express';
import cors from 'cors';

import  authRoutes  from '../routes/auth.routes.js';
import  userRoutes  from '../routes/users.routes.js';

import { dbConnection } from '../database/config.db.js';

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;


    this.authPath = '/api/auth';
    this.usersPath = '/api/users';

    //Conexion to Database
    this.databaseConexion();

    //Middlewares
    this.middlewares();

    //Routes
    this.routes();
  }

  async databaseConexion(){
    await dbConnection();
  }

  middlewares() {

    //CORS
    this.app.use(cors());

    //Read and Parse from Body
    this.app.use(express.json());

    //Public Directory
    this.app.use(express.static('public'));
  }

  routes() {
   this.app.use(this.authPath, authRoutes);
   this.app.use(this.usersPath, userRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en el puerto: ${this.port}`);
    });
  }
}

export default Server;
