const { EmbedBuilder } = require('discord.js');
const emotes = require("../emotes.js");

module.exports = {
    name: 'help',
    description: 'displays all commands available',
    execute(message, image, hehe) {
        const myEmbed = new EmbedBuilder()
            .setColor('e4ee71')
            .setTitle('**Commands Guide**')
            .setDescription('Check out the commands you can use here!')
            .setThumbnail(image)
            .setFooter({ text: hehe })
            .addFields(
                { name: '!give ', value: 'Transfer ' + emotes.plum + ' using ``!give <amount> @<username>`` or ``!give @<username> <amount>``'},
                { name: '!bal', value: 'Check your balance and level'},
                { name: '!daily', value: 'Pick up some petals!'},
                { name: '!setname', value: 'add or edit your nickname!'},
                { name: '!transfer', value: 'Transfer your balance from the points bot to avokaido. You can only do this once!'},
                
            )

            message.channel.send({ embeds: [myEmbed]});
    }
};

