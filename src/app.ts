import { envs } from "./config";
import { MongoDatabase } from "./data/mongodb";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";


(() =>{
    main();
})()


async function main (){


    await MongoDatabase.connect({
        mongoURL: envs.MONGO_URL,
        dbName: envs.DB_NAME
    })

    

    new Server({
        port: envs.PORT,
        routes: AppRoutes.routes
    }).start();
}