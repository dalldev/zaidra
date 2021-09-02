const { MessageActionRow, MessageButton } = require('discord.js');

const row = (ant = true, sig = true) =>
	new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId('ant')
			.setLabel('Anterior')
			.setStyle('PRIMARY')
			.setDisabled(ant),
		new MessageButton()
			.setCustomId('ace')
			.setLabel('Aceptar')
			.setStyle('SUCCESS'),
		new MessageButton()
			.setCustomId('can')
			.setLabel('Canselar')
			.setStyle('DANGER'),
		new MessageButton()
			.setCustomId('sig')
			.setLabel('Siguiente')
			.setStyle('PRIMARY')
			.setDisabled(sig)
	);

module.exports = { row };
