import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void>{
    //As Next JS works on edge time framework everytime api call is being made it connects db again and again which creates choking thus check the connection 1st before executing
    if(connection.isConnected){
        console.log("Already Connected to database");
        return
    }
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})

        console.log("DB : ", db);
        
        console.log("DB : ", db.connections);
        connection.isConnected = db.connections[0].readyState;

        console.log('DB Connected Successfully')
    } catch (error){
        console.log("Database connection failed", error);

        process.exit(1)
    }
}

export default dbConnect;