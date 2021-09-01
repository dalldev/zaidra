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

		const peticion = await api.players(nickname);

		if (peticion.error)
			return await interaction.editReply({
				embeds: [embeds.error(peticion.error)],
			});

		const menu = page => embeds.menu(page, peticion.pedido);

		await interaction.editReply({
			embeds: [menu(0)],
			components: [
				bottons.row(true, peticion.pedido.length > 1 ? false : true),
			],
		});

		const message = await interaction.fetchReply();
		const collector = message.createMessageComponentCollector({
			componentType: 'BUTTON',
			time: 60000,
		});
		let action = false;
		let page = 0;

		collector.on('collect', async i => {
			i.deferUpdate();
			const { customId } = i;
			if (i.user.id !== interaction.user.id)
				return i.reply({
					content: 'Estos botones no son para ti.',
					ephemeral: true,
				});

			if (customId === 'ace') {
				await interaction.editReply({
					embeds: [embeds.bienvenida(peticion.pedido[page])],
					components: [],
				});
				action = true;
			}

			if (customId === 'can') {
				await interaction.deleteReply();

				action = true;
			}

			if (action) return;

			if (customId === 'ant') {
				page = page - 1;

				await interaction.editReply({ embeds: [menu(page)] });
			}

			if (customId === 'sig') {
				page = page + 1;

				await interaction.editReply({ embeds: [menu(page)] });
			}

			if (page === 0) {
				await interaction.editReply({ components: [bottons.row(true, false)] });
			} else if (page === peticion.pedido.length - 1) {
				await interaction.editReply({ components: [bottons.row(false, true)] });
			} else {
				await interaction.editReply({
					components: [bottons.row(false, false)],
				});
			}
		});

		collector.on('end', async () => {
			if (!action) {
				await interaction.editReply({
					embeds: [
						embeds.error('El **tiempo expiró**, inicie el proceso de nuevo'),
					],
					components: [],
				});
			}
		});
	},
};
