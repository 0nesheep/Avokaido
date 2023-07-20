const { EmbedBuilder } = require('discord.js');
const id = require("../id.js");

module.exports = {
  name: 'levelPing',
  async execute(message, currLevel, image, hehe) {

    const reply = new EmbedBuilder()
            .setColor('e4ee71')
            .setTitle('You levelled up!')
            .setThumbnail(image)
            .setDescription(`Congrats <@${message.author.id}>! You levelled up to level ${currLevel}!`)
            .setFooter({text: hehe});
    
    const levelChannel = await message.client.channels.cache.get(id.levelPing);
    levelChannel.send({ content: `<@${message.author.id}>`, embeds: [reply] });
  
  }

  
}