import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRoute from './router/client/user'
import adminRoute from './router/admin/admin'
import morgan = require('morgan')
import cors from 'cors'
import cookiesParser from 'cookie-parser'
import fileUpload from 'express-fileupload'

// env configeration
dotenv.config()

// mongoDB connection
mongoose.connect(process.env.MONGO_URL as string)
.then(()=>{
    console.log("connected to mongo db")
})
.catch((err)=>{
    console.log(err)
})

// app
const app = express()
app.use(cors({
    origin: 'https://mycrud-react.vercel.app', 
    credentials: true,              
}));
app.use(express.static('public'))
app.use(cookiesParser())
app.use(morgan('dev'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(fileUpload())

// route
app.use('/',userRoute)
app.use('/admin',adminRoute)
app.use('*',userRoute)


// listening to port
app.listen(process.env.PORT, ()=>{
    console.log("server is running on port 3000")
})

export default app