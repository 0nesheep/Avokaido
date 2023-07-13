const { profile } = require("console");
const profileModel = require("../models/profileSchema.js");

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
    console.log();
    if (repliedTo.embeds[0].author.iconURL != identify) {
      return message.reply("Please only reply to your own message!");
    }
    const amount = repliedTo.embeds[0].fields[0].value;
    const amountArray = amount.split(" ");
    
    const thousandsArray = amountArray[0].split(",");
    
    if (thousandsArray.length > 1) {
      amountArray[0] = parseInt(amountArray[0]) * 1000 + parseInt(thousandsArray[1]);
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