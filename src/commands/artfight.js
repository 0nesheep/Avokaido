const submitSchema = require('../models/FDModel');
const profileSchema = require('../models/profileSchema');
const id = require('../id.js');
const emotes = require('../emotes.js');

module.exports = {
  name: 'artfight',
  async execute(message, target) {
    if (message.channel.id != id.eventSubChannel || message.author.bot) return;

    if (!target) {
      return message.reply('You need to specify the recepient!');
    }
    if (target.id == message.author.id) {
      return message.reply('You cannot attack yourself!');
    }
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
    var hasSubmitted = await submitSchema.findOne({
      userId: message.author.id
    });
    var hasAttacked = await submitSchema.findOne({ attackedId: target.id });
    if (currUserData) {
      if (!hasSubmitted) {
        try {
          if (currUserData.memories < 5) {
            await profileSchema.findOneAndUpdate(
              { userId: message.author.id },
              {
                $inc: { memories: 1 },
                $inc: { petals: 10 }
              }
            );
          } else {
            await profileSchema.findOneAndUpdate(
              { userId: message.author.id },
              {
                $inc: { petals: 10 }
              }
            );
          }
        } catch (e) {
          console.log(
            `Error adding petals to artfight event to ${message.author.id}: ` +
              e.message
          );
          const currDate = new Date();
          console.log('current time: ' + currDate.toString());
        }
      }

      if (!hasAttacked) {
        try {
          await profileSchema.findOneAndUpdate(
            { userId: message.author.id },
            {
              $inc: { petals: 10 }
            }
          );
        } catch (e) {
          console.log(
            `Error adding petals to artfight event to ${message.author.id}: ` +
              e.message
          );
          const currDate = new Date();
          console.log('current time: ' + currDate.toString());
        }
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
        content: `By <@${message.author.id}> to <@${target.id}>`
      });
      await galMsg.react(emotes.eventReact);
    } catch (e) {
      console.log('Error reposting entry: ' + e.message);
    }

    try {
      await submitSchema.create({
        userId: message.author.id,
        galleryId: galMsg.id,
        reactions: [],
        attackedId: target.id
      });
    } catch (e) {
      console.log(
        `Error creating af submission for <@${message.author.id}> : ` +
          e.message
      );
      console.log('current time: ' + new Date().toString());
    }
  }
};
