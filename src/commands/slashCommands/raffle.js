const { SlashCommandBuilder } = require('discord.js');
const dayjs = require('dayjs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('raffle')
    .setDescription('Makes a raffle embed')
    .addStringOption((option) =>
      option
        .setName('title')
        .setDescription('The title of the raffle')
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName('price')
        .setDescription('The price of the raffle')
        .setRequired(true)
        .setMinValue(0)
    )
    .addStringOption((option) =>
      option
        .setName('duration_type')
        .setDescription('The duration type (e.g. day, hours, minutes)')
        .setRequired(true)
        .setChoices(
          { name: 'month', value: 'month' },
          { name: 'week', value: 'week' },
          { name: 'day', value: 'day' },
          { name: 'hour', value: 'hour' },
          { name: 'minute', value: 'minute' }
        )
    )
    .addNumberOption((option) =>
      option
        .setName('duration_value')
        .setDescription('The duration numerical value')
        .setRequired(true)
        .setMinValue(1)
    )
    .addNumberOption((option) =>
      option
        .setName('max_tickets')
        .setDescription('The max tickets for the raffle')
        .setRequired(false)
        .setMinValue(1)
    ),

  execute: async (interaction) => {
    const title = interaction.options.getString('title');
    const price = interaction.options.getNumber('price');
    const durationType = interaction.options.getString('duration_type');
    const durationValue = interaction.options.getNumber('duration_value');
    const endTime = dayjs().add(durationValue, durationType).format('YYYY-MM-DD HH:mm:ss');
    const maxTickets = interaction.options.getNumber('max_tickets') || 1;


    await interaction.reply(`${title} ${price} ${maxTickets} ends: ${endTime}`);
  }
};
