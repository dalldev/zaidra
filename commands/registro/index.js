const { SlashCommandBuilder } = require('@discordjs/builders');
const api = require(__dirname + '/../../apis/tools4Albion');

const embeds = require('./embeds');
const bottons = require('./botton');
const config = require(__dirname + '/../../config');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('registro')
		.setDescription('Iniciar sesion en el servidor')
		.addStringOption(option =>
			option
				.setName('apodo')
				.setDescription('Apodo de albion online.')
				.setRequired(true)
		),
	async execute(interaction) {
		await interaction.deferReply();

		await interaction.editReply({ embeds: [embeds.searching] });

		const nickname = await interaction.options.getString('apodo');

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

				await interaction.member.setNickname(peticion.pedido[page].Name);

				const rol = await interaction.guild.roles.cache.get(
					config.roles.registrado
				);

				await interaction.member.roles.add(rol);

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
