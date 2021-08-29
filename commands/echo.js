const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Responde con tu entrada.')
		.addStringOption(option =>
			option
				.setName('entrada')
				.setDescription('La entrada para hacer eco')
				.setRequired(true)
		),
	async execute(interaction) {
		console.log(interaction);
	},
};
