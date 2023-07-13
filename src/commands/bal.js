const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const emotes = require("../emotes.js");
const profileModel = require("../models/profileSchema.js");
const { Image, createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const { readFile } = require('fs/promises');
const { generateFib } = require('../fib.js');


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

        let barPos = -365;

        const currDream = currUserData.dream;
        const nextDream = generateFib(currUserData.level + 1);

        barPos = barPos * (1 - currDream / nextDream);
        console.log(barPos);
    
        context.drawImage(barBImg, 0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'source-atop';
        context.drawImage(barImg, barPos, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'source-over';
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        
        const applyText = (canvas, text) => {
            const context = canvas.getContext('2d');
        
            let fontSize = 80;
        
            do {
                // Assign the font to the context and decrement it so it can be measured again
                context.font = `${fontSize -= 10}px "Handwriting"`;
                // Compare pixel width of the text to the canvas minus the approximate avatar size
            } while (context.measureText(text).width > canvas.width - 350);
        
            // Return the result to use in the actual canvas
            return context.font;
        };

        context.font = applyText(canvas, currUserData.nickname);
        context.fillStyle = '#ff8d75';
        context.fillText(`${currUserData.nickname}`, 108, 110);

        context.font = '35px "Handwriting"';
        context.fillStyle = "#f9c9ad";
        context.fillText(`${currUserData.petals}`, 200, 250);

        context.fillStyle = '#ffd47b';
        context.fillText(`${currUserData.level}`, 150, 185);


        const attach = new AttachmentBuilder(await canvas.encode('png'), { name: 'balance.png' });


        if (currUserData.level == 1) {
            message.reply({ embeds: [myEmbed], allowedMentions: { repliedUser: false }});
        } else {
            message.reply({ files: [attach],  allowedMentions: { repliedUser: false }});
        }
    
    }
}