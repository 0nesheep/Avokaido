const { EmbedBuilder } = require('discord.js');
const id = require("../id.js");

module.exports = {
    name: "welcome",
    description: "sends welcome message and adds role",
  
    async execute (message, image, hehe) {
      if (!message.guild) return;
      //Welcome message
      let welcomeChannel;
      let welcomeMessage;
      try {
        welcomeChannel = await message.guild.channels.cache.get(id.welcomeChannel);
        welcomeMessage = `**Welcome <@${message.author.id}>!**`;
      } catch(e) {
        console.log("Error getting welcome channel: " + e.message)
      }

      if (welcomeMessage) {
        const myEmbed = new EmbedBuilder()
              .setColor('e4ee71')
              .setTitle(welcomeMessage)
              .setThumbnail(image)
              .setDescription('A new ~~sacrifice~~ member! Please welcome them :D')
              .setFooter({ text: hehe });
                  
              await welcomeChannel.send({ embeds: [myEmbed], content:`<@${member.id}>`});
      }

    //assign roles
    try {
        let verified = await message.guild.roles.cache.find(role => role.name === `${id.verifiedRole}`);
        let unverified = await message.guild.roles.cache.find(role => role.id === `${id.notverified}`);
        await message.member.roles.add(verified);
        await message.member.roles.remove(unverified);
        await message.delete();
    } catch(e) {
        const date = new Date();
        console.log(`Error assigning verified role to ${message.author} at ${date.toString()}: ` + e.message);
    }
      
  

    }
    
}
