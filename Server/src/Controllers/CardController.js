const bot = require("../utils/BotSetup")
const UserModel =require("../Models/user.model")
const axios = require("axios")
require("dotenv").config()


// to create a card
const createcard = async(msg) => {
    const user = await UserModel.findOne({chat_id:msg.chat.id})
    try{
        if (!user) {
            bot.sendMessage(msg.chat.id,"Please login first")
        } else {
            const data=msg.text.split("/")
            if (user.board) {
                if (user.lists[data[2]]) {
                    axios.post(`https://api.trello.com/1/cards?idList=${user.lists[data[2]]}&name=${data[3]}&key=${process.env.TR_APIKEY}&token=${process.env.TR_TOKEN}`)
                    .then(async(e)=>{
                        delete user.lists[e.data.name]
                        await UserModel.findByIdAndUpdate({_id:user.id},{lists:user.lists})
                        bot.sendMessage(msg.chat.id,"Card added!")
                    })
                } else {
                    bot.sendMessage(msg.chat.id,"List not exist!")
                }
            } else {
                bot.sendMessage(msg.chat.id,"Please, first create a board")
            }
        }
    }catch(e){
        bot.sendMessage(msg.chat.id,"Something went wrong")
    }
}


// to change a card name
const updatecardname = async(msg) => {
    const user = await UserModel.findOne({chat_id:msg.chat.id})
    try{
        if (!user) {
            bot.sendMessage(msg.chat.id,"Please login first")
        } else {
            const data=msg.text.split("/")
            if (user.board) {
                if (user.lists[data[2]]) {
                    axios.get(`https://api.trello.com/1/lists/${user.lists[data[2]]}/cards?key=${process.env.TR_APIKEY}&token=${process.env.TR_TOKEN}`)
                    .then(async(e)=>{
                        let id;
                        e.data.forEach((el)=>{
                            if (el.name==data[3]) {
                                id=el.id
                            }
                        })
                        if (!id) {
                            bot.sendMessage(msg.chat.id,"Card not exist!")
                        } else {
                            axios.put(`https://api.trello.com/1/cards/${id}?name=${data[4]}&key=${process.env.TR_APIKEY}&token=${process.env.TR_TOKEN}`)
                            .then(()=>{
                                bot.sendMessage(msg.chat.id,"Card name updated!")
                            })
                        }
                    })
                } else {
                    bot.sendMessage(msg.chat.id,"List not exist!")
                }
            } else {
                bot.sendMessage(msg.chat.id,"Please, first create a board")
            }
        }
    }catch(e){
        bot.sendMessage(msg.chat.id,"Something went wrong")
    }
}


// to change one list to another list
const updatecardlist = async(msg) => {
    const user = await UserModel.findOne({chat_id:msg.chat.id})
    try{
        if (!user) {
            bot.sendMessage(msg.chat.id,"Please login first")
        } else {
            const data=msg.text.split("/")
            if (user.board) {
                if (user.lists[data[2]]) {
                    axios.get(`https://api.trello.com/1/lists/${user.lists[data[2]]}/cards?key=${process.env.TR_APIKEY}&token=${process.env.TR_TOKEN}`)
                    .then(async(e)=>{
                        let id;
                        e.data.forEach((el)=>{
                            if (el.name==data[3]) {
                                id=el.id
                            }
                        })
                        if (!id) {
                            bot.sendMessage(msg.chat.id,"Card not exist!")
                        } else {
                            axios.put(`https://api.trello.com/1/cards/${id}?idList=${user.lists[data[4]]}&key=${process.env.TR_APIKEY}&token=${process.env.TR_TOKEN}`)
                            .then(()=>{
                                bot.sendMessage(msg.chat.id,"Card list updated!")
                            })
                        }
                    })
                } else {
                    bot.sendMessage(msg.chat.id,"List not exist!")
                }
            } else {
                bot.sendMessage(msg.chat.id,"Please, first create a board")
            }
        }
    }catch(e){
        bot.sendMessage(msg.chat.id,"Something went wrong")
    }
}

// to delete a card
const deletecard = async(msg) => {
    const user = await UserModel.findOne({chat_id:msg.chat.id})
    try{
        if (!user) {
            bot.sendMessage(msg.chat.id,"Please login first")
        } else {
            const data=msg.text.split("/")
            if (user.board) {
                if (user.lists[data[2]]) {
                    axios.get(`https://api.trello.com/1/lists/${user.lists[data[2]]}/cards?key=${process.env.TR_APIKEY}&token=${process.env.TR_TOKEN}`)
                    .then(async(e)=>{
                        let id;
                        e.data.forEach((el)=>{
                            if (el.name==data[3]) {
                                id=el.id
                            }
                        })
                        if (!id) {
                            bot.sendMessage(msg.chat.id,"Card not exist!")
                        } else {
                            axios.delete(`https://api.trello.com/1/cards/${id}?key=${process.env.TR_APIKEY}&token=${process.env.TR_TOKEN}`)
                            .then(()=>{
                                bot.sendMessage(msg.chat.id,"Card deleted!")
                            })
                        }
                    })
                } else {
                    bot.sendMessage(msg.chat.id,"List not exist!")
                }
            } else {
                bot.sendMessage(msg.chat.id,"Please, first create a board")
            }
        }
    }catch(e){
        bot.sendMessage(msg.chat.id,"Something went wrong")
    }
}



module.exports={createcard, updatecardname, updatecardlist, deletecard}