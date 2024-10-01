import {model, Schema} from "mongoose";

export interface user{
    name:string;
    image?:string;
    email:string;
    password:string,
    isAdmin:boolean
}

const userSchema = new Schema<user>({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin :{
        type:Boolean,
        default:false
    }
})

const User = model('User',userSchema)
export default User