const express=require('express')
require("dotenv").config()
const Connect = require("./src/Config/Connect")
// const AllRoute = require("./src/Router/AllRoutes")
const http=require("http")
const BotRoutes=require("./src/Router/BotRoutes")




const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// app.use("/",AllRoute)

// Create server for Telegram Bot
const server = http.createServer(app);
BotRoutes(server)


app.listen(process.env.PORT, async () => {
    await Connect().then(()=>{
        console.log("App listening on",process.env.PORT)
    })
})