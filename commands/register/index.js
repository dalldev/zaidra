const { SlashCommandBuilder } = require('@discordjs/builders');
const api = require(__dirname + '/../../apis/tools4Albion');

const embeds = require('./embeds');
const bottons = require('./botton');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Iniciar sesion en el servidor')
		.addStringOption(option =>
			option
				.setName('input')
				.setDescription('Apodo de albion online.')
				.setRequired(true)
		),
	async execute(interaction) {
		await interaction.deferReply();
		await interaction.editReply({ embeds: [embeds.searching] });

		const nickname = await interaction.options.getString('input');

		const players = await api.players(nickname);

		if (players.error)
			return await interaction.editReply({
				embeds: [embeds.error(players.error)],
			});

		const menu = page => embeds.menu(page, players.pedido);

		await interaction.editReply({
			embeds: [menu(0)],
			components: [bottons.row()],
		});
	},
};
