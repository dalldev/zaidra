const { Collection } = require('discord.js');
const { readdirSync } = require('fs');
const client = require('../index.js');

client.commands = new Collection();

const commandFolders = readdirSync(`${__dirname}/../commands`);

for (const folder of commandFolders) {
	const command = require(`${__dirname}/../commands/${folder}/index.js`);
	client.commands.set(command.data.name, command);
}

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'Ocurrio un error' });
		}
	},
};
