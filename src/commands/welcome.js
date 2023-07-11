const { EmbedBuilder } = require('discord.js');
const id = require("../id.js")

module.exports = {
    name: "welcome",
    description: "sends welcome message and adds role",
  
    execute (member, image, client) {
      //Welcome message
        const welcomeChannel = member.guild.channels.cache.get(id.welcomeChannel);
        const welcomeMessage = `**Welcome <@${member.id}>!**`;

      
      const myEmbed = new EmbedBuilder()
            .setColor('e4ee71')
            .setTitle(welcomeMessage)
            .setThumbnail(image)
            .setDescription('A new ~~sacrifice~~ member! Please welcome them :D')
            .setFooter({ text: "hehe please check your dm for verification!" });
                

            welcomeChannel.send({ embeds: [myEmbed] });

    //assign roles
    let notVerified = member.guild.roles.cache.find(role => role.name === 'hmmm');
    member.roles.add(notVerified);

      const veri = `Hello! Welcome, testers!

Thank you for volunteering 🥑 here are some instructions on what we need you to do

1. Send Woohoo to this bot to verify yourself
2. Check that you can see the rest of the server now
3. Send '!help' in general testing channel to see what functions the bot currently has
4. Play with the commands and look for possible bugs (but don't spam!)
5. Report any bugs the the specified channel
6. Give suggestions for new functions if you have any
7. If the bot goes offline/unresponsive, ping the devs and describe/screenshot what happened
8.  We will update everyone on new commands to test when they're ready

If you encounter any difficulties feel free to dm Kai-凯#4105 or Blepblepbelp#6057` ;

      client.users.send(member.id, veri);
      
  

    }
    
}
