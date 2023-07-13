const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const emotes = require("../emotes.js");
const profileModel = require("../models/profileSchema.js");
const { Image, createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const { readFile } = require('fs/promises');
const { generateFib } = require('../fib.js');
const { read } = require('fs');


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
                
        const canvas = createCanvas(750, 377);
        const context = canvas.getContext('2d');

        const cardData = currUserData.card;
        let base;
        let baseImg = new Image();
        let level;
        let levelImg = new Image();
        //variables below: 0 = empty
        let decorTop;
        let decorTopImg = new Image();
        let decorBot;
        let decorBotImg = new Image();
        let ach = [];
        let fgdTop;
        let fgdTopImg = new Image();
        let fgdBot;
        let fgdBotImg = new Image();

        //ALL
        const barB = await readFile('./src/images/[ALL]Backbar.png');
        const barBImg = new Image();
        barBImg.src = barB;

        const bar = await readFile('./src/images/[ALL]YellowBar.png');
        const barImg = new Image();
        barImg.src = bar;

        const memoryB = await readFile('./src/images/[ALL]MemoriesBase.png');
        const memoryBImg = new Image();
        memoryBImg.src = memoryB;

        const memory = await readFile('./src/images/[ALL]MemoriesBar.png');
        const memoryImg = new Image();
        memoryImg.src = memory;

        const petal = await readFile('./src/images/[ALL]Petal.png');
        const petalImg = new Image();
        petalImg.src = petal;

        const heheDecor = await readFile('./src/images/[DECOR]Hehe.png');
        const heheImg = new Image();
        heheImg.src = heheDecor;

        const achPH = await readFile('./src/images/[All]AchievementPH.png');
        const achPHImg = new Image();
        achPHImg.src = achPH;

        const kai = await readFile('./src/images/[DECOR]Kai.png');
        const kaiImg = new Image();
        kaiImg.src = kai;

        const fish = await readFile('./src/images/[DECOR]Fish.png');
        const fishImg = new Image();
        fishImg.src = fish;


        /* SPECIAL
        0: regular
        1: mod
        2: Feesh
        3: Kai*/
        switch (cardData.special) {
            case 0:
                base = await readFile('./src/images/[ALL]Base2.png');
                baseImg.src = base;
        }

        /*
        DECOR
        0: empty
        1: DTIYS1
        2: Halloween1
        3: Xmas
        4: GrpPic1
        5: Lindel
        6: Box1
        */
        switch (cardData.decor) {
            case 1:
                //overlay
                decorTop = await readFile('./src/images/[DECOR]DTIYS1-2.png');
                decorTopImg.src = decorTop;
                //regular
                decorBot = await readFile('./src/images/[DECOR]DTIYS1-1.png');
                decorBotImg.src = decorBot;
                break;
            case 2: 
                //regular
                decorTop = await readFile('./src/images/[DECOR]Halloween-2.png');
                decorTopImg.src = decorTop;
                //overlay
                decorBot = await readFile('./src/images/[DECOR]Halloween-1.png');
                decorBotImg.src = decorBot;
                break;
            case 3: 
                decorTop = await readFile('./src/images/[DECOR]Xmas.png');
                decorTopImg.src = decorTop;
                break;
            case 4: 
                decorTop = await readFile('./src/images/[DECOR]GroupPic1.png');
                decorTopImg.src = decorTop;
                break;
            case 5:
                //overlay
                decorTop = await readFile('./src/images/[DECOR]Lindel.png');
                decorTopImg.src = decorTop;
                break;
            case 6: 
                //Exclusion
                decorTop = await readFile('./src/images/[DECOR]Box1-2.png');
                decorTopImg.src = decorTop;
                //regular
                decorBot = await readFile('./src/images/[DECOR]Box1-1.png');
                decorBotImg.src = decorBot;  
        }

        /* ACTIVE ACHIEVEMENTS
        1: Booster 
        2: Kyumulus 
        3: Halloween1
        4: DTIYS1
        5: Xmas1
        6: GrpPic1
        7: Lindel
        8: Box
        */

        let currAch;
        let currImg;
        for (let i = 0; i < cardData.activeAch.length; i++) {
            switch (cardData.activeAch[i]) {
                case 1:
                    currAch = await readFile('./src/images/[ACH]Booster.png');
                    currImg = new Image();
                    currImg.src = currAch;
                    break;
                case 2: 
                    currAch = await readFile('./src/images/[ACH]Kyumulus.png');
                    currImg = new Image();
                    currImg.src = currAch;
                    break;
                case 3: 
                    currAch = await readFile('./src/images/[ACH]Hlwn1.png');
                    currImg = new Image();
                    currImg.src = currAch;
                    break;
                case 4: 
                    currAch = await readFile('./src/images/[ACH]DTIYS1.png');
                    currImg = new Image();
                    currImg.src = currAch;
                    break;
                case 5: 
                    currAch = await readFile('./src/images/[ACH]Xmas.png');
                    currImg = new Image();
                    currImg.src = currAch;
                    break;
                case 6: 
                    currAch = await readFile('./src/images/[ACH]GrpPic.png');
                    currImg = new Image();
                    currImg.src = currAch;
                    break;
                case 7:
                    currAch = await readFile('./src/images/[ACH]Lindel.png');
                    currImg = new Image();
                    currImg.src = currAch;
                    break;
                case 8: 
                    currAch = await readFile('./src/images/[ACH]Box.png');
                    currImg = new Image();
                    currImg.src = currAch;
            } 

            ach.push(currImg);
        }

        /*FOREGROUND
        1: Bubbles
        2: Legacy
        3: Stars
        4: Kyumulus 
        5: Booster
        */

        switch (cardData.fg) {
            case 1: 
                fgdTop = await readFile('./src/images/[FGRD]Bubbles.png');
                fgdTopImg.src = fgdTop;
                break;
            case 2: 
                fgdTop = await readFile('./src/images/[FGRD]Legacy.png');
                fgdTopImg.src = fgdTop;
                break;
            case 3: 
                fgdTop = await readFile('./src/images/[FGRD]Stars.png');
                fgdTopImg.src = fgdTop;
                break;
            case 4: 
                fgdTop = await readFile('./src/images/[FGRD]Kyumulus.png');
                fgdTopImg.src = fgdTop;
                break;
            case 5: 
                fgdTop = await readFile('./src/images/[FGRD]Booster-2.png');
                fgdTopImg.src = fgdTop;
                //hard light
                fgdBot = await readFile('./src/images/[FGRD]Booster.png');
                fgdBotImg.src = fgdBot;
                
        }

        // LEVELS
        if (currUserData.level < 3) {
            level = await readFile('./src/images/[LVL]Seed.png');
            levelImg.src = level;
        } else if (currUserData.level < 10) {
            level = await readFile('./src/images/[LVL]Sprout.png');
            levelImg.src = level;
        } else {
            level = await readFile('./src/images/[LVL]Seedling.png');
            levelImg.src = level;
        }

        
        let barPos = -365;

        const currDream = currUserData.dream;
        const nextDream = generateFib(currUserData.level + 1);

        barPos = barPos * (1 - currDream / nextDream);
    
        
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

        context.drawImage(barBImg, 0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'source-atop';
        context.drawImage(barImg, barPos, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'source-over';
        context.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
        context.drawImage(memoryBImg, 0, 0, canvas.width, canvas.height);
        /*context.globalCompositeOperation = 'source-atop';
        context.drawImage(memoryImg, 0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'source-over';*/
        context.drawImage(petalImg, 0, 0, canvas.width, canvas.height);
        context.drawImage(achPHImg, 0, 0, canvas.width, canvas.height);

        if (decorBotImg) { 
            switch (cardData.decor) {
                case 2:
                    context.globalCompositeOperation = 'overlay';
                    break;
                case 6:
                    context.globalCompositeOperation = 'exclusion';
                    break;
            }
            context.drawImage(decorBotImg, 0, 0, canvas.width, canvas.height);
            context.globalCompositeOperation = 'source-over';
        }

        if (decorTopImg) {
            switch (cardData.decor) {
                case 1:
                    context.globalCompositeOperation = 'overlay';
                case 5:
                    context.globalCompositeOperation = 'overlay';
            }
            context.drawImage(decorTopImg, 0, 0, canvas.width, canvas.height);
            context.globalCompositeOperation = 'source-over';
        }

        if (ach.length != 0) {
            let pos = 0;
            for (let i = 0; i < ach.length; i ++) {
                context.drawImage(ach[i], -pos, 0, canvas.width, canvas.height);
                pos += 32;
            }    
        }

        if (fgdBotImg) {
            switch (cardData.fg) {
                case 5:
                    context.globalCompositeOperation = 'hard-light';
            }
            context.drawImage(fgdBotImg, 0, 0, canvas.width, canvas.height);
            context.globalCompositeOperation = 'source-over';
        }

        if (fgdTopImg) {
            context.drawImage(fgdTopImg, 0, 0, canvas.width, canvas.height);
        }

        if (levelImg) {
            context.drawImage(levelImg, 0, 0, canvas.width, canvas.height);
        }

        context.font = applyText(canvas, currUserData.nickname);
        context.fillStyle = '#ff8d75';
        context.fillText(`${currUserData.nickname}`, 108, 110);

        context.font = '35px "Handwriting"';
        context.fillStyle = "#f9c9ad";
        context.fillText(`${currUserData.petals}`, 215, 270);

        context.fillStyle = '#ffd47b';
        context.fillText(`${currUserData.level}`, 170, 190); 

        const attach = new AttachmentBuilder(await canvas.encode('png'), { name: 'balance.png' });


        if (currUserData.level == 1) {
            message.reply({ embeds: [myEmbed], allowedMentions: { repliedUser: false }});
        } else {
            message.reply({ files: [attach],  allowedMentions: { repliedUser: false }});
        }
    
    }
}