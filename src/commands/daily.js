const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');
const profileModel = require('../models/profileSchema.js');
const { EmbedBuilder } = require('discord.js');
const emotes = require('../emotes.js');

module.exports = {
  name: 'daily',
  async execute(message, dailyCooldown, image, hehe) {
    const random = Math.floor(Math.random() * 100);
    let amt = 0;
    if (random < 70) {
      amt = 1;
    } else if (random < 90 && random >= 70) {
      amt = 2;
    } else {
      amt = 3;
    }

    const userCooldowned = await dailyCooldown.getUser(message.author.id);

    if (userCooldowned) {
      const timeLeft = msToMinutes(userCooldowned.msLeft, false);
      message.reply(
        `You've already picked petals today! Please come back in ${timeLeft.hours} hours and ${timeLeft.minutes + 1} minutes!`
      );
    } else {
      try {
        await profileModel.findOneAndUpdate(
          { userId: message.author.id },
          {
            $inc: {
              petals: amt
            }
          }
        );
        await dailyCooldown.addUser(message.author.id);
      } catch (e) {
        console.log('Error adding amount to user for daily: ' + e.message);
      }

      const myEmbed = new EmbedBuilder()
        .setColor('e4ee71')
        .setTitle('**Your daily petals!**')
        .setThumbnail(image)
        .setDescription(`You picked up ${amt} ${emotes.plum}!`)
        .setFooter({ text: `${hehe} you can come back in 24h!` });

      message.channel.send({ embeds: [myEmbed] });
    }
  }
};
