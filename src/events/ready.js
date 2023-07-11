const { Events } = require('discord.js');
const emotes = require("../emotes.js");
const id = require("../id.js");
const { heheGen } = require('../hehe.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
         //cache all members
        //CHANGE:insert server id
        const guild = await client.guilds.fetch(id.serverId); 
    
        const allMembers = await guild.members.fetch()
        .then()
        .catch(console.error);
    
        /*try {
        //sync currency
        const storedBalances = await Users.findAll();
        storedBalances.forEach(b => currency.set(b.user_id, b));
    
        const storedReactions = await ReactionRoles.findAll();
        storedReactions.forEach(b => permanent.set(b.message_id, b));
    
        const storedShops = await PermanentShops.findAll();
        storedShops.forEach(b => permanent.set(b.message_id, b));
    
        const storedAchievements = await Achievements.findAll();
        storedAchievements.forEach(b => achievements.set(b.user_id, b));
    
        const storedCharacters = await Characters.findAll();
        storedCharacters.forEach(b => characters.set(b.user_id, b));
    
        const storedTempShops = await Shops.findAll();
        storedTempShops.forEach(b => shops.set(b.user_id, b));
        
        } catch (error) {
        console.log("Error in syncing database", error);
        }
    
        async function sync(u) {
        if (u.user.bot) return;
        const user = currency.get(u.user.id);
        if (user) {
            return;
        } else {
            const newUser = await Users.create({ user_id: u.user.id });
            currency.set(u.user.id, newUser);
        }
        }
        
        try {
        allMembers.forEach(u => sync(u));
        } catch (error) {
        console.log("Error in creating User profiles for all members", error);
        }*/
    
        
        //show logged in 
        console.log(`Ready, logged in as ${client.user.tag}`);

    },
};