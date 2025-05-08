const { Events } = require('discord.js');
const emotes = require('../emotes.js');
const id = require('../id.js');
const { heheGen } = require('../hehe.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    //cache all members
    //CHANGE:insert server id
    const guild = await client.guilds.fetch(id.serverId);

    const allMembers = await guild.members.fetch().then().catch(console.error);

    //show logged in
    console.log(`Ready, logged in as ${client.user.tag}`);
  }
};
