const id = require("../id.js")

module.exports = {
    name: 'verify',
    description: 'verifies user',
    async execute(message, image, hehe) {
        if (message.author.bot) return;
        const date = new Date();
        const min = ("0" + date.getMinutes()).slice(-2);

        const msg = message.content.toLowerCase();
        
        if (msg == "hehe" /*+ min*/) {
            const m = message;
            await message.reply("successfully verified!")
                .then(msg => {
                    m.client.commands.get('welcome').execute(message, m.author.id, image, hehe);
                    setTimeout(() => msg.delete(), 10000);
                })
                .catch(e => console.log("Error sending successful verification prompt: " + e.message));
        } else {
            try {
                message.reply("Wrong code! Please read rules carefully again <:iTSoKAY:1064087424847843398>")
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