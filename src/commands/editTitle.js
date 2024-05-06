const shopModel = require("../models/permShopModel.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, MessageCollector } = require('discord.js');
const emotes = require("../emotes.js");
const id = require("../id.js");

module.exports = {
    name: "editTitle",
    async execute(message, messageArray, image, hehe) {
        const permashopChannel = await message.client.channels.cache.get(id.permShopChannel);

        if (!isNaN(Number(messageArray[1]))) {
            const editMessage = await permashopChannel.messages.fetch(messageArray[1]);
            if (messageArray[2] == undefined) {
                try {
                    shopModel.findOneAndUpdate(
                        { id: messageArray[1] },
                        { $set: { title: "" } },
                    )
                    const shop = await shopModel.findOne(
                        { id: messageArray[1] }
                    )
                    const claimed = shop.claimed;
                    editMessage.edit({ content: `\n\n### ${claimed} people have claimed this!` });
                    message.reply("successfully edited shop to blank!");
                } catch (e) {
                    console.log("Error setting permashop title to empty: " + e.message);
                }
            } else {
                const newContent = message.content.split(messageArray[1])[1];
                const newContentTrimmed = newContent.trim();
                try {
                    await shopModel.findOneAndUpdate(
                        { id: messageArray[1] },
                        { $set: { title: newContentTrimmed } },
                    )
                    const shop = await shopModel.findOne(
                        { id: messageArray[1] }
                    )
                    const claimed = shop.claimed;
                    editMessage.edit({ content: `${newContentTrimmed}\n\n### ${claimed} people have claimed this!` });
                    message.reply(`successfully edited shop to ${newContentTrimmed}!`);
                } catch (e) {
                    console.log("Error setting permashop title: " + e.message);
                }
            }
        }
    }

}