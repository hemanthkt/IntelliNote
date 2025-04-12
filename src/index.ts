import express from "express"
const app = express();
import mongoose from "mongoose";
import { UserModel } from "./db";
mongoose.connect("mongodb+srv://hmkt:12345@cluster0.lue3xn6.mongodb.net/IntelliNote?retryWrites=true&w=majority&appName=Cluster0")
app.use(express.json());



app.post("/api/v1/signup",async (req, res) => {
    const {username, password} = req.body

    try {
        await UserModel.create({
            username,password
        })
        res.json({
            message: "You are signed up"
        })
    
    } catch (error) {
        
    }
    
    
   
})
 


app.post("/api/v1/signup", (req, res) => {
   
    
})
app.post("/api/v1/signup", (req, res) => {
   
    
})
app.post("/api/v1/signup", (req, res) => {
   
    
})