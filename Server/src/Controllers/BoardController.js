const bot = require("../utils/BotSetup");
const UserModel = require("../Models/user.model");
const axios = require("axios");
require("dotenv").config();

const createboard = async (msg) => {
  const user = await UserModel.findOne({ chat_id: msg.chat.id });
  try {
    if (!user) {
      bot.sendMessage(msg.chat.id, "Please login first");
    } else {
      const data = msg.text.split("/");
      if (!user.board) {
        axios
          .post(
            `https://api.trello.com/1/boards/?name=${data[2]}&key=${process.env.TR_APIKEY}&token=${process.env.TR_TOKEN}`
          )
          .then(async (e) => {
            await UserModel.findByIdAndUpdate(
              { _id: user.id },
              { board: e.data.id }
            );
            axios
              .get(
                `https://api.trello.com/1/board/${e.data.id}/lists?&key=${process.env.TR_APIKEY}&token=${process.env.TR_TOKEN}`
              )
              .then(async (e) => {
                let data = {};
                await e.data.forEach((el) => (data[el["name"]] = el["id"]));
                await UserModel.findByIdAndUpdate(
                  { _id: user.id },
                  { lists: data }
                );
              });
            bot.sendMessage(msg.chat.id, "Board created!");
          });
      } else {
        bot.sendMessage(msg.chat.id, "You can use only one board!");
      }
    }
  } catch (e) {
    bot.sendMessage(msg.chat.id, "Something Went wrong");
  }
};

const viewboard = async (msg) => {
  const user = await UserModel.findOne({ chat_id: msg.chat.id });
  try {
    if (!user) {
      bot.sendMessage(msg.chat.id, "Please login first");
    } else {
      if (!user.board) {
        bot.sendMessage(msg.chat.id, "Please create a board");
      } else {
        let ans = "==========\nAll Lists\n==========\n";
        Object.keys(user.lists).forEach(
          (el, i) => (ans += `${i + 1}. ${el}\n`)
        );
        ans += "==========\nList wise card\n==========\n";
        for (let a in user.lists) {
          ans += `/// ${a} ///\n--------------------\n`;
          await axios
            .get(
              `https://api.trello.com/1/lists/${user.lists[a]}/cards?key=${process.env.TR_APIKEY}&token=${process.env.TR_TOKEN}`
            )
            .then((el) => {
              el.data.forEach((e, i) => {
                ans += `${i + 1}. ${e.name}\n`;
              });
            });
          ans += "==========\n";
        }
        bot.sendMessage(msg.chat.id, ans);
      }
    }
  } catch (e) {
    bot.sendMessage(msg.chat.id, "Something went wrong");
  }
};

const updateboard = async (msg) => {
  const user = await UserModel.findOne({ chat_id: msg.chat.id });
  try {
    if (!user) {
      bot.sendMessage(msg.chat.id, "Please login first");
    } else {
      const data = msg.text.split("/");
      if (user.board) {
        axios
          .put(
            `https://api.trello.com/1/boards/${user.board}?name=${data[2]}&key=${process.env.TR_APIKEY}&token=${process.env.TR_TOKEN}`
          )
          .then(async (e) => {
            bot.sendMessage(msg.chat.id, "Board updated!");
          });
      } else {
        bot.sendMessage(msg.chat.id, "Please, first create a board");
      }
    }
  } catch (e) {
    bot.sendMessage(msg.chat.id, "Something went wrong");
  }
};

const deleteboard = async (msg) => {
  const user = await UserModel.findOne({ chat_id: msg.chat.id });
  try {
    if (!user) {
      bot.sendMessage(msg.chat.id, "Please login first");
    } else {
      if (user.board) {
        axios
          .delete(
            `https://api.trello.com/1/boards/${user.board}?key=${process.env.TR_APIKEY}&token=${process.env.TR_TOKEN}`
          )
          .then(async (e) => {
            await UserModel.findByIdAndUpdate(
              { _id: user.id },
              { board: "", lists: {} }
            );
            bot.sendMessage(msg.chat.id, "Board deleted!");
          });
      } else {
        bot.sendMessage(msg.chat.id, "Please, first create a board");
      }
    }
  } catch (e) {
    bot.sendMessage(msg.chat.id, "Something went wrong");
  }
};

module.exports = {createboard, updateboard, deleteboard, viewboard};
