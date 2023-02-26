require("dotenv").config()
const mongoose=require("mongoose")

const Connect = () => mongoose.connect(process.env.DBURL)

module.exports = Connect