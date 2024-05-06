const achModel = require("./models/achModel.js");
const profileSchema = require("./models/profileSchema.js");
const { Image, createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const { readFile } = require('fs/promises');
const { generateFib } = require('./fib.js');
const id = require("./id.js");

const { generateSpecial } = require("./generateSpecial.js");


async function generateCard (currUserData, message) {
        try {
            const currUser = await profileSchema.findOne(
                { userId: message.author.id }
            )
            if (currUser && currUser.ach[1]) {
                if (!message.member.roles.cache.has(id.boosterRole)) {
                    const currUser = await profileSchema.findOne(
                        { userId: message.author.id }
                    )
                    const updateAch = currUser.ach;
                    updateAch[1] = false;

                    await profileSchema.findOneAndUpdate(
                        { userId: message.author.id },
                        { $set: {ach: updateAch} },
                    )

                    if (message.member.roles.cache.has(id.boosterColor)) {
                        await message.member.roles.remove(id.boosterColor)
                    }

                } else if (message.member.roles.cache.has(id.boosterRole)) {
                    const currArray = currUser.ach;
                    currArray[1] = true;
                    
                    await profileSchema.findOneAndUpdate(
                        { userId: message.author.id },
                        { $set: {ach: currArray} },
                    )
                }
            
            } 
        } catch(e) {
            console.log("Error checking booster role: " + e.message)
        }

        try {
            const currUser = await profileSchema.findOne(
                { userId: message.author.id }
            )
            if (currUser && currUser.ach[20]) {
                if (!message.member.roles.cache.has(id.patreonRole)) {
                    const currUser = await profileSchema.findOne(
                        { userId: message.author.id }
                    )
                    const updateAch = currUser.ach;
                    updateAch[20] = false;

                    await profileSchema.findOneAndUpdate(
                        { userId: message.author.id },
                        { $set: {ach: updateAch} },
                    )
                }

            } else if (currUser && message.member.roles.cache.has(id.patreonRole)) {
                const currArray = currUser.ach;
                currArray[20] = true;

                await profileSchema.findOneAndUpdate(
                    { userId: message.author.id },
                    { $set: {ach: currArray} },
                )
            }
            
        } catch(e) {
            console.log("Error checking patreon role: " + e.message)
        }

        currUserData = await profileSchema.findOne(
            { userId: message.author.id }
        );

        //Start of generate card
    
        GlobalFonts.registerFromPath('./src/Handwriting-regular.otf', 'Handwriting');

        let canvas = createCanvas(750, 377);
        let context = canvas.getContext('2d');

        var cardData = currUserData.card;
        let level;
        let levelImg = new Image();

        if (cardData.special != 0 && currUserData.ach[cardData.special]) {
            return generateSpecial(message, currUserData, cardData.special);
        } else if (cardData.special != 0) {
            try {
                await profileSchema.findOneAndUpdate(
                    { userId: message.author.id },
                    { $set: {'card.special': 0, 
                        'card.specDec': 0} },

                )
                currUserData = await profileSchema.findOne(
                    { userId: message.author.id }
                )
            } catch(e) {
                console.log("Error updating style for ex-patreon: " + e.message)
            }
        }

        //ALL
        const barB = await readFile('./src/images/[ALL]Backbar.png');
        const barBImg = new Image();
        barBImg.src = barB;

        const memoryB = await readFile('./src/images/[ALL]MemoriesBase.png');
        const memoryBImg = new Image();
        memoryBImg.src = memoryB;

        const petal = await readFile('./src/images/[ALL]Petal.png');
        const petalImg = new Image();
        petalImg.src = petal;

        const heheDecor = await readFile('./src/images/[DECOR]Hehe.png');
        const heheImg = new Image();
        heheImg.src = heheDecor;

        const achPH = await readFile('./src/images/[ALL]AchievementPH.png');
        const achPHImg = new Image();
        achPHImg.src = achPH;

        const kai = await readFile('./src/images/[DECOR]Kai.png');
        const kaiImg = new Image();
        kaiImg.src = kai;

        const fish = await readFile('./src/images/[DECOR]Fish.png');
        const fishImg = new Image();
        fishImg.src = fish;

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

        let special = cardData.special;
        let styleRef;
        let fgRef = cardData.fg;
        let achArray = cardData.activeAch;

        let base = new Image();
        let mem = new Image();
        let bar = new Image();
        let nameCol = '#ff8d75';
        let nameW = 108;
        let nameH = 110;

        try {
            styleRef = await achModel.findOne(
                { index: cardData.decor }
            )
            

            fgRef = await achModel.findOne(
                { index: fgRef }
            )
            

            special = await achModel.findOne(
                { index: special }
            )
            
        } catch(e) {
            console.log("Error getting special, style and/or fg ref: " + e.message);
            return;
        }

        const barFile = await readFile('./src/images/[ALL]YellowBar.png');
        bar.src = barFile;

        let baseRef;

        try {
            baseRef = await achModel.findOne(
                { index: cardData.decor }
            )
        } catch(e) {
            console.log("Error when retrieving base path: " + e.message);
        }

        const baseFile = await readFile(baseRef.base);
        base.src = baseFile;
        

        context.drawImage(barBImg, 0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'source-atop';
        context.drawImage(bar, barPos, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'source-over';

        context.drawImage(base, 0, 0, canvas.width, canvas.height);   
        context.drawImage(mem, 0, 0, canvas.width, canvas.height);

        context.drawImage(achPHImg, 0, 0, canvas.width, canvas.height);

        //render style
        if (typeof styleRef === "object") {
            if (styleRef == null) {

            } else if (styleRef.style.bgTop.imagePath != undefined && currUserData.ach[styleRef.index]) {
                const info = styleRef.style;
                if (info.bgBot.imagePath != undefined) {
                    context.globalCompositeOperation = info.bgBot.blendingMode;
                    const bgBotFile = await readFile(info.bgBot.imagePath);
                    const bgBot = new Image();
                    bgBot.src = bgBotFile;
                    context.drawImage(bgBot, 0, 0, canvas.width, canvas.height);
                    context.globalCompositeOperation = "source-over";
                }

                context.globalCompositeOperation = info.bgTop.blendingMode;
                const bgTopFile = await readFile(info.bgTop.imagePath);
                const bgTop = new Image();
                bgTop.src = bgTopFile;
                context.drawImage(bgTop, 0, 0, canvas.width, canvas.height);
                context.globalCompositeOperation = "source-over"
                
            }
        }

        let pos = -128;
        for (let i = 0; i < achArray.length; i++) {
            let badgeRef;
            try {
                badgeRef = await achModel.findOne(
                    { index: achArray[i] }
                );
                
            } catch(e) {
                console.log('Error getting badge: ' + e.message);
                return;
            }
            if (!currUserData.ach[achArray[i]]) {
                continue;
            }
            let badge = new Image();
            badge.onload = function() {
                context.drawImage(badge, pos, 0, canvas.width, canvas.height);
                pos += 32;
            }
            
            const badgeFile = await readFile(badgeRef.badgePath);
            badge.src = badgeFile;
            
            
            
        };

        if (levelImg) {
            context.drawImage(levelImg, 0, 0, canvas.width, canvas.height);
        }

        context.drawImage(memoryBImg, 0, 0, canvas.width, canvas.height);
        
        if (currUserData.memories > 0) {
            //MEMORIES
            const memory = await readFile(`./src/images/mem${currUserData.memories}.png`);
            const memoryImg = new Image();
            memoryImg.src = memory;
            context.drawImage(memoryImg, 0, 0, canvas.width, canvas.height);
        }
        
        //render foreground
        if (typeof fgRef == 'object') {
            if (fgRef.fg.fgTop.imagePath != undefined && currUserData.ach[fgRef.index]) {
                const info = fgRef.fg;
                
                if (info.fgBot.imagePath != undefined) {
                    context.globalCompositeOperation = info.fgBot.blendingMode;
                    const fgBotFile = await readFile(info.fgBot.imagePath);
                    const fgBot = new Image();
                    fgBot.src = fgBotFile;
                    context.drawImage(fgBot, 0, 0, canvas.width, canvas.height);
                    context.globalCompositeOperation = "source-over";
                }

                
                context.globalCompositeOperation = info.fgTop.blendingMode;
                const fgTopFile = await readFile(info.fgTop.imagePath);
                const fgTop = new Image();
                fgTop.src = fgTopFile;
                context.drawImage(fgTop, 0, 0, canvas.width, canvas.height);
                context.globalCompositeOperation = "source-over";
                
            }
        }

        const member = await message.member;
        const achChannel = await member.guild.channels.cache.get(id.secretAchChannel);
        const tempAchArray = currUserData.ach;
        const rand = Math.random();
        if (rand < 0.02) {
            context.drawImage(kaiImg, 0, 0, canvas.width, canvas.height);
            try {
                if (!tempAchArray[19]) {
                    achChannel.send(`<@${currUserData.userId}> You have obtained a secret achievement!
Use the edit card command to check it out!`);
                }
                tempAchArray[19] = true;
                await profileSchema.findOneAndUpdate(
                    { userId: currUserData.userId },
                    { $set: { ach: tempAchArray }},
                );
                
                
            } catch(e) {
                console.log("Error adding easter kai achievement: " + e.message);
            }
        }

        const feeshCry = await readFile('./src/images/[DECOR]FeeshCry.png');
        const feeshCryImg = new Image();
        feeshCryImg.src = feeshCry;
        const rand1 = Math.random();
        if (rand1 < 0.02) {
            context.drawImage(feeshCryImg, 0, 0, canvas.width, canvas.height);
            message.reply({content: "Feesh spent a lot of effort making cards possible for you...please show her some love!", allowedMentions: { repliedUser: false }});
        }

        context.font = applyText(canvas, currUserData.nickname);
        context.fillStyle = nameCol;
        context.fillText(`${currUserData.nickname}`, nameW, nameH);

        context.font = '35px "Handwriting"';
        context.fillStyle = "#f9c9ad";
        context.fillText(`${currUserData.petals}`, 215, 270);

        context.fillStyle = '#ffd47b';
        context.fillText(`${currUserData.level}`, 170, 190); 

        context.drawImage(petalImg, 0, 0, canvas.width, canvas.height);

        let rand3 = Math.random();
        if (rand3 < 0.02) {
            context.drawImage(fishImg, 0, 0, canvas.width, canvas.height);
            try {
                if (!tempAchArray[18]) {
                    achChannel.send(`<@${currUserData.userId}> You have obtained a secret achievement!
Use the edit card command to check it out!`);
                }
                tempAchArray[18] = true;
                await profileSchema.findOneAndUpdate(
                    { userId: currUserData.userId },
                    { $set: { ach: tempAchArray }},
                );
                
            } catch(e) {
                console.log("Error adding easter feesh achievement: " + e.message);
            }
        }
        const heheDrown = await readFile('./src/images/[DECOR]HeheDrown.png');
        const heheDrownImg = new Image();
        heheDrownImg.src = heheDrown;
        const rand4 = Math.random();
        if (rand4 < 0.02) {
            context.drawImage(heheDrownImg, 0, 0, canvas.width, canvas.height);
            message.reply({content: "Hehe..hehe..he..help", allowedMentions: { repliedUser: false }});
            setTimeout(() => message.reply({content: "Hehe floats away...", allowedMentions: { repliedUser: false }}), 7000);
        }

        let rand2 = Math.random();
        if (rand2 < 0.02) {
            const x = Math.floor(Math.random() * 600);
            const y = Math.floor(Math.random() * 227);
            context.drawImage(heheImg, x, y, 150, 150);
            try {
                if (!tempAchArray[17]) {
                    achChannel.send(`<@${currUserData.userId}> You have obtained a secret achievement!
Use the edit card command to check it out!`);
                }
                tempAchArray[17] = true;
                await profileSchema.findOneAndUpdate(
                    { userId: currUserData.userId },
                    { $set: { ach: tempAchArray }},
                );
                
            } catch(e) {
                console.log("Error adding easter hehe achievement: " + e.message);
            }
        }

        

        return canvas;
}

module.exports = { generateCard };