const { EmbedBuilder } = require('discord.js');
const id = require("../id.js");

module.exports = {
    name: "welcome",
    description: "sends welcome message and adds role",
  
    async execute (message, image, hehe) {
      if (message.guild == null) return;
      //Welcome message
      let welcomeChannel;
      let welcomeMessage;
      let member;
      try {
        member = await message.member;
        welcomeChannel = await member.guild.channels.cache.get(id.welcomeChannel);
        welcomeMessage = `**Welcome <@${member.id}>!**`;
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
        let verified = await member.guild.roles.cache.find(role => role.name === `${id.verifiedRole}`);
        let unverified = await member.guild.roles.cache.find(role => role.id === `${id.notverified}`);
        await member.roles.add(verified);
        await member.roles.remove(unverified);
        await message.delete();
    } catch(e) {
        console.log(`Error assigning verified role to ${message.author}: ` + e.message);
    }
      
  

    }
    
}
