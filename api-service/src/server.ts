import dotenv from "dotenv";
import app from "./app.js"
import sequelize from "./config/database.js";

dotenv.config()

const PORT = process.env.PORT || 5000

const startServer = async() => {
    try{
        await sequelize.transaction()
        console.log("Postgresql connected successfully")

        app.listen(PORT, ()=>{
            console.log(`Server is running on PORT ${PORT}`)
        })
    }catch(err){
        console.log("Unable to connect to database", err)
        process.exit(1)
    }
}

startServer()