const bot = require("../utils/BotSetup");
const UserModel = require("../Models/user.model");
const axios = require("axios");
require("dotenv").config();

const createlist = async(msg) => {
    const user = await UserModel.findOne({chat_id:msg.chat.id})
    try{
        if (!user) {
            bot.sendMessage(msg.chat.id,"Please login first")
        } else {
            const data=msg.text.split("/")
            if (user.board) {
                axios.post(`https://api.trello.com/1/lists?name=${data[2]}&idBoard=${user.board}&key=${process.env.TR_APIKEY}&token=${process.env.TR_TOKEN}`)
                .then(async(e)=>{
                    user.lists[e.data.name]=e.data.id
                    await UserModel.findByIdAndUpdate({_id:user.id},{lists:user.lists})
                    bot.sendMessage(msg.chat.id,"List created!")
                })
            } else {
                bot.sendMessage(msg.chat.id,"Please, first create a board")
            }
        }
    }catch(e){
        bot.sendMessage(msg.chat.id,"Something went wrong")
    }
}

const viewlist = async(msg) => {
    const user = await UserModel.findOne({chat_id:msg.chat.id})
    try{
        if (!user) {
            bot.sendMessage(msg.chat.id,"Please login first")
        } else {
            if (!user.board) {
                bot.sendMessage(msg.chat.id,"Please create a board")
            } else {
                let ans="All Lists\n==========\n"
                Object.keys(user.lists).forEach((el,i)=>ans+=`${i+1}. ${el}\n`)
                bot.sendMessage(msg.chat.id,ans)
            }
        }
    }catch(e){
        bot.sendMessage(msg.chat.id,"Something went wrong")
    }
}

const updatelist = async(msg) => {
    const user = await UserModel.findOne({chat_id:msg.chat.id})
    try{
        if (!user) {
            bot.sendMessage(msg.chat.id,"Please login first")
        } else {
            const data=msg.text.split("/")
            if (user.board) {
                axios.put(`https://api.trello.com/1/lists/${user.lists[data[2]]}?key=${process.env.TR_APIKEY}&token=${process.env.TR_TOKEN}&name=${data[3]}`)
                .then(async(e)=>{
                    delete user.lists[data[2]]
                    user.lists[e.data.name]=e.data.id
                    await UserModel.findByIdAndUpdate({_id:user.id},{lists:user.lists})
                    bot.sendMessage(msg.chat.id,"List updated!")
                })
            } else {
                bot.sendMessage(msg.chat.id,"Please, first create a board")
            }
        }
    }catch(e){
        bot.sendMessage(msg.chat.id,"Something went wrong")
    }
}

const deletelist = async(msg) => {
    const user = await UserModel.findOne({chat_id:msg.chat.id})
    try{
        if (!user) {
            bot.sendMessage(msg.chat.id,"Please login first")
        } else {
            const data=msg.text.split("/")
            if (user.board) {
                axios.put(`https://api.trello.com/1/lists/${user.lists[data[2]]}/closed?value=true&key=${process.env.TR_APIKEY}&token=${process.env.TR_TOKEN}`)
                .then(async(e)=>{
                    delete user.lists[e.data.name]
                    await UserModel.findByIdAndUpdate({_id:user.id},{lists:user.lists})
                    bot.sendMessage(msg.chat.id,"List deleted!")
                })
            } else {
                bot.sendMessage(msg.chat.id,"Please, first create a board")
            }
        }
    }catch(e){
        bot.sendMessage(msg.chat.id,"Something went wrong")
    }
}


module.exports={createlist, viewlist, updatelist, deletelist}