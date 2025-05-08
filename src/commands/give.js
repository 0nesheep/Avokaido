const { EmbedBuilder } = require('discord.js');
const emotes = require('../emotes.js');
const profileModel = require('../models/profileSchema.js');
const id = require('../id.js');

module.exports = {
  name: 'give',
  description: 'gives petals to target',
  async execute(message, messageArray, target, image, hehe) {
    let targetData;
    let currUserData;
    let transferAmount;

    try {
      targetData = await profileModel.findOne({ userId: target.id });
      currUserData = await profileModel.findOne({ userId: message.author.id });
    } catch (e) {
      console.log('Error fetching data for give: ' + e.message);
    }

    if (!targetData || targetData.nickname == null) {
      return message.reply(
        'The recipient has not registered yet! Please check again later'
      );
    }

    if (
      message.mentions.users.first() == undefined ||
      message.mentions.users.first().id == message.author.id
    ) {
      return message.reply("You can't transfer yourself!");

      //check if number of args is correct (1 mention and 1 amount)
    } else if (messageArray[2] == undefined) {
      return message.reply('You need to enter an amount!');
      //check if amount came first
    } else if (Number.isInteger(Number(messageArray[1]))) {
      transferAmount = Number(messageArray[1]);
      //amount came second
    } else if (Number.isInteger(Number(messageArray[2]))) {
      transferAmount = Number(messageArray[2]);
    } else {
      return message.reply('Invalid amount!');
    }

    if (transferAmount <= 0) {
      return message.reply('Invalid amount!');
    }
    if (transferAmount > currUserData.petals) {
      return message.reply(`You don't have enough ${emotes.plum} :(`);
    }

    try {
      await profileModel.findOneAndUpdate(
        { userId: target.id },
        {
          $inc: {
            petals: transferAmount
          }
        }
      );

      await profileModel.findOneAndUpdate(
        { userId: message.author.id },
        {
          $inc: {
            petals: -transferAmount
          }
        }
      );

      currUserData = await profileModel.findOne({ userId: message.author.id });

      const amountLeft = currUserData.petals;

      const myEmbed = new EmbedBuilder()
        .setColor('e4ee71')
        .setTitle('**Giving petals**')
        .setThumbnail(image)
        .setDescription(
          `You transferred ${transferAmount} ${emotes.plum} to **${target}**! 
You have ${amountLeft} ${emotes.plum} left`
        )
        .setFooter({ text: hehe });

      const logsChannel = await message.client.channels.cache.get(id.plumLog);
      logsChannel.send(`${message.author} gave ${transferAmount} to ${target}
${message.author} has ${amountLeft} left`);

      message.reply({ embeds: [myEmbed] });
    } catch (e) {
      console.log('Error transferring petals: ' + e.message);
    }
  }
};
