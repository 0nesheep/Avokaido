const specModel = require('./models/specModel.js');
const achModel = require('./models/achModel.js');
const profileSchema = require('./models/profileSchema.js');
const { Image, createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const { readFile } = require('fs/promises');
const { generateFib } = require('./fib.js');
const id = require('./id.js');

async function generateSpecial(message, currUserData, idx) {
  GlobalFonts.registerFromPath('./src/Handwriting-regular.otf', 'Handwriting');

  let canvas = createCanvas(750, 377);
  let context = canvas.getContext('2d');

  var cardData = currUserData.card;

  var specData = await specModel.findOne({ index: idx });

  //bar back
  let barBImg;
  if (specData.background != undefined) {
    const barB = await readFile(specData.background);
    barBImg = new Image();
    barBImg.src = barB;
  } else {
    const barB = await readFile('./src/images/[ALL]Backbar.png');
    barBImg = new Image();
    barBImg.src = barB;
  }

  //bar
  let barImg;
  if (specData.background != undefined) {
    const bar = await readFile(specData.levelBar);
    barImg = new Image();
    barImg.src = bar;
  } else {
    const bar = await readFile('./src/images/[ALL]YellowBar.png');
    barImg = new Image();
    barImg.src = bar;
  }

  //base
  let baseImg;
  if (specData.base != undefined) {
    const base = await readFile(specData.base);
    baseImg = new Image();
    baseImg.src = base;
  } else {
    const base = await readFile('./src/images/[ALL]Base2.png');
    const baseImg = new Image();
    baseImg.src = base;
  }

  const heheDecor = await readFile('./src/images/[DECOR]Hehe.png');
  const heheImg = new Image();
  heheImg.src = heheDecor;

  //function to edit font size to fit
  const applyText = (canvas, text) => {
    const context = canvas.getContext('2d');

    let fontSize = 80;

    do {
      context.font = `${(fontSize -= 10)}px "Handwriting"`;
    } while (context.measureText(text).width > canvas.width - 350);

    return context.font;
  };

  //determine bar progress
  let barPos = -365;

  const currDream = currUserData.dream;
  const nextDream = generateFib(currUserData.level + 1);

  barPos = barPos * (1 - currDream / nextDream);

  //render bar
  context.drawImage(barBImg, 0, 0, canvas.width, canvas.height);
  context.globalCompositeOperation = 'source-atop';
  context.drawImage(barImg, barPos, 0, canvas.width, canvas.height);
  context.globalCompositeOperation = 'source-over';

  //render base
  context.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

  if (currUserData.memories > 0) {
    //MEMORIES
    const memory = await readFile(
      `./src/images/${specData.tag}mem${currUserData.memories}.png`
    );
    const memoryImg = new Image();
    memoryImg.src = memory;
    context.drawImage(memoryImg, 0, 0, canvas.width, canvas.height);
  }

  //name
  context.font = applyText(canvas, currUserData.nickname);
  context.fillStyle = specData.nameCol;
  context.globalCompositeOperation = specData.nameStyle;
  context.fillText(`${currUserData.nickname}`, 280, 110);
  context.globalCompositeOperation = 'source-over';

  //petals
  context.font = '35px "Handwriting"';
  context.globalCompositeOperation = specData.petalStyle;
  context.fillStyle = specData.petalCol;
  context.fillText(`${currUserData.petals}`, 205, 270);
  context.globalCompositeOperation = 'source-over';

  //level
  context.font = '35px "Handwriting"';
  context.fillStyle = specData.levelCol;
  context.globalCompositeOperation = specData.levelStyle;
  context.fillText(`${currUserData.level}`, 170, 190);
  context.globalCompositeOperation = 'source-over';

  //decor
  if (currUserData.card.specDec != -1) {
    const decData = specData.decor[currUserData.card.specDec];
    if (decData.blending != undefined) {
      context.globalCompositeOperation = decData.blending;
    }
    const specDec = await readFile(decData.img);
    const decImg = new Image();
    decImg.src = specDec;
    context.drawImage(decImg, 0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'source-over';
  }

  const member = await message.member;
  const achChannel = await member.guild.channels.cache.get(id.secretAchChannel);
  const tempAchArray = currUserData.ach;
  const rand = Math.random();

  if (rand < 0.02) {
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
        { $set: { ach: tempAchArray } }
      );
    } catch (e) {
      console.log('Error adding easter hehe achievement: ' + e.message);
    }
  }

  return canvas;
}

module.exports = { generateSpecial };
