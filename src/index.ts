import express from "express"
const app = express();
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import { ContentModel, UserModel } from "./db";
import {  userMiddleware } from "./middleware";
mongoose.connect("mongodb+srv://hmkt:12345@cluster0.lue3xn6.mongodb.net/IntelliNote?retryWrites=true&w=majority&appName=Cluster0")
app.use(express.json());
const JWT_PASSWORD = "12345"


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
        res.json({
            message: "Username already exists"
        })
    }
    
    
   
})
 


app.post("/api/v1/signin",async (req, res) => {
   const {username, password} = req.body
   const existingUser = await UserModel.findOne({
    username, password
   })
   if(existingUser){
    const token = jwt.sign({
        id: existingUser._id
    },JWT_PASSWORD)
    res.json({
        token: token
    })
   }
    
})

app.post("/api/v1/content",userMiddleware ,async (req, res) => {
   const {type, link} = req.body
   await ContentModel.create({
    
    link, 
    type, 
    // @ts-ignore
    userId: req.userId,
    tags: []
   })

    res.json({
    message: "Content added"
   })
   
    
})
app.get("/api/v1/content",userMiddleware, async(req, res) => {
// @ts-ignore   
    const userId = req.userId
    if(userId){
        const allContent = await ContentModel.find({
            userId: userId
        }).populate("userId","username")
        res.json(
            allContent
        )
    }else{
        res.json({
            message: "invalid credentials"
        })
    }
})


app.delete("/api/v1/content",userMiddleware,async (req,res) => {
    const contentId = req.body.contentId
    await ContentModel.deleteMany({
        contentId,
        // @ts-ignore
        userId: req.userId
    })
})


app.post("/api/v1/brain/share",userMiddleware,async(req,res) => {
    const contentId = req.body.contentId
    
   
    try {
        const content = await ContentModel.findById({
            contentId })
            res.json({
                content
            })
    } catch (error) {
        res.json({
           message: "Couldnt share your thought"
        })
        
    }
})

app.delete("/api/v1/brain/:shareLink",(req,res) => {
    
})
app.listen(3000)