import mongoose from "mongoose";

type connectObject = {
    isConnected?: number;
};

const connection: connectObject = {};


async function mongoDBConnecnt(): Promise<void> {
    
    if(connection.isConnected){
        console.log("Already connected to database")
        return;
    }

    try {
        
        const db = await mongoose.connect( process.env.MONGODB_URI || "" )
        connection.isConnected = db.connections[0].readyState;
        console.log("DB connected Successfully");

    } catch (error) {

        console.log("DB connection failed!")
        process.exit(1);
        
    }
}

export default mongoDBConnecnt;