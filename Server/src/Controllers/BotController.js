const bot = require("../utils/BotSetup")
const UserModel =require("../Models/user.model")
const axios = require("axios")
require("dotenv").config()

const startreply = (msg) => {
    let reply=`
Hello ${msg.chat.first_name}
Wellcome to TrelloBot
    `
    bot.sendMessage(msg.chat.id,reply);
}

const helpreply = (msg) => {
    let reply=`
/// For authentication
===============
user signup- /signup/{email_id}/{password}
user login- /login/{email_id}/{password}
user logout- /logout

/// For board
===============
create board- /createboard/{board name}
view board- /viewboard
update board- /updateboard/{new board name}
delete board- /deleteboard

/// For lists
===============
create list- /createlist/{list name}
viewlist- /viewlist
updatelist- /updatelist/{current list name}/{new list name}
deletelist- /deletelist/{list name}

/// For cards
===============
create card- /createcard/{list name}/{card name}
update card name- /updatecardname/{list name}/{old card name}/{new card name}
update card list- /updatecardlist/{old list name}/{card name}/{new list name}
delete card- /deletecard/{list name}/{card name}
    `
    bot.sendMessage(msg.chat.id,reply)
}

const botsignup = async(msg) => {
    let data=msg.text.split("/")

    const user=await UserModel.findOne({email:data[2]})
    try{
        if (!user){
            await UserModel.create({email:data[2],password:data[3]})
            bot.sendMessage(msg.chat.id,"Signup Successful")
        } else {
            bot.sendMessage(msg.chat.id,"You are a register user")
        }
    }catch(e){
        console.log(e.message)
        bot.sendMessage(msg.chat.id,"Something went wrong")
    }
}

const botlogin = async(msg) => {
    let data=msg.text.split("/")

    const user=await UserModel.findOne({email:data[2]})
    try{
        if (!user){
            bot.sendMessage(msg.chat.id,"You are not a register user")
        } else {
            if (user.password==data[3]) {
                await UserModel.findByIdAndUpdate({_id:user.id},{chat_id:msg.chat.id})
                bot.sendMessage(msg.chat.id,"Login Successful")
            } else {
                bot.sendMessage(msg.chat.id,"Wrong Password")
            }
        }
    }catch(e){
        bot.sendMessage(msg.chat.id,"Something went wrong")
    }
}

const botlogout = async(msg) => {
    const user=await UserModel.findOne({chat_id:msg.chat.id})
    try{
        if (!user) {
            bot.sendMessage(msg.chat.id,"Please login first!")
        } else {
            await UserModel.findByIdAndUpdate({_id:user.id},{chat_id:123})
            bot.sendMessage(msg.chat.id,"See you again!")
        }
    }catch(e){
        bot.sendMessage(msg.chat.id,"Something Went wrong")
    }
}






module.exports={startreply, helpreply,botsignup, botlogin, botlogout}