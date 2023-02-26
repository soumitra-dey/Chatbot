const { Schema, model } = require("mongoose");

const user = new Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    chat_id:{
        type:Number,
        default:""
    },
    board:{
        type:String
    },
    lists:{
        type:Object
    }
})

const UserModel=model("userData", user)

module.exports=UserModel