//Replies to word "patpat"
module.exports = {
  name: 'pat_rep',
  description: ':3',
  execute(message) {
    const replies = [
      '(≧∀≦)',
      '(੭ˊᵕˋ)੭:two_hearts:',
      '₍๑•⌔•๑ ₎!!',
      '*pats back*',
      '*lies down*',
      '*licks hand*',
      'wwwww'
    ];
    const random = Math.floor(Math.random() * replies.length);
    const num = Math.floor(Math.random() * 100);
    if (num <= 40) {
      message.channel.send(replies[random]);
    }
  }
};
