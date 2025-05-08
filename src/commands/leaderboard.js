const profileModel = require('../models/profileSchema.js');
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  Events
} = require('discord.js');
const emotes = require('../emotes.js');

module.exports = {
  name: 'leaderboard',
  async execute(message, image, hehe) {
    const initButton = new ActionRowBuilder()
      /*.addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("◀️")
            )*/
      .addComponents(
        new ButtonBuilder()
          .setCustomId('next')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('▶️')
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('petals')
          .setLabel('petals')
          .setStyle(ButtonStyle.Primary)
      );
    let lbButtons = initButton;
    let pos = 0;
    let lvlData;
    try {
      lvlData = await profileModel
        .find({ nickname: { $ne: null } })
        .sort({ level: -1, dream: -1 })
        .skip(pos)
        .limit(10);
    } catch (e) {
      console.log('Error getting dream leaderboard: ' + e.message);
    }

    let lbEmbed;
    if (lvlData) {
      const text = lvlData
        .map(
          (obj, position) =>
            `${position + pos + 1}. **${obj.nickname}**: Level ${obj.level}`
        )
        .join('\n');

      lbEmbed = new EmbedBuilder()
        .setColor('e4ee71')
        .setTitle('**Leaderboard**')
        .setThumbnail(image)
        .addFields({ name: 'Dream Leaderboard', value: text })
        .setFooter({ text: hehe });
    }

    const msg = await message.channel.send({
      embeds: [lbEmbed],
      components: [lbButtons]
    });

    const collector = msg.createMessageComponentCollector();

    collector.on('collect', async (interaction) => {
      if (!interaction.isButton()) return;
      if (interaction.user.id != message.author.id) {
        return;
      }
      if (interaction.customId == 'next') {
        interaction.deferUpdate();
        pos += 10;
        try {
          lvlData = await profileModel
            .find({ nickname: { $ne: null } })
            .sort({ level: -1, dream: -1 })
            .skip(pos)
            .limit(10);
        } catch (e) {
          console.log('Error getting dream leaderboard: ' + e.message);
        }
        if (lvlData) {
          const newText = lvlData
            .map(
              (obj, position) =>
                `${position + pos + 1}. **${obj.nickname}**: Level ${obj.level}`
            )
            .join('\n');

          lbEmbed = new EmbedBuilder()
            .setColor('e4ee71')
            .setTitle('**Leaderboard**')
            .setThumbnail(image)
            .addFields({ name: 'Dream Leaderboard', value: newText })
            .setFooter({ text: hehe });
        }
        if (
          pos + lvlData.length >=
          (await profileModel.countDocuments({ nickname: { $ne: null } }))
        ) {
          lbButtons = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('prev')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('◀️')
            )
            .addComponents(
              new ButtonBuilder()
                .setCustomId('petals')
                .setLabel('petals')
                .setStyle(ButtonStyle.Primary)
            );
        } else {
          lbButtons = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('prev')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('◀️')
            )
            .addComponents(
              new ButtonBuilder()
                .setCustomId('next')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('▶️')
            )
            .addComponents(
              new ButtonBuilder()
                .setCustomId('petals')
                .setLabel('petals')
                .setStyle(ButtonStyle.Primary)
            );
        }
        msg.edit({ embeds: [lbEmbed], components: [lbButtons] });
      } else if (interaction.customId == 'prev') {
        interaction.deferUpdate();
        pos -= 10;
        try {
          lvlData = await profileModel
            .find({ nickname: { $ne: null } })
            .sort({ level: -1, dream: -1 })
            .skip(pos)
            .limit(10);
        } catch (e) {
          console.log('Error getting dream leaderboard: ' + e.message);
        }
        if (lvlData) {
          const newText = lvlData
            .map(
              (obj, position) =>
                `${position + pos + 1}. **${obj.nickname}**: Level ${obj.level}`
            )
            .join('\n');

          lbEmbed = new EmbedBuilder()
            .setColor('e4ee71')
            .setTitle('**Leaderboard**')
            .setThumbnail(image)
            .addFields({ name: 'Dream Leaderboard', value: newText })
            .setFooter({ text: hehe });
        }
        if (pos <= 0) {
          lbButtons = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('next')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('▶️')
            )
            .addComponents(
              new ButtonBuilder()
                .setCustomId('petals')
                .setLabel('petals')
                .setStyle(ButtonStyle.Primary)
            );
        } else {
          lbButtons = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('prev')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('◀️')
            )
            .addComponents(
              new ButtonBuilder()
                .setCustomId('next')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('▶️')
            )
            .addComponents(
              new ButtonBuilder()
                .setCustomId('petals')
                .setLabel('petals')
                .setStyle(ButtonStyle.Primary)
            );
        }
        msg.edit({ embeds: [lbEmbed], components: [lbButtons] });
      } else if (interaction.customId == 'petals') {
        interaction.deferUpdate();
        pos = 0;

        lbButtons = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('pnext')
              .setStyle(ButtonStyle.Secondary)
              .setEmoji('▶️')
          )
          .addComponents(
            new ButtonBuilder()
              .setCustomId('dream')
              .setLabel('dream')
              .setStyle(ButtonStyle.Primary)
          );

        try {
          lvlData = await profileModel
            .find({ nickname: { $ne: null } })
            .sort({ petals: -1 })
            .skip(pos)
            .limit(10);
        } catch (e) {
          console.log('Error getting petals leaderboard: ' + e.message);
        }

        if (lvlData) {
          const newText = lvlData
            .map(
              (obj, position) =>
                `${position + pos + 1}. **${obj.nickname}**: ${obj.petals} ${emotes.plum}`
            )
            .join('\n');

          lbEmbed = new EmbedBuilder()
            .setColor('e4ee71')
            .setTitle('**Leaderboard**')
            .setThumbnail(image)
            .addFields({ name: 'Petals Leaderboard', value: newText })
            .setFooter({ text: hehe });
        }
        msg.edit({ embeds: [lbEmbed], components: [lbButtons] });
      } else if (interaction.customId == 'dream') {
        interaction.deferUpdate();
        pos = 0;
        try {
          lvlData = await profileModel
            .find({ nickname: { $ne: null } })
            .sort({ level: -1, dream: -1 })
            .skip(pos)
            .limit(10);
        } catch (e) {
          console.log('Error getting dream leaderboard: ' + e.message);
        }

        if (lvlData) {
          const text = lvlData
            .map(
              (obj, position) =>
                `${position + pos + 1}. **${obj.nickname}**: Level ${obj.level}`
            )
            .join('\n');

          lbEmbed = new EmbedBuilder()
            .setColor('e4ee71')
            .setTitle('**Leaderboard**')
            .setThumbnail(image)
            .addFields({ name: 'Dream Leaderboard', value: text })
            .setFooter({ text: hehe });
        }

        msg.edit({ embeds: [lbEmbed], components: [initButton] });
      } else if (interaction.customId == 'pnext') {
        interaction.deferUpdate();
        pos += 10;
        try {
          lvlData = await profileModel
            .find({ nickname: { $ne: null } })
            .sort({ petals: -1 })
            .skip(pos)
            .limit(10);
        } catch (e) {
          console.log('Error getting petal leaderboard: ' + e.message);
        }
        if (lvlData) {
          const newText = lvlData
            .map(
              (obj, position) =>
                `${position + pos + 1}. **${obj.nickname}**: ${obj.petals} ${emotes.plum}`
            )
            .join('\n');

          lbEmbed = new EmbedBuilder()
            .setColor('e4ee71')
            .setTitle('**Leaderboard**')
            .setThumbnail(image)
            .addFields({ name: 'Petals Leaderboard', value: newText })
            .setFooter({ text: hehe });
        }
        if (
          pos + lvlData.length >=
          (await profileModel.countDocuments({ nickname: { $ne: null } }))
        ) {
          lbButtons = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('pprev')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('◀️')
            )
            .addComponents(
              new ButtonBuilder()
                .setCustomId('dream')
                .setLabel('dream')
                .setStyle(ButtonStyle.Primary)
            );
        } else {
          lbButtons = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('pprev')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('◀️')
            )
            .addComponents(
              new ButtonBuilder()
                .setCustomId('pnext')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('▶️')
            )
            .addComponents(
              new ButtonBuilder()
                .setCustomId('dream')
                .setLabel('dream')
                .setStyle(ButtonStyle.Primary)
            );
        }
        msg.edit({ embeds: [lbEmbed], components: [lbButtons] });
      } else if (interaction.customId == 'pprev') {
        interaction.deferUpdate();
        pos -= 10;
        try {
          lvlData = await profileModel
            .find({ nickname: { $ne: null } })
            .sort({ petals: -1 })
            .skip(pos)
            .limit(10);
        } catch (e) {
          console.log('Error getting petal leaderboard: ' + e.message);
        }
        if (lvlData) {
          const newText = lvlData
            .map(
              (obj, position) =>
                `${position + pos + 1}. **${obj.nickname}**: ${obj.petals} ${emotes.plum}`
            )
            .join('\n');

          lbEmbed = new EmbedBuilder()
            .setColor('e4ee71')
            .setTitle('**Leaderboard**')
            .setThumbnail(image)
            .addFields({ name: 'Petals Leaderboard', value: newText })
            .setFooter({ text: hehe });
        }
        if (pos <= 0) {
          lbButtons = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('pnext')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('▶️')
            )
            .addComponents(
              new ButtonBuilder()
                .setCustomId('dream')
                .setLabel('dream')
                .setStyle(ButtonStyle.Primary)
            );
        } else {
          lbButtons = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('pprev')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('◀️')
            )
            .addComponents(
              new ButtonBuilder()
                .setCustomId('pnext')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('▶️')
            )
            .addComponents(
              new ButtonBuilder()
                .setCustomId('dream')
                .setLabel('dream')
                .setStyle(ButtonStyle.Primary)
            );
        }
        msg.edit({ embeds: [lbEmbed], components: [lbButtons] });
      }
    });
  }
};
