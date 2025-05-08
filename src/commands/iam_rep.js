//Replies to word I am or I'm
module.exports = {
  name: 'iam_rep',
  description: 'wohoo',
  execute(message, msg, author) {
    const num = Math.floor(Math.random() * 100);
    if (num <= 10 && !message.content.includes('<@')) {
      //change to 5

      const messageArray = message.content.split(' ');
      var rep = afterIm(messageArray);

      if (afterIm(messageArray) != 'no') {
        rep = afterIm(messageArray).join(' ');
      } else {
        return;
      }

      if (rep.includes('avokaido')) {
        //avokaido block
        if (author == 596346169962135563) {
          message.channel.send('I.. you.. whatever.. say whatever you like :(');
        } else {
          message.channel.send(
            "Y..you... No you're not! You're lying! :anger:"
          );
        }
      } else if (rep.includes('feesh') || msg.includes('seasonal')) {
        //feesh block
        if (author == 596346169962135563) {
          message.channel.send('Yes, I can confirm that');
        } else {
          message.channel.send("I don't think my sis looks like that");
        }
      } else if (rep.includes('dumb') && !rep.includes('not')) {
        message.channel.send('Hello! I am dumb too!');
      } else {
        const replies = [
          "! I'm AvoKaido",
          '! Nice to meet you!',
          '~ I am AvoKaido',
          '! How are you today?'
        ];
        const random = Math.floor(Math.random() * replies.length);
        message.channel.send('Hi ' + rep + replies[random]);
      }

      function afterIm(array) {
        if (
          array[0] == "i'm" ||
          array[0] == 'am' ||
          array[0] == 'im' ||
          array[0] == "I'm" ||
          array[0] == 'Im'
        ) {
          return array.slice(1);
        } else {
          if (array.length == 0) {
            return 'no';
          }
          return afterIm(array.slice(1));
        }
      }
    }
  }
};
