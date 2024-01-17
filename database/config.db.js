import mongoose from "mongoose";

const dbConnection = async() => {

    try {
        mongoose.connect(process.env.MONGO_DB);
        console.log('Base de datos conectada correctamente');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error al conectar a la base de datos')
    }
}


export {
    dbConnection
}