import mongoose from "mongoose";



const userSchema = new mongoose.Schema(

{

name: {

type: String,
unique: true,

required: true,

 trim: true

 },

 email: {

type: String,

 required: true,

unique: true,

 lowercase: true,

 trim: true

 },

 password: {

 type: String,

 required: true,

 minlength: 6

}

 },

{

timestamps: true

}

);



const User = mongoose.model("User", userSchema);



export default User;

