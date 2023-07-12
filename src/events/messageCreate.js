const { Events, time } = require('discord.js');
const emotes = require("../emotes.js");
const id = require("../id.js");
const { len, imageArray } = require('../thumbnails.js');
const { heheGen } = require('../hehe.js');
const profileModel = require("../models/profileSchema.js");
const { profile } = require('console');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        //image generator
        const random = Math.floor(Math.random() * len);
        const image = imageArray[random];

        //hehe generator
        const hehe = heheGen();
        
        if (message.channel.id == id.veriChannel) {
            message.client.commands.get("verify").execute(message, image, hehe);
        }
    }

}