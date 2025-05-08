const { SlashCommandBuilder } = require('discord.js');

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
    const maxTickets = interaction.options.getNumber('max_tickets') || 0;

    await interaction.reply(`${title} ${price} ${maxTickets}`);
  }
};
