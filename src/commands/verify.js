const id = require("../id.js")

module.exports = {
    name: 'verify',
    description: 'verifies user',
    async execute(message, image, hehe) {
        if (message.author.bot) return;
        const date = new Date();
        const min = ("0" + date.getMinutes()).slice(-2);

        const msg = message.content.toLowerCase();
        
        if (msg == "hehe " + min) {
            message.client.commands.get('welcome').execute(message, image, hehe);
            message.reply("successfully verified!")
                .then(msg => {
                    setTimeout(() => msg.delete(), 10000);
                })
                .catch(e => console.log("Error sending successful verification prompt: " + e.message));
        } else {
            try {
                message.reply("insert wrong verification prompt")
                .then(msg => {
                    setTimeout(() => msg.delete(), 10000);
                    setTimeout(() => message.delete(), 10000);
                });
            } catch (e) {
                console.log("Error rejecting verification message: " + e.message);
            }
        }

    }
}