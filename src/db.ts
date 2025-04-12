import   { model,    Schema,  } from "mongoose";

const User = new  Schema({
    username: {type: String, unique: true},
    password: String
})

export  const UserModel =  model("user", User)

