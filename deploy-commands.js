const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { readdirSync } = require('fs');
require('dotenv').config();

const commands = new Array();
const commandFiles = readdirSync(`${__dirname}/commands`).filter(f =>
	f.endsWith('.js')
);

for (const file of commandFiles) {
	const command = require(`${__dirname}/commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ vercion: '9' }).setToken(process.env.TOKEN);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(
				process.env.CLIENT_ID,
				process.env.GUILD_ID
			),
			{
				body: commands,
			}
		);

		console.log('Listo!');
	} catch (error) {
		console.error(error);
	}
})();
