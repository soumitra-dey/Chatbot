const bot = require("../utils/BotSetup")
const {startreply, helpreply, botsignup, botlogin, botlogout} = require("../Controllers/BotController")
const {createboard, updateboard, deleteboard, viewboard} = require("../Controllers/BoardController")
const {createlist, viewlist, updatelist, deletelist} = require("../Controllers/ListController")
const {createcard, updatecardname, updatecardlist, deletecard} = require("../Controllers/CardController")


function BotRoutes(){
    bot.on('message', (msg) => {
        
        switch(msg.text.split("/")[1]) {
            case "start":
                return startreply(msg)
            case "help":
                return helpreply(msg)
            case "signup":
                return botsignup(msg)
            case "login":
                return botlogin(msg)
            case "logout":
                return botlogout(msg)
            case "createboard":
                return createboard(msg)
            case "updateboard":
                return updateboard(msg)
            case "viewboard":
                return viewboard(msg)
            case "deleteboard":
                return deleteboard(msg)
            case "createlist":
                return createlist(msg)
            case "viewlist":
                return viewlist(msg)
            case "updatelist":
                return updatelist(msg)
            case "deletelist":
                return deletelist(msg)
            case "createcard":
                return createcard(msg)
            case "updatecardname":
                return updatecardname(msg)
            case "updatecardlist":
                return updatecardlist(msg)
            case "deletecard":
                return deletecard(msg)
            default:
                return helpreply(msg)
        }
    });
}

module.exports=BotRoutes