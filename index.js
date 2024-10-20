import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './db/connection.js'
import { appRouter } from './src/app.router.js'
dotenv.config()
const app = express()
const port = process.env.PORT



// DB 
connectDB()

//  Routing  >> APIS 

appRouter(app, express)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))  