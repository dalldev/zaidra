const { MessageEmbed, MessageAttachment } = require('discord.js');

const searching = new MessageEmbed()
	.setTitle('Buscando Jugador')
	.setDescription(
		'Espere, la búsqueda puede tardar entre 1 y 5 minutos, si necesita ayuda puede hacer clic [aquí](https://yotutube.com/).'
	);

const error = error =>
	new MessageEmbed().setTitle('Ha habido un problema').setDescription(error);

const menu = (page = 0, player) =>
	new MessageEmbed()
		.setTitle('Selecciona tu Personaje')
		.setDescription(
			'> Si aparece más de una página, usa los botones para moverte por el menu y así encontrar a tu personaje.'
		)
		.addField('Apodo', ` \`\`\`${player[page].Name}\`\`\` `)
		.addField('Gremio', ` \`\`\`${player[page].GuildName}\`\`\` `)
		.addField('Alianza', ` \`\`\`${player[page].AllianceName}\`\`\` `)
		.addField('Fama de Asesinato', ` \`\`\`${player[page].KillFame}\`\`\` `);

const bienvenida = player =>
	new MessageEmbed()
		.setTitle('Bienvenido')
		.setDescription(
			`El proceso de registro se ha completado con éxito.\n\nSe ha registrado como ${player.Name}`
		);

module.exports = { searching, error, menu, bienvenida };
