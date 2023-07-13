//Replies to word "Kai"
module.exports = {
  name : "kai_rep",
  description : "kaii",
  execute(message) {
    const replies = ["Kai is animating!!", "Kai is studying-", "Kai is not watching :eye:", "Kai is def not watching Youtube all day"];
    const random = Math.floor(Math.random() * replies.length);
    const num = Math.floor(Math.random() * 100);
    if (num <= 20) {
      message.channel.send(replies[random]);
    }
    
  }
}