const { EmbedBuilder } = require('discord.js');
const id = require("../id.js");

module.exports = {
  name: 'levelPing',
  async execute(message, currLevel, image, hehe) {

    let text = `<@${message.author.id}>`;
    if (currLevel == 3) {
      text = text + ' You also got the sprout achievement and 5 petals!';
    } else if (currLevel == 10) {
      text = text + ' You also got the seedling achievement and 10 petals!';
    } else if (currLevel == 20) {
      text = text + ' You also got the growth achievement and 10 petals!';
    } else if (currLevel == 30) {
      text = text + ' You also got the flower achievement and 20 petals!';
    }

    const reply = new EmbedBuilder()
            .setColor('e4ee71')
            .setTitle('You levelled up!')
            .setThumbnail(image)
            .setDescription(`Congrats <@${message.author.id}>! You levelled up to level ${currLevel}!`)
            .setFooter({text: hehe});
    
    const levelChannel = await message.client.channels.cache.get(id.levelPing);
    levelChannel.send({ content: text, embeds: [reply] });
  
  }

  
}