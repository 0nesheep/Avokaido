const { profile } = require("console");
const profileModel = require("../models/profileSchema.js");
const id = require('../id.js');

module.exports = {
  name : 'transfer',
  async execute(message, identify, image) {
    if (message.reference == undefined) {
      return message.reply("Please reply to the points bot message!");
    } 
    
    const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
    
    if (repliedTo.author.id != '484395597508509697') {
      return message.reply("Please only reply to the points bot message!");
    }

    if (repliedTo.embeds[0].author.iconURL != identify) {
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

    //past achievements check
    //2
    if (message.member.roles.cache.has(id.kyumulus)) {
    
    }

    //3
    if (message.member.roles.cache.has(id.hlwn1)) {

    }

    //4
    if (message.member.roles.cache.has(id.dtiys1)) {

    }

    //5
    if (message.member.roles.cache.has(id.xmas1)) {

    }

    //6
    if (message.member.roles.cache.has(id.grpPic1)) {

    }

    //7
    if (message.member.roles.cache.has(id.lindel)) {

    }

    //8
    if (message.member.roles.cache.has(id.box)) {
      
    }
   
    await profileModel.findOneAndUpdate (
      { userId: message.author.id},
      { 
        $inc: { petals: parseInt(amountArray[0]) },
        $set: { transferred: true },
      }
    )
    
    
    message.reply("You have transferred your balance! Please check it with the bot again!");
  }

  
}