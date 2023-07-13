const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const emotes = require("../emotes.js");
const profileModel = require("../models/profileSchema.js");
const { Image, createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const { readFile } = require('fs/promises');
const { registerFont } = require("canvas");


module.exports = {
    name: 'bal',
    description: 'checks balance',
    async execute(message, target, image, hehe) {

        GlobalFonts.registerFromPath('./src/Handwriting-regular.otf', 'Handwriting');

        let currUserData;
        try { 
            currUserData = await profileModel.findOne({ userId: target.id });
        } catch(e) {
            console.log("Error fetching user bal in !bal: " + e.message);
        }
        if (!currUserData || currUserData.nickname == null) {
            return message.reply("this user has not registered~ check back later!");
        }

        const myEmbed = new EmbedBuilder()
            .setColor('e4ee71')
            .setTitle(`**${currUserData.nickname} | ${target}**`)
            .setThumbnail(image)
            .setDescription(`You have ${currUserData.petals} ${emotes.plum}`)
            .setFooter({text: hehe})
                

        message.channel.send({ embeds: [myEmbed]});

        
        const canvas = createCanvas(700, 355);
        const context = canvas.getContext('2d');

        const background = await readFile('./src/images/4.png');
        const backgroundImage = new Image();
        backgroundImage.src = background;

        const dream = await readFile('./src/images/1.png');
        const dreamImg = new Image();
        dreamImg.src = dream;

        const petals = await readFile('./src/images/2.png');
        const petalImg = new Image();
        petalImg.src = petals;

        const name = await readFile('./src/images/3.png');
        const nameImg = new Image();
        nameImg.src = name;

        const bar = await readFile('./src/images/5.png');
        const barImg = new Image();
        barImg.src = bar;

        const barBack = await readFile('./src/images/6.png');
        const barBImg = new Image();
        barBImg.src = barBack;

        /*const f = new FontFace("Kai", "url(src/font.ttf)");

        f.load().then(async () => {*/

        context.drawImage(barBImg, 0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'source-atop';
        context.drawImage(barImg, 0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'source-over';
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        context.drawImage(nameImg, 0, 0, canvas.width, canvas.height);
        context.drawImage(petalImg, 0, 0, canvas.width, canvas.height);
        context.drawImage(dreamImg, 0, 0, canvas.width, canvas.height);

        
        context.font = '30px "Handwriting"';
        context.fillStyle = '#ffffff';
        context.fillText("font test", 20, 20);
        const attach = new AttachmentBuilder(await canvas.encode('png'), { name: 'balance.png' });

        message.channel.send({ files: [attach] });
    
    }
}