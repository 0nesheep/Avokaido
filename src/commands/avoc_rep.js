//replies to avocado
module.exports = {
  name: 'avoc_rep',
  description: 'avocadoo',
  execute(message) {
    const replies = [
      'Gimme! Avocado!',
      'Did someone say.. aVOcAdO?!',
      'Avocado!!',
      'Avocado.. I NEED',
      '*Grabs avocado and runs away*',
      'wwww Can..can I have that avocado?',
      '*Stares at the avocado*'
    ];
    const random = Math.floor(Math.random() * replies.length);
    const num = Math.floor(Math.random() * 100);
    if (num <= 20) {
      message.channel.send(replies[random]);
    }
  }
};
