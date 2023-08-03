const profileModel = require("../models/profileSchema.js");
const id = require('../id.js');

module.exports = {
  name : 'transfer',
  async execute(message, identify, image) {
    if (message.reference == undefined) {
      return message.reply("Please reply to the points bot message!");
    } 
    
    const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
    const iconURL = repliedTo.embeds[0].author.iconURL;

    const back = iconURL.split('/avatars/');
    const targetId = back[1].split('/');
    
    if (repliedTo.author.id != '484395597508509697') {
      return message.reply("Please only reply to the points bot message!");
    }

    if (targetId[0] != identify) {
      return message.reply("Please only reply to your own message!");
    }
    const amount = repliedTo.embeds[0].fields[0].value;
    const amountArray = amount.split(" ");
    
    const thousandsArray = amountArray[0].split(",");
    
    if (thousandsArray.length > 1) {
      amountArray[0] = parseInt(amountArray[0]) * 1000 + parseInt(thousandsArray[1]);
    }
    let currUserData;
    try {
      currUserData = await profileModel.findOne(
        { userId: message.author.id }
      )
    } catch(e) {
      console.log("Error fetching user data in transfer: " + e.message);
    }

    //sprout
    if (message.member.roles.cache.has('648715951545516043')) {
      try {
        await profileModel.findOneAndUpdate(
          { userId: message.author.id },
          { 
              $inc: {
                  petals: 5, 
              }
          }
        );
      } catch(e) {
        console.log('Error giving petals for sprout: ' + e.message);
      }
    }

    //seedling
    if (message.member.roles.cache.has('648715743050858537')) {
      try {
        await profileModel.findOneAndUpdate(
          { userId: message.author.id },
          { 
              $inc: {
                  petals: 5, 
              }
          }
        );
      } catch(e) {
        console.log('Error giving petals for sprout: ' + e.message);
      }

    }

    //growth
    if (message.member.roles.cache.has('649782736239984660')) {
      try {
        await profileModel.findOneAndUpdate(
          { userId: message.author.id },
          { 
              $inc: {
                  petals: 10, 
              }
          }
        );
      } catch(e) {
        console.log('Error giving petals for sprout: ' + e.message);
      }

    }

    //past achievements check
    const tempAchArray = currUserData.ach;
    //2
    if (tempAchArray && message.member.roles.cache.has(id.kyumulus)) {
      tempAchArray[2] = true;
    }

    //3
    if (tempAchArray && message.member.roles.cache.has(id.hlwn1)) {
      tempAchArray[3] = true;
    }

    //4
    if (tempAchArray && message.member.roles.cache.has(id.dtiys1)) {
      tempAchArray[4] = true;
    }

    //5
    if (tempAchArray && message.member.roles.cache.has(id.xmas1)) {
      tempAchArray[5] = true;
    }

    //6
    if (tempAchArray && message.member.roles.cache.has(id.grpPic1)) {
      tempAchArray[6] = true;
    }

    //7
    if (tempAchArray && message.member.roles.cache.has(id.lindel)) {
      tempAchArray[7] = true;
    }

    //8
    if (tempAchArray && message.member.roles.cache.has(id.box)) {
      tempAchArray[8] = true;      
    }

    tempAchArray[11] = true;
   
    await profileModel.findOneAndUpdate (
      { userId: message.author.id},
      { 
        $inc: { petals: parseInt(amountArray[0]) },
        $set: { transferred: true,
          ach: tempAchArray },
      }
    )
    
    
    message.reply("You have transferred your balance! Use `!card` to check your balance again!");
  }

  
}