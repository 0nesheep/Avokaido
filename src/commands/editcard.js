const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, Events } = require('discord.js');
const profileModel = require("../models/profileSchema.js");
const achModel = require('../models/achModel.js');
const { generateCard } = require('../generateCard.js');
const { checkPing } = require('../checkPing.js');
const id = require('../id.js');

module.exports = {
    name: 'editcard',
    description: 'allows user to edit card',
    async execute(message, image, hehe) {
        //foreground - all the foregrounds
        //style - [decor], [special]
        //future: other (fonts, bar color, whatever)
        //badges

        let currUserData;
       
        try {
            currUserData = await profileModel.findOne(
                { userId: message.author.id }
            )
        } catch(e) {
            console.log("Error getting currUserData in editcard: " + e.message);
        }

        if (currUserData.level == 1) {
            return message.reply("Please level up to level 2 first!");
        }
        var cardData = currUserData.card;

        let menuEmbed = new EmbedBuilder()
                    .setColor('e4ee71')
                    .setTitle('**Edit Card**')
                    .setThumbnail(image)
                    .setDescription('Which part of the card do you want to edit?')
                    .setFooter({text: hehe});

            const menuButtons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('foreground')
                        .setLabel('foreground')
                        .setStyle(ButtonStyle.Primary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('style')
                        .setLabel('style')
                        .setStyle(ButtonStyle.Primary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('badges')
                        .setLabel('badges')
                        .setStyle(ButtonStyle.Primary)
                )

            const buttonArray = [menuButtons];

            // Check for special cards
            let specialButtons = new ActionRowBuilder();
            if (message.member.roles.cache.has(id.patreonRole)) {
                specialButtons.addComponents(
                    new ButtonBuilder()
                        .setCustomId('patreon')
                        .setLabel('patreon')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(id.patreonEmote)
                )
            }

            if (specialButtons.components.length != 0) {
                buttonArray.push(specialButtons);
            }

            
        const canvas = await generateCard(currUserData, message);
        let attach = new AttachmentBuilder(await canvas.encode('png'), { name: 'card.png' });

        let msg;

        // Check and send correct response
        if (cardData.special != 0) {
            msg = await message.client.commands.get('editSpecial').execute(message, currUserData, image, hehe);
        } else {
            msg = await message.reply({ embeds: [menuEmbed], components: buttonArray, files: [attach] });
        }
        //responses
        const collector = msg.createMessageComponentCollector({ time: 600000 });

        const backButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('back')
                    .setLabel('back to menu')
                    .setStyle(ButtonStyle.Secondary)
            );

        collector.on('collect', async (interaction) => {
            await checkPing(message);

            const achArray = currUserData.ach;

            try {
                currUserData = await profileModel.findOne(
                    { userId: message.author.id }
                )
            } catch(e) {
                console.log("Error getting currUserData in editcard: " + e.message);
            }

                //if not button 
                if (!interaction.isButton()) return;
                if (interaction.user.id != message.author.id) return;

                // General back button used by all menus
                if (interaction.customId == 'back' || interaction.customId == 'reset') {
                    interaction.deferUpdate();
                    try {
                        await profileModel.findOneAndUpdate(
                            { userId: message.author.id },
                            { $set: {'card.special' : 0, 'card.specDec' : 0} },
                        )

                        currUserData = await profileModel.findOne(
                            { userId: message.author.id }
                        )
                        const newCanvas = await generateCard(currUserData, message);
                        attach = new AttachmentBuilder(await newCanvas.encode('png'), { name: 'card.png' });
                        msg.edit({ embeds: [menuEmbed], components: buttonArray, files: [attach] });
                    } catch(e) {
                        console.log("Error refreshing card image when back button pressed: " + e.message);
                    }    
                } else if (interaction.customId == 'foreground') {
                    try {
                        message.client.commands.get('fgButtonClick').execute(interaction, msg, currUserData.ach, attach, backButton, image, hehe);
                    } catch(e) {
                        console.log('Error clicking fg: ' + e.message);
                    }
                } else if (interaction.customId == 'style') {
                    try {
                        message.client.commands.get('bgButtonClick').execute(interaction, msg, currUserData.ach, attach, backButton, image, hehe);
                    } catch(e) {
                        console.log("Error clicking bg: " + e.message);
                    }
                } else if (interaction.customId == 'badges') {
                    try {
                        message.client.commands.get('badgeButton').execute(interaction, message, msg, currUserData.ach, attach, backButton, image, hehe);
                    } catch(e) {
                        console.log("Error clicking badge: " + e.message);
                    }
                }
                if (interaction.customId.startsWith("fg:")) {
                    for (let i = 0; i < achArray.length; i++) {
                        if (interaction.customId == `fg:${i}`) {
                            interaction.deferUpdate();
                            try {
                                await profileModel.findOneAndUpdate(
                                    { userId: message.author.id },
                                    { $set: {'card.fg': i}},
                                )
                                currUserData = await profileModel.findOne(
                                    { userId: message.author.id }
                                )
                                
                                
                            } catch(e) {
                                console.log("Error editing card fg: " + e.message);
                            }
                            const newcanvas = await generateCard(currUserData, message);
                            const newattach = await new AttachmentBuilder(await newcanvas.encode('png'), { name: 'card.png' });
                            msg.edit({files: [newattach], embeds:[], components: [backButton]});
                        }
                    }
                } else if (interaction.customId.startsWith("bg:")) {

                    for (let i = 0; i < achArray.length; i++) {
                        if (interaction.customId == `bg:${i}`) {
                            interaction.deferUpdate();
                            try {
                                await profileModel.findOneAndUpdate(
                                    { userId: message.author.id },
                                    { $set: {'card.decor': i}},
                                )
                                currUserData = await profileModel.findOne(
                                    { userId: message.author.id }
                                )
                            } catch(e) {
                                console.log("Error editing currUserData in editcard: " + e.message);
                            }
                            const newcanvas = await generateCard(currUserData, message);
                            const newattach = await new AttachmentBuilder(await newcanvas.encode('png'), { name: 'card.png' });
                            msg.edit({files: [newattach], embeds:[], components: [backButton]});
                        }
                    }
                } else if (interaction.customId == "bgCancel") {
                    interaction.deferUpdate();
                    try {
                        await profileModel.findOneAndUpdate(
                            { userId: message.author.id },
                            { $set: {'card.decor': 0} },
                        )
                        currUserData = await profileModel.findOne(
                            { userId: message.author.id }
                        )
                    } catch(e) {
                        console.log("Error removing style in editcard: " + e.message);
                    }
                    const newcanvas = await generateCard(currUserData, message);
                    const newattach = await new AttachmentBuilder(await newcanvas.encode('png'), { name: 'card.png' });
                    msg.edit({files: [newattach], embeds:[], components: [backButton]});
                } else if (interaction.customId == "fgCancel") {
                    interaction.deferUpdate();
                    try {
                        await profileModel.findOneAndUpdate(
                            { userId: message.author.id },
                            { $set: {'card.fg': 0} },
                        )
                        currUserData = await profileModel.findOne(
                            { userId: message.author.id }
                        )
                    } catch(e) {
                        console.log("Error removing style in editcard: " + e.message);
                    }
                    const newcanvas = await generateCard(currUserData, message);
                    const newattach = await new AttachmentBuilder(await newcanvas.encode('png'), { name: 'card.png' });
                    msg.edit({files: [newattach], embeds:[], components: [backButton]});
                } else if (interaction.customId == 'badgeCancel') {
                    interaction.deferUpdate();
                    try {
                        await profileModel.findOneAndUpdate(
                            { userId: interaction.user.id },
                            { $set: {'card.activeAch': []} },
                        )
                        currUserData = await profileModel.findOne(
                            { userId: message.author.id }
                        )

                    } catch(e) {
                        console.log("Error clearing badges: " + e.message);
                    }
                    const newcanvas = await generateCard(currUserData, message);
                    const newattach = await new AttachmentBuilder(await newcanvas.encode('png'), { name: 'card.png' });
                    msg.edit({files: [newattach], embeds:[], components: [backButton]});
                } else if (interaction.customId == 'patreon') {
                    try {
                        message.client.commands.get('patreonButtonClick').execute(message, interaction, msg, currUserData.ach, attach, backButton, image, hehe);
                    } catch(e) {
                        console.log('Error clicking patreon button: ' + e.message);
                    }
                } else if (interaction.customId.startsWith('pat:')) {
                    const indexString = interaction.customId.split('pat:')[1];
                    const index = parseInt(indexString);
                    try {
                        await profileModel.findOneAndUpdate(
                            { userId: message.author.id },
                            { $set: {'card.specDec': index} },
                            { $set: {'card.special': 20}}
                        )
                        currUserData = await profileModel.findOne(
                            { userId: message.author.id }
                        )
                    } catch (e) {
                        console.log("Error editing special card decor number: " + e.message);
                    }

                    const patBackButton = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('patreon')
                                .setLabel('back to menu')
                                .setStyle(ButtonStyle.Secondary)
                        );
                    const newcanvas = await generateCard(currUserData, message);
                    const newattach = await new AttachmentBuilder(await newcanvas.encode('png'), { name: 'card.png' });
                    msg.edit({files: [newattach], embeds:[], components: [patBackButton]});
                }
                  
                
            });
        }
    
}
