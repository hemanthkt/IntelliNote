import   mongoose, { model,    Schema,  } from "mongoose";

const User = new  Schema({
    username: {type: String, unique: true},
    password: String
})


const Content = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User',required: true}
})

const LinkSchema = new Schema ({ 
    hash: String,
    userId : {type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true}
})
export const LinksModel = model("Link", LinkSchema)
export  const UserModel =  model("User", User)
export  const ContentModel =  model("Content", Content)

