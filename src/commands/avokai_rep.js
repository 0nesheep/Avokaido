//Replies to word "avoKaido"
module.exports = {
  name : "avokai_rep",
  description : "avokaidooo",
  execute(message) {
    const replies = ["*jumps*", "Did someone say my name?", "wohoo"];
    const random = Math.floor(Math.random() * replies.length);
    const num = Math.floor(Math.random() * 100);
    if (num <= 40) {
      message.channel.send(replies[random]);
    }
    
  }
}