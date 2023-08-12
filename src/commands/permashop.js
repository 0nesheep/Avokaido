const shopModel = require("../models/permShopModel.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, MessageCollector } = require('discord.js');
const emotes = require("../emotes.js");
const id = require("../id.js");

module.exports = {
    name: 'permashop',
    async execute(message, price, link, image, hehe) {
        if (price == undefined || link == undefined) {
            return message.reply("Please enter the price and link!");
          }
          if (isNaN(price)) {
            return message.reply('The first field should be the price!');
          }
      
          if (price < 0) {
            return message.reply("Please enter a valid amount!");
          }

          let filter = m => m.author.id === message.author.id && !m.author.bot;


        const titleAsk = await message.reply("Please reply with the title of the shop");

        const titleCollector = new MessageCollector(titleAsk.channel, {
            filter,
            max: 1,
            time: 30000,
        });

        titleCollector.on('collect', async (m) => {
            const titleMsg = m;
            const title = titleMsg.content;
      
            const confirmMessage = new EmbedBuilder()
              .setColor('e4ee71')
              .setTitle('**Confirm shop**')
              .setThumbnail(image)
              .setDescription(`Are you sure you want to make a permanent shop with:
            Price: ${price} ${emotes.petal} and title ${title}`)
              .setFooter({ text: hehe })
      
            const confirmButtons = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('confirm')
                  .setLabel('Confirm')
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setCustomId('cancel')
                  .setLabel('Cancel')
                  .setStyle(ButtonStyle.Secondary)
              );
      
            const claimButton = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('shopClaim')
                  .setLabel('Claim')
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setCustomId('shopClose')
                  .setLabel('Close')
                  .setStyle(ButtonStyle.Danger)
              );
      
      
      
            const msg = await titleMsg.reply({ components: [confirmButtons], embeds: [confirmMessage] });
      
            
            const confirmCollector = msg.createMessageComponentCollector({
              max: 1,
            });
      
      
      
            let claimed = 0;
      
            const shopEmbed = new EmbedBuilder()
              .setColor('e4ee71')
              .setTitle(title)
              .setThumbnail(image)
              .setDescription(`Claim a slot here! The petals will be automatically deducted
      **Price:** ${price} ${emotes.petal}`)
              .addFields(
                { name: 'Amount sold', value: `${claimed}` },
              )
              .setFooter({ text: hehe });
      
      
            
            confirmCollector.on('collect', async interaction => {
              if (!interaction.isButton()) return;
              if (interaction.customId == 'confirm') {
                if (interaction.user.id != message.author.id) return;
                
                //send to channel
                const sentMsg = await message.client.channels.cache.get(id.permShopChannel).send({ components: [claimButton], embeds: [shopEmbed] });
      
      
                try {
                    //add shop to database
                    await shopModel.create({
                        id: sentMsg.id,
                        link: link,
                        price: price,
                        claimed: 0,
                    })
                } catch(e) {
                    console.log("Error adding shop to database: " + e.message);
                }
      
        
                
                interaction.deferUpdate();
                msg.edit({ content: 'You have successfully created the shop!', embeds: [], components: []});
            } else if (interaction.customId == 'cancel') {
                if (interaction.user.id != message.author.id) return;
      
                sentMsg = 0;
                interaction.deferUpdate();
                msg.edit({ content: 'Slowly backs away...hehe', embeds: [], components: [] });
              }
            });
            
      
          });


    }
}