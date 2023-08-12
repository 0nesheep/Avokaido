const { Events } = require("discord.js");
const profileModel = require("../models/profileSchema");
const shopModel = require('../models/permShopModel');
const id = require('../id.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.message.channel.id != id.permShopChannel) return;
          
        const shopId = interaction.message.id;
        const shopMsg = await interaction.channel.messages.fetch(shopId);
        const shopEmbed = shopMsg.embeds[0];
            
        const user = interaction.user;
            
        const currShop = await shopModel.findOne(
            { id: shopId }
        );

        if (!currShop) return;


        const price = currShop.price;
        const link = currShop.link;
        var claimed = currShop.claimed;
        const claimedUsers = currShop.claimedUsers;
        const title = shopEmbed.data.title;
            
        try {
            interaction.deferUpdate();

            if (interaction.customId == 'shopClaim') {
                if (claimedUsers.includes(user.id)) {
                    return user.send("You have already purchased from the shop! Save some for others >:(");
                }
                const currUser = await profileModel.findOne(
                    { userId: user.id }
                )
                if (!currUser) {
                    return await user.send("You have not registered! Please register before purchasing from the shops!");
                }
                const balanceAmt = currUser.petals;
            
                if (balanceAmt < price) {
                    return await user.send(`You do not have enough plums to purchase the item from **"${title}"** >:0`);
                }
                
                
                await shopModel.findOneAndUpdate(
                    { id: shopId },
                    { 
                        $inc: { claimed: 1 },
                        $push: { claimedUsers: user.id }
                    }
                )

                await profileModel.findOneAndUpdate(
                    { userId: user.id },
                    { 
                        $inc: { petals: -price }
                    }
                )
                
                const newShopData = await shopModel.findOne(
                    { id: shopId }
                );

                claimed = newShopData.claimed;
                shopEmbed.data.fields[0] = { name: 'Amount sold', value: `${claimed}` }
                
                    
                await shopMsg.edit({ embeds: [shopEmbed] });
                return user.send(`Thank you for purchasing the item from "**${title}**"! Here is the link to the file
${link}`);
                
            } else if (interaction.customId == 'shopClose') {
                if (!interaction.member.roles.cache.has(id.modRole)) {
                    return; //message.reply("You can only use that command if you are a mod!");
                }
                shopEmbed.data.description = "This shop has closed!";
                //interaction.deferUpdate();
                shopMsg.edit({ embeds: [shopEmbed], components: [] });
                return;
            }
        } catch (error) {
            console.log("Error interacting with shop: " + e.message);
        }
    }

}