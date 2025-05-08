const profileSchema = require('./models/profileSchema.js');
const id = require('./id.js');

async function checkPing(message) {
  let currUserData;
  try {
    currUserData = await profileSchema.findOne({ userId: message.author.id });
  } catch (e) {
    console.log('Error getting user data in role check: ' + e.message);
  }

  //1
  if (message.member.roles.cache.has(id.boosterRole)) {
    if (!currUserData.ach[1]) {
      try {
        const updateArray = currUserData.ach;
        updateArray[1] = true;
        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $set: { ach: updateArray } }
        );
      } catch (e) {
        console.log('Error setting booster achievement: ' + e.message);
      }
    }
  } else {
    if (currUserData.ach[1]) {
      try {
        const updateArray = currUserData.ach;
        updateArray[1] = false;
        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $set: { ach: updateArray } }
        );
      } catch (e) {
        console.log('Error removing booster achievement: ' + e.message);
      }
    }
  }
  //10
  if (message.member.roles.cache.has(id.starRole)) {
    if (!currUserData.ach[10]) {
      try {
        const updateArray = currUserData.ach;
        updateArray[10] = true;
        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $set: { ach: updateArray } }
        );
      } catch (e) {
        console.log('Error setting star achievement: ' + e.message);
      }
    }
  }
  //16
  if (
    message.member.roles.cache.has(id.kArtPing) &&
    message.member.roles.cache.has(id.fArtPing)
  ) {
    if (!currUserData.ach[16]) {
      try {
        const updateArray = currUserData.ach;
        updateArray[16] = true;
        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $set: { ach: updateArray } }
        );
      } catch (e) {
        console.log('Error setting art ping achievement: ' + e.message);
      }
    }
  } else {
    if (currUserData.ach[16]) {
      try {
        const updateArray = currUserData.ach;
        updateArray[16] = false;
        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $set: { ach: updateArray } }
        );
      } catch (e) {
        console.log('Error removing art ping achievement: ' + e.message);
      }
    }
  }
}

module.exports = { checkPing };
