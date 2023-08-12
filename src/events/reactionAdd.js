const { Events } = require("discord.js");
const profileModel = require("../models/profileSchema");
const submitSchema = require('../models/FDModel');
const id = require('../id.js');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        if (user.bot) return;

        
        if (reaction.message.channel.id != id.eventRepostChannel) return;
        
        if (reaction.partial) {
            try {
            await reaction.fetch();
            } catch (error) {
            console.log('Something went wrong fetching reactions', error);
            return;
            }
        }

        const messageId = reaction.message.id;
        let currUserSub;

        try {
            currUserSub = await submitSchema.findOne(
                { galleryId : messageId }
            )
        } catch(e) {
            console.log("Error getting submission reaction was added to: " + e.message)
            const currDate = new Date();
            console.log("current time: " + currDate.toString());
        }

        //message is not a submission
        if (!currUserSub) return;

        //user has reacted before 
        if (currUserSub.reactions.includes(user.id)) return;

        if ((currUserSub.reactions.length + 1) % 5 == 0) {
            try {
                await profileModel.findOneAndUpdate(
                    { userId: currUserSub.userId },
                    { $inc: { petals: 1} }
                )

                await submitSchema.findOneAndUpdate(
                    { galleryId: messageId },
                    { $push: { reactions: user.id }}
                )
            } catch(e) {
                console.log("Error giving rewards/saving reaction to database: " + e.message);
                const currDate = new Date();
                console.log("current time: " + currDate.toString());
            }
        }
    }
}