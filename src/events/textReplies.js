const { Events, time } = require('discord.js');
const emotes = require("../emotes.js");
const id = require("../id.js");
const { len, imageArray } = require('../thumbnails.js');
const { heheGen } = require('../hehe.js');
const profileModel = require("../models/profileSchema.js");
const { profile } = require('console');
const { CommandCooldown } = require("discord-command-cooldown");
const { generateFib } = require('../fib.js');
const ms = require('ms');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        //if (message.channel.id != 1135923765906260028) return;


        if (message.author.bot || 
            message.author.system || 
            message.guild == null || 
            message.channel.id == id.veriChannel) return;

        const msg = message.content.toLowerCase();
        const author = message.author.id;
      
        if (msg.startsWith('*') && msg.endsWith("*") && (message.channel.id == '648710922768089109' || message.channel.id == '1135923765906260028')) {
            message.client.commands.get('interaction_rep').execute(message);
        } else if (msg.includes('avocado')) {
            message.client.commands.get('avoc_rep').execute(message);
          
        } else if (msg.includes('patpat') || msg.includes('boop')) {
            message.client.commands.get('pat_rep').execute(message);
          
        } else if (msg.includes('avokaido')) {
            message.client.commands.get('avokai_rep').execute(message);
          
        } else if (msg.includes('kai')) {
            message.client.commands.get('kai_rep').execute(message);
        } else if (msg.includes('i am') || msg.includes("i'm") || msg.includes('im') && message.channel.id == '648710922768089109') {
            message.client.commands.get('iam_rep').execute(message, msg, author);
          
        } 
    }
}