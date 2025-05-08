module.exports = {
  name: 'interaction_rep',
  execute(message) {
    if (message.content.length >= 100 || message.content.includes('<@')) {
      return;
    }
    const actionArray = message.content.split('*');
    const contArray = actionArray[1].split(' ');

    const bad = ['kill', 'murder', 'stab', 'kills', 'murders', 'stabs'];
    if (contArray.length !== 1) {
      if (bad.includes(contArray[0].toLowerCase())) {
        const subject = contArray[1];

        const reply = [
          'AvoKaido is recording the crime',
          'AvoKaido revives ' + subject,
          'AvoKaido stabs ' + subject + ' a couple more times',
          'AvoKaido no kill. AvoKaido love peace'
        ];
        const rand = Math.floor(Math.random() * reply.length);

        message.channel.send(reply[rand]);
      } else if (
        contArray[1].toLowerCase() == 'kai' ||
        contArray[1].toLowerCase() == 'avokaido'
      ) {
        message.channel.send(
          '### ' +
            contArray[0].split('').join(' ').toUpperCase() +
            '   M Y   O W N   S E L F'
        );
      } else {
        const reply = [
          'Avokaido also ' + contArray[0] + ' ' + contArray[1],
          '*Heavily ' + contArray[0] + ' ' + contArray[1] + '*',
          '*' + contArray[0] + ' ' + contArray[1] + ' multiple times*'
        ];
        const rand = Math.floor(Math.random() * reply.length);

        message.channel.send(reply[rand]);
      }
    }
  }
};
