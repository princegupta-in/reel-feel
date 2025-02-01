import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
}

//global is object that is available globaly in nodejs
//global se mongoose nikalna hai, but it dosent exist there, not to worry, we will create it

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
    //check if connection is already there

    if (cached.conn) {
        return cached.conn;
    }

    //check if connection is not there, and promise for making connection is also not there
    //create a promise for making connection

    if (!cached.promise) {
        //optional

        const opts = {
            bufferCommands: false,
            maxPoolsize: 10,
        };

        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then(() => mongoose.connection);
    }

    //what if promise is already there, but connection is not there
    //make try catch block and wait for promise to resolve

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        //1. delete promise
        cached.promise = null;
        //2. throw error
        throw error;

    }

    //finally return the connection
    return cached.conn;
}
