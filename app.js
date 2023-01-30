import express from 'express'
import * as dotenv from 'dotenv'
import router from './routes/routes.js';
dotenv.config()
const app = express();
import connect from './db/db.js';
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use(router)

app.listen(PORT,()=>{
    console.log(`server running  at port ${PORT}`)
    connect()

})