import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number;
// Creates a TypeScript type for an object that may have isConnected.
// isConnected is a number (mongoose readyState), and ? means optional.
}

const connection:connectionObject = {} 

async function connectToDatabase() : Promise<void> {
    if(connection.isConnected) {
        console.log("Already connected to database");
        return;
    }
    try{

        const db = await mongoose.connect(process.env.MONGODB_URI as string);
        connection.isConnected = db.connections[0].readyState
// Stores mongoose connection state in your connection cache.
// readyState values are numbers, commonly:
// 0 = disconnected
// 1 = connected
// 2 = connecting
// 3 = disconnecting
        
        console.log("DB Connected SuccessFully");
        
    }
    catch (error) {
    console.error("Database Connection Failed:", error);
    throw error;
}

}

export default connectToDatabase;