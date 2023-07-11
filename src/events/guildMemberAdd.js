const { Events } = require('discord.js');
const emotes = require("../emotes.js");
const id = require("../id.js");
const { len, imageArray } = require('../thumbnails.js');
const { heheGen } = require('../hehe.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        if (member.user.bot) return;

        //image generator
        const random = Math.floor(Math.random() * len);
        const image = imageArray[random];

        //hehe generator
        const hehe = heheGen();

        //First mentioned user
        var target = message.mentions.users.first();
        //For no mentions
        if (target == undefined) {
            var target = message.author;
        }
        const targetName = "<@" + target + ">";


        //Regular commands////////////////////////////////////////////////////////////////
        if (command == 'help') {
            try {
                message.client.commands.get("help").execute(message, image, hehe);
            } catch (error) {
                console.log('Error occurred with help command: ' + error.message);
            }
        }

    }
}