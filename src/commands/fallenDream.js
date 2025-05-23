const submitSchema = require('../models/FDModel');
const profileSchema = require('../models/profileSchema');
const id = require('../id.js');
const emotes = require('../emotes.js');

module.exports = {
  name: 'fallendream',
  async execute(message) {
    if (message.channel.id != id.eventSubChannel || message.author.bot) return;

    let currUserData;

    try {
      currUserData = await profileSchema.findOne({ userId: message.author.id });
    } catch (e) {
      const currDate = new Date();
      console.log(
        `Error getting user data in fd submission at ${currDate.toString()}: ` +
          e.message
      );
    }

    //only execute event rewards if user has not gotten rewards
    if (currUserData && !currUserData.ach[21]) {
      try {
        const tempAch = currUserData.ach;
        tempAch[21] = true;
        if (currUserData.memories < 5) {
          await profileSchema.findOneAndUpdate(
            { userId: message.author.id },
            {
              $set: { ach: tempAch },
              $inc: { memories: 1 }
            }
          );
        } else {
          await profileSchema.findOneAndUpdate(
            { userId: message.author.id },
            {
              $set: { ach: tempAch },
              $inc: { petals: 0 }
            }
          );
        }
      } catch (e) {
        console.log(
          `Error adding petals to FD event to ${message.author.id}: ` +
            e.message
        );
        const currDate = new Date();
        console.log('current time: ' + currDate.toString());
      }
    }

    const gallery = await message.client.channels.cache.get(
      id.eventRepostChannel
    );
    if (!message.attachments.first()) return;

    let galMsg;
    try {
      galMsg = await gallery.send({
        files: [message.attachments.first()],
        content: `By <@${message.author.id}>`
      });
      await galMsg.react(emotes.eventReact);
    } catch (e) {
      console.log('Error reposting entry: ' + e.message);
    }

    try {
      await submitSchema.create({
        userId: message.author.id,
        galleryId: galMsg.id,
        reactions: []
      });
    } catch (e) {
      console.log(
        `Error creating fd submission for <@${message.author.id}> : ` +
          e.message
      );
      console.log('current time: ' + new Date().toString());
    }
  }
};
