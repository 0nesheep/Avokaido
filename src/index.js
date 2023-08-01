// Require the necessary discord.js classes
const { Client, 
    Collection, 
    Events, 
    GatewayIntentBits, 
    Partials, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    MessageCollector } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');
const { len, imageArray } = require('./thumbnails.js');
const wait = require('node:timers/promises').setTimeout;
const { connect } = require('mongoose');



const emotes = require("./emotes.js");
const id = require("./id.js");
const { heheGen } = require('./hehe.js');
const { token, databaseToken } = require('./config.json');
// Create a new client instance
const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [
      Partials.Channel,
      Partials.Message,
      Partials.Reaction,
    ],
  });

//commands
client.commands = new Collection();

//command handler////////////////////////////////////////////
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else if ('execute' in command && !('data' in command)) {
    client.commands.set(command.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

//Events handler//////////////////////////////////////////////////////
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

//prefix
const prefix = '!';

/////////////////////////////////////////////////////////
//welcome message////////////////////////////////////////
client.on('guildMemberAdd', (member) => {
  //image generate
  const random = Math.floor(Math.random() * len);
  const image = imageArray[random];
  
  if (member.user.bot) return;

  try {
    client.commands.get("welcome").execute(member, image, client);
  } catch (error) {
    console.log('Error in welcome command: ', error.message);
  }
});






















// Log in to Discord with your client's token

client.login(token);
(async () => {
    try {
      await connect(databaseToken);
      console.log("Connected to DB");
    } catch (error) {
      console.log(error.message);
    }
})();