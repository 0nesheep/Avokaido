const { Events } = require("discord.js");
const profileModel = require("../models/profileSchema");
const shopModel = require('../models/permShopModel');
const decorModel = require('../models/decorShop.js');
const id = require('../id.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.message.channel.id != id.permShopChannel) return;
          
        const shopId = interaction.message.id;
        const shopMsg = await interaction.channel.messages.fetch(shopId);
            
        const user = interaction.user;
            
        var currShop = await shopModel.findOne(
            { id: shopId }
        );

        if (currShop) {
            const price = currShop.price;
            const link = currShop.link;
            var claimed = currShop.claimed;
            const claimedUsers = currShop.claimedUsers;
            const title = currShop.title;
                
            
            try {
                await interaction.deferUpdate();

                if (interaction.customId == 'shopClaim') {
                    const currUser = await profileModel.findOne(
                        { userId: user.id }
                    )
                    if (claimedUsers.includes(user.id)) {
                        return await user.send("You have already purchased from the shop! Save some for others >:(");
                    } else if (!currUser) {
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
                    
                    
                        
                    await shopMsg.edit({ content: `[Open] ${title}\n\n### ${claimed} people have claimed this! `});
                    return await user.send({content: `${title}\n\nHere is the link to the file\n${link}`, files: ['./src/images/thank_you.png']});
                    
                } else if (interaction.customId == 'shopClose') {
                    if (!interaction.member.roles.cache.has('648704466614353930') && !interaction.member.roles.cache.has("649480335498805249")) {
                        return; //message.reply("You can only use that command if you are a mod!");
                    }
                    
                    
                    await shopMsg.edit({ content: `[Closed] ${title}\n\n### ${claimed} people have claimed this! `, components: [] });
                    return;
                }
            } catch (e) {
                console.log(`Error interacting with shop for user ${user.id}: ` + e.message);
            }
        } else {
            currShop = await decorModel.findOne(
                { id: shopId }
            )
            if (currShop) {
                const price = currShop.price;
                const achievement = currShop.achievement;
                var claimed = currShop.claimed;
                const claimedUsers = currShop.claimedUsers;
                const title = currShop.title;

                try {
                    await interaction.deferUpdate();
    
                    if (interaction.customId == 'shopClaim') {
                        const currUser = await profileModel.findOne(
                            { userId: user.id }
                        )
                        if (claimedUsers.includes(user.id)) {
                            return await user.send("You have already purchased from the shop! Save some for others >:(");
                        } else if (!currUser) {
                            return await user.send("You have not registered! Please register before purchasing from the shops!");
                        }
                        const balanceAmt = currUser.petals;
                    
                        if (balanceAmt < price) {
                            return await user.send(`You do not have enough plums to purchase the item from **"${title}"** >:0`);
                        }
                        
                        await decorModel.findOneAndUpdate(
                            { id: shopId },
                            { 
                                $inc: { claimed: 1 },
                                $push: { claimedUsers: user.id }
                            }
                        )
                        
                        const currAch = currUser.ach;
                        currAch[achievement] = true;
                        await profileModel.findOneAndUpdate(
                            { userId: user.id },
                            { 
                                $inc: { petals: -price },
                                $set: {
                                    ach: currAch,
                                }
                            }
                        )
                        
                        const newShopData = await decorModel.findOne(
                            { id: shopId }
                        );
    
                        claimed = newShopData.claimed;
                        
                        
                            
                        await shopMsg.edit({ content: `[Open] ${title}\n\n### ${claimed} people have claimed this! `});
                        return await user.send({content: `You have claimed the decoration from ${title}!`, files: ['./src/images/thank_you.png']});
                        
                    } else if (interaction.customId == 'shopClose') {
                        if (!interaction.member.roles.cache.has('648704466614353930') && !interaction.member.roles.cache.has("649480335498805249")) {
                            return; //message.reply("You can only use that command if you are a mod!");
                        }
                        
                        
                        await shopMsg.edit({ content: `[Closed] ${title}\n\n### ${claimed} people have claimed this! `, components: [] });
                        return;
                    }
                } catch (e) {
                    console.log(`Error interacting with shop for user ${user.id}: ` + e.message);
                }
            }
        }
    }

}