const achModel = require("./models/achModel.js");
const profileSchema = require("./models/profileSchema.js");
const { Image, createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const { readFile } = require('fs/promises');
const { generateFib } = require('./fib.js');
const id = require("./id.js");

async function generateCard (currUserData) {
    
        GlobalFonts.registerFromPath('./src/Handwriting-regular.otf', 'Handwriting');

        let canvas = createCanvas(750, 377);
        let context = canvas.getContext('2d');

        const cardData = currUserData.card;
        let level;
        let levelImg = new Image();

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

        if (typeof special == 'object') {
            if (special.special.basePath != undefined && currUserData.ach[special.index]) {
                const info = special.special;
                if (info.barPath != undefined) {
                    const barFile = await readFile('./src/images/[ALL]YellowBar.png');
                    bar.src = barFile;
                }
                if (info.basePath != undefined) {
                    const baseFile = await readFile(info.basePath);
                    base.src = baseFile;  
                }

                if (info.memoryPath != undefined) {
                    const memFile = await readFile(info.memoryPath);
                    mem.src = memFile;
                }

                if (info.nameCol != undefined) {
                    nameCol = info.nameColor;
                }
                if (info.namePos != undefined) {
                    nameW = info.namePos[0];
                    nameH = info.namePos[1];
                }
            }
        }

        context.drawImage(barBImg, 0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'source-atop';
        context.drawImage(bar, barPos, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'source-over';

        context.drawImage(base, 0, 0, canvas.width, canvas.height);   
        context.drawImage(mem, 0, 0, canvas.width, canvas.height);
        
        context.drawImage(petalImg, 0, 0, canvas.width, canvas.height);
        context.drawImage(achPHImg, 0, 0, canvas.width, canvas.height);

        //render style
        if (typeof styleRef === "object") {
            if (styleRef.style.bgTop.imagePath != undefined && currUserData.ach[styleRef.index]) {
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

        

        context.font = applyText(canvas, currUserData.nickname);
        context.fillStyle = nameCol;
        context.fillText(`${currUserData.nickname}`, nameW, nameH);

        context.font = '35px "Handwriting"';
        context.fillStyle = "#f9c9ad";
        context.fillText(`${currUserData.petals}`, 215, 270);

        context.fillStyle = '#ffd47b';
        context.fillText(`${currUserData.level}`, 170, 190); 

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

        const tempAchArray = currUserData.ach;
        const rand = Math.random();
        if (rand < 0.02) {
            context.drawImage(kaiImg, 0, 0, canvas.width, canvas.height);
            try {
                tempAchArray[19] = true;
                await profileSchema.findOneAndUpdate(
                    { userId: currUserData.userId },
                    { $set: { ach: tempAchArray }},
                );
                
            } catch(e) {
                console.log("Error adding easter kai achievement: " + e.message);
            }
        }

        let rand3 = Math.random();
        if (rand3 < 0.02) {
            context.drawImage(fishImg, 0, 0, canvas.width, canvas.height);
            try {
                tempAchArray[18] = true;
                await profileSchema.findOneAndUpdate(
                    { userId: currUserData.userId },
                    { $set: { ach: tempAchArray }},
                );
                
            } catch(e) {
                console.log("Error adding easter feesh achievement: " + e.message);
            }
        }

        let rand2 = Math.random();
        if (rand2 < 0.02) {
            const x = Math.floor(Math.random() * 600);
            const y = Math.floor(Math.random() * 227);
            context.drawImage(heheImg, x, y, 150, 150);
            try {
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