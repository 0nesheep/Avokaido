const emotes = require("../emotes.js");
const profileModel = require("../models/profileSchema.js");
const id = require("../id.js")

module.exports = {
    name: 'addach',
    async execute(message, messageArray, target, hehe, image) {
        target = target.id
        var currUserData;
        try {
            currUserData = await profileModel.findOne(
                { userId: target }
            )
            var currAch = currUserData.ach;
            for (var i = 0; i < messageArray.length; i++) {
                if (messageArray[i] == target || isNaN(parseInt(messageArray[i]))) {
                    continue;
                } else {
                    currAch[parseInt(messageArray[i])] = true;
                }
            }

            await profileModel.findOneAndUpdate(
                { userId: target },
                { $set: { ach: currAch }}
            );
            message.reply('successfully set achievements for ' + `<@${target}>`)
        } catch(e) {
            console.log("Error adding updated achievements to database: " + e.message);
        }


    }
}