import mongoose from "mongoose";


interface Options{
    mongoURL: string;
    dbName: string;
}

export class MongoDatabase {


    static async connect(options: Options){
        try {

            const {mongoURL, dbName} = options;

            mongoose.connect(mongoURL,{
                dbName: dbName,
            });
            console.log('Mongo connected');
            return true;
            
        } catch (error) {
            console.log('Mongo connection error');
            throw error;
        }
    }

}