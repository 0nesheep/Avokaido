const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  Events
} = require('discord.js');
const profileModel = require('../models/profileSchema.js');
const achModel = require('../models/achModel.js');
const specialModel = require('../models/specModel.js');
const { generateCard } = require('../generateCard.js');

module.exports = {
  name: 'patreonButtonClick',
  async execute(
    message,
    interaction,
    msg,
    achArray,
    attach,
    backButton,
    image,
    hehe
  ) {
    interaction.deferUpdate();

    const patreonEmbed = new EmbedBuilder()
      .setColor('e4ee71')
      .setTitle('**Edit Card (Patreon)**')
      .setThumbnail(image)
      .setDescription(
        `What would you like to change your decor to?
Do check out the Encyclopedia if you need a reference!`
      )
      .setFooter({ text: hehe });
    const buttonArray = [];
    let currButtons = new ActionRowBuilder();
    let total = 0;
    let count = 0;

    let patreonDecorData;
    try {
      const patreonData = await specialModel.findOne({ index: 20 });
      patreonDecorData = patreonData.decor;
      await profileModel.findOneAndUpdate(
        { userId: interaction.user.id },
        { $set: { 'card.special': 20 } }
      );
    } catch (e) {
      console.log('Error getting patreon details: ' + e.message);
    }

    for (let i = 0; i < patreonDecorData.length; i++) {
      if (count > 4) {
        buttonArray.push(currButtons);
        currButtons = new ActionRowBuilder();
        count = 0;
      }
      const decor = patreonDecorData[i];
      if (decor.img != undefined) {
        currButtons.addComponents(
          new ButtonBuilder()
            .setCustomId(`pat:${i}`)
            .setLabel(`${decor.name}`)
            .setStyle(ButtonStyle.Primary)
        );
        total++;
        count++;
      }
    }

    if (count > 0) {
      buttonArray.push(currButtons);
    }
    const returnToNonSpec = new ActionRowBuilder();
    returnToNonSpec.addComponents(
      new ButtonBuilder()
        .setCustomId('reset')
        .setLabel('return to regular card')
        .setStyle(ButtonStyle.Danger)
    );
    buttonArray.push(returnToNonSpec);

    let updatedUserData;
    try {
      updatedUserData = await profileModel.findOne({
        userId: interaction.user.id
      });
    } catch (e) {
      console.log('Error refreshing card in patreon update: ' + e.message);
    }
    const newCanvas = await generateCard(updatedUserData, message);
    attach = new AttachmentBuilder(await newCanvas.encode('png'), {
      name: 'card.png'
    });
    if (total != 0) {
      msg.edit({
        embeds: [patreonEmbed],
        components: buttonArray,
        files: [attach]
      });
    } else {
      foreground.setDescription('You do not have any available foregrounds!');
      msg.edit({
        embeds: [patreonEmbed],
        components: [returnToNonSpec],
        files: [attach]
      });
    }
  }
};
