const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Devuelve el valor introducido.')
		.addStringOption(option =>
			option
				.setName('input')
				.setDescription('Valir a devolver.')
				.setRequired(true)
		),
	async execute(interaction) {
		const input = await interaction.options.getString('input'); //const nickname = await interaction.options.getString('nickname');

		await interaction.reply(`${interaction.user} dice: ${input}`);
	},
};
